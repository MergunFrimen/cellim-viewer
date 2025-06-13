import json
from uuid import UUID, uuid4

from fastapi import Depends, HTTPException, Response, status
from sqlalchemy import inspect, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.contracts.requests.view_requests import ViewCreateRequest, ViewUpdateRequest
from app.api.v1.contracts.responses.view_responses import ViewResponse
from app.database.models.entry_model import Entry
from app.database.models.user_model import User
from app.database.models.view_model import View
from app.database.session_manager import get_async_session
from app.services.entry_service import EntryService, get_entry_service
from app.services.files.dependency import get_view_storage
from app.services.files.file_service import FileService


class ViewService:
    def __init__(
        self,
        session: AsyncSession,
        storage: FileService,
        entry_service: EntryService,
    ):
        self.session = session
        self.storage = storage
        self.entry_service = entry_service

    async def create(self, user: User, entry_id: UUID, request: ViewCreateRequest) -> ViewResponse:
        entry: Entry = await self.entry_service.get_entry_by_id(entry_id)

        # Check permissions
        if not entry.has_owner(user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
            )

        view_id = uuid4()
        thumbnail_url: str | None = None
        snapshot_url: str | None = None

        # Save snapshot
        if request.snapshot_json:
            try:
                file_path = f"/entries/{entry_id}/views/{view_id}/snapshot.json"
                snapshot_url = await self.storage.upload_file(
                    file_path=file_path,
                    file_data=request.snapshot_json.file,
                )
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error saving JSON snapshot: {str(e)}",
                )

        # Save image
        if request.thumbnail_image:
            try:
                thumbnail_url = await self.storage.save_view_image(
                    entry_id=entry_id,
                    view_id=view_id,
                    file_content=request.thumbnail_image.file,
                )
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error saving image: {str(e)}",
                )

        new_view = View(
            id=view_id,
            name=request.name,
            description=request.description,
            snapshot_url=snapshot_url,
            thumbnail_url=thumbnail_url,
            entry=entry,
        )

        self.session.add(new_view)
        await self.session.commit()

        return ViewResponse.model_validate(new_view)

    async def get_view(self, user: User, view_id: UUID) -> ViewResponse:
        view: View = self._get_view_by_id(view_id)

        # Load in relationships
        await self.session.refresh(view, ["entry"])

        # Check permissions
        if user is None and not view.entry.is_public:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Entry is not public",
            )
        if user is not None and not self._check_permissions(view, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Entry is not public",
            )

        return ViewResponse.model_validate(view)

    async def get_view_snapshot(self, user: User | None, entry_id: UUID, view_id: UUID) -> UUID:
        view: View = await self.get_view(view_id)

        # Check valid query params
        if view.entry_id != entry_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Entry '{entry_id}' does not have a view '{view_id}'",
            )

        # Check permissions
        if user is None and not view.entry.is_public:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Entry is not public",
            )
        if user is not None and not self._check_permissions(view, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Entry is not public",
            )

        snapshot = await self.storage.get_snapshot(
            entry_id=entry_id,
            view_id=view_id,
        )

        return json.loads(snapshot)

    async def get_view_thumbnail(self, user: User, entry_id: UUID, view_id: UUID) -> UUID:
        entry: Entry = await self.entry_service.get_entry_by_id(entry_id)
        view: View = await self.get_view(view_id)

        # Check permissions
        if entry.is_public or (user is not None and view.entry.user_id == user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Entry is not public",
            )

        thumbnail_image = await self.storage.get_view_image(
            entry_id=entry_id,
            view_id=view_id,
        )

        return Response(
            content=thumbnail_image,
            media_type="image/png",
        )

    async def list_views_for_entry(self, user: User | None, entry_id: UUID) -> list[ViewResponse]:
        entry: Entry = await self.entry_service.get_entry_by_id(entry_id)

        result = await self.session.execute(
            select(View).where(View.entry_id == entry_id),
        )
        views: list[View] = result.scalars().all()

        if not entry.is_public or (user is not None and entry.user_id == user.id):
            return (ViewResponse.model_validate(view) for view in views)

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
        )

    async def update(
        self,
        *,
        entry_id: UUID,
        view_id: UUID,
        user: User,
        updates: ViewUpdateRequest,
    ) -> View:
        # Get view
        view: View = await self.get_view(view_id)

        # Check valid query params
        if view.entry_id != entry_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Entry '{entry_id}' does not have view '{view_id}'",
            )

        # Load in relationships
        await self.createsession.refresh(view, ["entry"])

        # Check permissions
        self._check_permissions(view, user)

        # Update view
        view.update(updates.model_dump(exclude_unset=True))
        self.session.add(view)
        await self.session.commit()

        return view

    async def delete(self, user: User, view_id: UUID) -> UUID:
        # Get view
        view = await self.get_view(view_id)

        # Load in relationships
        await self.createsession.refresh(view, ["entry"])

        # Check permissions
        self._check_permissions(view, user)

        # Delete view
        await self.session.delete(view)
        await self.session.commit()

        return view_id

    async def _get_view_by_id(self, id: UUID) -> View:
        view: View | None = await self.session.get(View, id)
        if view is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="View not found",
            )
        return view

    async def _check_permissions(self, view: View, user: User) -> None:
        if not inspect(view).attrs.entry.loaded:
            await self.session.refresh(view, ["entry"])
        return view.entry.user_id != user.id


async def get_view_service(
    session: AsyncSession = Depends(get_async_session),
    entry_service: EntryService = Depends(get_entry_service),
    view_storage: FileService = Depends(get_view_storage),
) -> ViewService:
    return ViewService(
        session=session,
        entry_service=entry_service,
        storage=view_storage,
    )

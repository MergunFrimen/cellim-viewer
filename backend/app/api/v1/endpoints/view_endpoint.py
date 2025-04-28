import json
from typing import Annotated
from uuid import UUID, uuid4

from fastapi import APIRouter, Body, File, HTTPException, Path, Response
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from starlette import status

from app.api.v1.contracts.requests.view_requests import ViewCreateRequest, ViewUpdateRequest
from app.api.v1.contracts.responses.view_responses import ViewResponse
from app.api.v1.dependencies import (
    FileStorageDependency,
    OptionalUser,
    RequireUser,
    SessionDependency,
)
from app.api.v1.tags import Tags
from app.database.models.entry_model import Entry
from app.database.models.view_model import View

router = APIRouter(prefix="/entries/{entry_id}/views", tags=[Tags.views])


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=ViewResponse,
)
async def create_view(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    request: Annotated[ViewCreateRequest, File()],
    session: SessionDependency,
    current_user: RequireUser,
    file_storage: FileStorageDependency,
):
    entry = await session.get(Entry, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    if entry.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="entry.user_id != current_user"
        )

    view_id = uuid4()
    thumbnail_url: str | None = None
    snapshot_url: str | None = None

    # save snapshot
    if request.snapshot_json:
        try:
            snapshot_url = await file_storage.save_view_snapshot(
                entry_id=entry_id,
                view_id=view_id,
                file_content=request.snapshot_json.file,
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving JSON snapshot: {str(e)}")

    # save image
    if request.thumbnail_image:
        try:
            thumbnail_url = await file_storage.save_view_image(
                entry_id=entry_id,
                view_id=view_id,
                file_content=request.thumbnail_image.file,
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving image: {str(e)}")

    new_view = View(
        id=view_id,
        name=request.name,
        description=request.description,
        snapshot_url=snapshot_url,
        thumbnail_url=thumbnail_url,
        entry=entry,
    )

    session.add(new_view)
    await session.commit()

    return new_view


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=list[ViewResponse],
)
async def list_views_for_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    session: SessionDependency,
    current_user: OptionalUser,
):
    entry: Entry | None = await session.get(Entry, entry_id)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found",
        )

    result = await session.execute(
        select(View).where(View.entry_id == entry_id),
    )
    views: list[View] = result.scalars().all()

    if current_user is not None and entry.user_id == current_user.id:
        return (ViewResponse.model_validate(view) for view in views)

    if not entry.is_public:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
        )

    return (ViewResponse.model_validate(view) for view in views)


@router.get(
    "/{view_id}",
    status_code=status.HTTP_200_OK,
    response_model=ViewResponse,
)
async def get_view(
    view_id: Annotated[UUID, Path(title="View ID")],
    session: SessionDependency,
    current_user: OptionalUser,
):
    view: View | None = await session.get(View, view_id)
    if not view:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="View not found",
        )

    result: View | None = await session.execute(
        select(View).where(View.id == view_id).options(selectinload(View.entry))
    )
    view = result.scalar()

    if current_user is not None and view.entry.user_id == current_user.id:
        return ViewResponse.model_validate(view)

    if not view.entry.is_public:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Entry is not public",
        )

    return ViewResponse.model_validate(view)


@router.get(
    "/{view_id}/snapshot.json",
    status_code=status.HTTP_200_OK,
    response_class=JSONResponse,
)
async def get_view_snapshot(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    view_id: Annotated[UUID, Path(title="View ID")],
    current_user: OptionalUser,
    session: SessionDependency,
    file_storage: FileStorageDependency,
):
    entry: Entry | None = await session.get(Entry, entry_id)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found",
        )

    view: View | None = await session.get(View, view_id)
    if not view:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="View not found",
        )

    if (
        not (current_user is not None and view.entry.user_id == current_user.id)
        or not entry.is_public
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Entry is not public",
        )

    snapshot = await file_storage.get_snapshot(
        entry_id=entry_id,
        view_id=view_id,
    )

    return json.loads(snapshot)


@router.get(
    "/{view_id}/thumbnail.png",
    status_code=status.HTTP_200_OK,
    response_class=Response,
)
async def get_view_thumbnail_image(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    view_id: Annotated[UUID, Path(title="View ID")],
    current_user: OptionalUser,
    session: SessionDependency,
    file_storage: FileStorageDependency,
):
    entry: Entry | None = await session.get(Entry, entry_id)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found",
        )

    view: View | None = await session.get(View, view_id)
    if not view:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="View not found",
        )

    if (
        not (current_user is not None and view.entry.user_id == current_user.id)
        or not entry.is_public
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Entry is not public",
        )

    thumbnail_image = await file_storage.get_view_image(
        entry_id=entry_id,
        view_id=view_id,
    )

    return Response(content=thumbnail_image, media_type="image/png")


@router.put(
    "/{view_id}",
    status_code=status.HTTP_200_OK,
    response_model=ViewResponse,
)
async def update_view(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    view_id: Annotated[UUID, Path(title="View ID")],
    request: Annotated[ViewUpdateRequest, Body()],
    session: SessionDependency,
    current_user: RequireUser,
):
    entry = await session.get(Entry, entry_id)
    view = await session.get(View, view_id)

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found",
        )
    if not view:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="View not found",
        )

    if entry.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
        )

    view.update(request.model_dump(exclude_unset=True))
    session.add(view)

    await session.commit()

    return ViewResponse.model_validate(view)


@router.delete(
    "/{view_id}",
    status_code=status.HTTP_200_OK,
    response_model=UUID,
)
async def delete_view(
    view_id: Annotated[UUID, Path(title="View ID")],
    session: SessionDependency,
    _: RequireUser,
):
    view = await session.get(View, view_id)
    if not view:
        raise HTTPException(status_code=404, detail="Entry not found")
    await session.delete(view)
    await session.commit()
    return view_id

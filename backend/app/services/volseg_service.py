from uuid import UUID

from fastapi import Depends, HTTPException, status
from sqlalchemy import inspect, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.contracts.requests.volseg_requests import VolsegUploadEntry
from app.api.v1.contracts.responses.volseg_responses import VolsegEntryResponse
from app.database.models.user_model import User
from app.database.models.volseg_entry_model import VolsegEntry
from app.database.session_manager import get_async_session
from app.services.files.local_storage import LocalStorage, get_local_storage
from app.services.files.minio_storage import MinioStorage


class VolsegService:
    def __init__(
        self,
        session: AsyncSession,
        storage: MinioStorage,
    ):
        self.session = session
        self.storage = storage

    async def upload_entry(self, user: User, request: VolsegUploadEntry) -> VolsegEntryResponse:
        result = await self.session.execute(
            select(VolsegEntry).where(
                (VolsegEntry.user_id == user.id)
                & (VolsegEntry.db_name == request.db_name)
                & (VolsegEntry.entry_id == request.entry_id)
            )
        )
        volseg_entries: list[VolsegEntry] = result.scalars().all()

        # check if it already exists
        if len(volseg_entries) != 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Volseg entry with dbname '{request.db_name}' and entryId '{request.entry_id}' already exists.",
            )

        # store all files
        base_path = f"/volseg_entries/emdb/{request.entry_id}"
        await self.storage.save(
            file_path=f"{base_path}/{request.annotations.filename}",
            file_data=request.annotations.file,
        )
        await self.storage.save(
            file_path=f"{base_path}/{request.metadata.filename}",
            file_data=request.metadata.file,
        )
        await self.storage.save(
            file_path=f"{base_path}/{request.data.filename}",
            file_data=request.data.file,
        )

        volseg_entry = VolsegEntry(
            db_name=request.db_name,
            entry_id=request.entry_id,
            is_public=request.is_public,
            user=user,
        )

        self.session.add(volseg_entry)
        await self.session.commit()

        return VolsegEntryResponse.model_validate(volseg_entry)

    async def get_entry_by_id(self, user: User, volseg_entry_id: UUID) -> VolsegEntryResponse:
        volseg_entry: VolsegEntry = await self._get_volseg_entry_by_id(volseg_entry_id)

        # Check permissions
        if user is None and not entry.is_public:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Entry is not public",
            )
        if user is not None and volseg_entry.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Entry is not public",
            )

        return VolsegEntryResponse.model_validate(volseg_entry)

    async def list_public_entries(self) -> list[VolsegEntryResponse]:
        result = await self.session.execute(
            select(VolsegEntry).where(VolsegEntry.is_public == True),
        )
        entries: list[VolsegEntry] = result.scalars().all()
        return [VolsegEntryResponse.model_validate(entry) for entry in entries]

    async def list_entries(self, user: User) -> list[VolsegEntryResponse]:
        result = await self.session.execute(
            select(VolsegEntry).where(VolsegEntry.user_id == user.id),
        )
        volseg_entries: list[VolsegEntry] = result.scalars().all()
        return [VolsegEntryResponse.model_validate(entry) for entry in volseg_entries]

    async def delete_entry(self, user: User, volseg_entry_id: UUID) -> UUID:
        # Get view
        volseg_entry: VolsegEntry = await self._get_volseg_entry_by_id(volseg_entry_id)

        # Check permissions
        self._check_permissions(volseg_entry, user)

        # Delete files
        file_path = f"/volseg_entries/emdb/{volseg_entry.entry_id}"
        await self.storage.delete_directory(file_path)

        # Delete view
        await self.session.delete(volseg_entry)
        await self.session.commit()

        return volseg_entry.id

    async def _get_volseg_entry_by_id(self, id: UUID) -> VolsegEntry:
        volseg_entry: VolsegEntry | None = await self.session.get(VolsegEntry, id)
        if volseg_entry is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="View not found",
            )
        return volseg_entry

    async def _check_permissions(self, volseg_entry: VolsegEntry, user: User) -> None:
        if not inspect(volseg_entry).attrs.entry.loaded:
            await self.session.refresh(volseg_entry, ["user"])
        return volseg_entry.user.id != user.id


async def get_volseg_service(
    session: AsyncSession = Depends(get_async_session),
    storage: LocalStorage = Depends(get_local_storage),
) -> VolsegService:
    return VolsegService(
        session=session,
        storage=storage,
    )

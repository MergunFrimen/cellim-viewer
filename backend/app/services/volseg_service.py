from uuid import UUID

from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.contracts.requests.volseg_requests import VolsegUploadEntry
from app.api.v1.contracts.responses.volseg_responses import VolsegEntryResponse
from app.database.models.user_model import User
from app.database.models.volseg_entry_model import VolsegEntry
from app.database.session_manager import get_async_session
from app.services.files.minio_storage import MinioStorage, get_minio_storage


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
                VolsegEntry.user_id == user.id
                and VolsegEntry.db_name == request.db_name
                and VolsegEntry.entry_id == request.entry_id,
            ),
        )
        volseg_entries: list[VolsegEntry] = result.scalars().all()

        # check if it already exists
        if volseg_entries:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Volseg entry with dbname '{request.db_name}' and entryId '{request.entry_id}' already exists.",
            )

        # store all files
        base_path = f"/volseg_entries/{user.id}/{request.db_name}/{request.entry_id}"
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
            user=user,
        )

        self.session.add(volseg_entry)
        await self.session.commit()

        return VolsegEntryResponse.model_validate(volseg_entry)

    async def _get_volseg_entry_by_id(self, id: UUID) -> VolsegEntry:
        volseg_entry: VolsegEntry | None = await self.session.get(VolsegEntry, id)
        if volseg_entry is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="View not found",
            )
        return volseg_entry


async def get_volseg_service(
    session: AsyncSession = Depends(get_async_session),
    storage: MinioStorage = Depends(get_minio_storage),
) -> VolsegService:
    return VolsegService(
        session=session,
        storage=storage,
    )

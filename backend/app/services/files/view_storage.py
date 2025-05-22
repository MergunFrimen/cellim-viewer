from typing import BinaryIO
from uuid import UUID

from app.core.settings import get_settings
from app.services.files.storage_backend.base_storage_backend import StorageBackend


class FileService:
    def __init__(self, backend: StorageBackend):
        self.backend = backend

    def _generate_url(self, file_path: str):
        return f"{get_settings().APP_URL}{get_settings().API_V1_PREFIX}{file_path}"

    def _get_file_path(
        self,
        entry_id: UUID,
        view_id: UUID,
        file_name: str,
    ):
        return f"/entries/{entry_id}/views/{view_id}/{file_name}"

    def _get_image_file_path(
        self,
        entry_id: UUID,
        view_id: UUID,
    ):
        return self._get_file_path(
            entry_id=entry_id,
            view_id=view_id,
            file_name="thumbnail.png",
        )

    def _get_snapshot_file_path(
        self,
        entry_id: UUID,
        view_id: UUID,
    ):
        return self._get_file_path(
            entry_id=entry_id,
            view_id=view_id,
            file_name="snapshot.json",
        )

    async def save_view_image(
        self,
        entry_id: UUID,
        view_id: UUID,
        file_content: BinaryIO,
    ) -> str:
        file_path = self._get_image_file_path(
            entry_id=entry_id,
            view_id=view_id,
        )
        await self.backend.save_file(file_content, file_path)
        return self._generate_url(file_path=file_path)

    async def save_view_snapshot(
        self,
        entry_id: UUID,
        view_id: UUID,
        file_content: BinaryIO,
    ) -> str:
        file_path = self._get_snapshot_file_path(
            entry_id=entry_id,
            view_id=view_id,
        )
        await self.backend.save_file(file_content, file_path)
        return self._generate_url(file_path=file_path)

    async def get_view_image(
        self,
        entry_id: UUID,
        view_id: UUID,
    ) -> bytes:
        file_path = self._get_image_file_path(
            entry_id=entry_id,
            view_id=view_id,
        )
        return await self.backend.get_file(file_path)

    async def get_snapshot(
        self,
        entry_id: UUID,
        view_id: UUID,
    ) -> bytes:
        file_path = self._get_snapshot_file_path(
            entry_id=entry_id,
            view_id=view_id,
        )
        return await self.backend.get_file(file_path)

    async def delete_view_files(
        self,
        entry_id: UUID,
        view_id: UUID,
    ) -> bool:
        image_file_path = self._get_image_file_path(
            entry_id=entry_id,
            view_id=view_id,
        )
        snapshot_file_path = self._get_snapshot_file_path(
            entry_id=entry_id,
            view_id=view_id,
        )
        try:
            await self.backend.delete_file(image_file_path)
            await self.backend.delete_file(snapshot_file_path)
            return True
        except FileNotFoundError:
            return False

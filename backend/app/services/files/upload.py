from abc import abstractmethod
from functools import lru_cache
from typing import BinaryIO, Protocol
from uuid import UUID

from app.core.settings import get_settings
from app.services.files.minio import MinioBackend


class StorageBackend(Protocol):
    """Protocol defining storage operations."""

    @abstractmethod
    async def save_file(self, file_content: BinaryIO, file_path: str) -> str:
        """Save file to storage and return the path."""
        pass

    @abstractmethod
    async def get_file(self, file_path: str) -> bytes:
        """Get file content from storage."""
        pass

    @abstractmethod
    async def delete_file(self, file_path: str) -> bool:
        """Delete file from storage."""
        pass


class FileStorage:
    """Service for handling file storage operations."""

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


@lru_cache
def get_file_storage():
    return FileStorage(
        MinioBackend(
            endpoint=get_settings().MINIO_ENDPOINT,
            access_key=get_settings().MINIO_ACCESS_KEY,
            secret_key=get_settings().MINIO_SECRET_KEY,
            bucket=get_settings().MINIO_BUCKET,
            secure=get_settings().MINIO_SECURE,
        )
    )

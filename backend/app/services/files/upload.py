import os
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

    async def save_view_image(
        self,
        entry_id: UUID,
        view_id: UUID,
        file_content: BinaryIO,
        filename: str,
    ) -> str:
        extension = os.path.splitext(filename)[1].lower()
        file_path = f"entries/{entry_id}/views/{view_id}/thumbnail.png"
        return await self.backend.save_file(file_content, file_path)

    async def save_view_snapshot(
        self,
        entry_id: UUID,
        view_id: UUID,
        file_content: BinaryIO,
    ) -> str:
        file_path = f"entries/{entry_id}/views/{view_id}/snapshot.json"
        return await self.backend.save_file(file_content, file_path)

    async def get_view_image(self, file_path: str) -> bytes:
        return await self.backend.get_file(file_path)

    async def delete_view_files(self, entry_id: UUID, view_id: UUID) -> bool:
        base_path = f"entries/{entry_id}/views/{view_id}"
        try:
            await self.backend.delete_file(f"{base_path}/thumbnail.png")
            await self.backend.delete_file(f"{base_path}/snapshot.json")
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

import os
import shutil
from abc import abstractmethod
from pathlib import Path
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


class LocalStorageBackend:
    """Implementation of storage operations using local filesystem."""

    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        # Create base directory if it doesn't exist
        os.makedirs(self.base_path, exist_ok=True)

    async def save_file(self, file_content: BinaryIO, file_path: str) -> str:
        """Save file to local storage."""
        full_path = self.base_path / file_path

        # Create directories if they don't exist
        os.makedirs(os.path.dirname(full_path), exist_ok=True)

        # Save the file
        with open(full_path, "wb") as f:
            shutil.copyfileobj(file_content, f)

        return file_path

    async def get_file(self, file_path: str) -> bytes:
        """Get file from local storage."""
        full_path = self.base_path / file_path

        if not os.path.exists(full_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        with open(full_path, "rb") as f:
            return f.read()

    async def delete_file(self, file_path: str) -> bool:
        """Delete file from local storage."""
        full_path = self.base_path / file_path

        if not os.path.exists(full_path):
            return False

        os.remove(full_path)
        return True


class FileStorage:
    """Service for handling file storage operations."""

    def __init__(self, backend: StorageBackend):
        self.backend = backend

    async def save_view_image(self, view_id: UUID, file_content: BinaryIO, filename: str) -> str:
        """Save an image for a view."""
        # Generate a path based on view ID to avoid filename collisions
        extension = os.path.splitext(filename)[1].lower()
        file_path = f"views/{view_id}/image{extension}"

        return await self.backend.save_file(file_content, file_path)

    async def save_view_snapshot(self, view_id: UUID, file_content: BinaryIO) -> str:
        """Save a snapshot file for a view."""
        file_path = f"views/{view_id}/snapshot.json"

        return await self.backend.save_file(file_content, file_path)

    async def get_view_image(self, file_path: str) -> bytes:
        """Get a view image."""
        return await self.backend.get_file(file_path)

    async def delete_view_files(self, view_id: UUID) -> bool:
        """Delete all files associated with a view."""
        base_path = f"views/{view_id}"
        # In a real implementation, you might need to list and delete all files
        # For now, we'll assume the structure is fixed
        try:
            await self.backend.delete_file(f"{base_path}/image.jpg")
            await self.backend.delete_file(f"{base_path}/snapshot.json")
            return True
        except FileNotFoundError:
            return False


# local_backend = LocalStorageBackend(settings.FILE_STORAGE_PATH)
# file_storage = FileStorage(local_backend)

file_storage = FileStorage(
    MinioBackend(
        endpoint=get_settings().MINIO_ENDPOINT,
        access_key=get_settings().MINIO_ACCESS_KEY,
        secret_key=get_settings().MINIO_SECRET_KEY,
        bucket=get_settings().MINIO_BUCKET,
        secure=get_settings().MINIO_SECURE,
    )
)

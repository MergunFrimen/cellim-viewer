from abc import abstractmethod
from typing import BinaryIO, Protocol


class BaseStorageBackend(Protocol):
    @abstractmethod
    async def save_file(self, file_content: BinaryIO, file_path: str) -> str:
        """Save file to storage and return the path."""
        raise NotImplementedError

    @abstractmethod
    async def get_file(self, file_path: str) -> bytes:
        """Get file content from storage."""
        raise NotImplementedError

    @abstractmethod
    async def delete_file(self, file_path: str) -> bool:
        """Delete file from storage."""
        raise NotImplementedError

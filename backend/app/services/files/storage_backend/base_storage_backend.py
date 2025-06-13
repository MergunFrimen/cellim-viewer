from abc import ABC, abstractmethod
from typing import BinaryIO


class StorageBackend(ABC):
    @abstractmethod
    async def save(self, file_path: str, file_data: BinaryIO) -> str:
        pass

    @abstractmethod
    async def delete(self, file_path: str) -> bool:
        pass

    @abstractmethod
    async def get(self, file_path: str) -> BinaryIO:
        pass

    @abstractmethod
    async def list(self, prefix: str | None = "") -> list[str]:
        pass

    @abstractmethod
    async def exists(self, file_path: str) -> bool:
        pass

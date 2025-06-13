from typing import BinaryIO

from app.services.files.storage_backend.base_storage_backend import StorageBackend


class FileService:
    def __init__(self, backend: StorageBackend):
        self.backend = backend

    async def upload_file(self, file_path: str, file_data: BinaryIO) -> None:
        await self.backend.save(file_path, file_data)

    async def delete_file(self, file_path: str) -> None:
        await self.backend.delete(file_path)

    async def get_file(self, file_path: str) -> BinaryIO:
        return await self.backend.get(file_path)

    async def list_files(self, prefix: str | None = "") -> list[str]:
        return await self.backend.list(prefix)

    async def file_exists(self, file_path: str) -> bool:
        return await self.backend.exists(file_path)

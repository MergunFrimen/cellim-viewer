from typing import BinaryIO, List, Optional

from app.services.files.storage_backend.base_storage_backend import StorageBackend


class FileService:
    def __init__(self, backend: StorageBackend):
        self.backend = backend

    def upload_file(self, file_path: str, file_data: BinaryIO) -> None:
        self.backend.save(file_path, file_data)

    def delete_file(self, file_path: str) -> None:
        self.backend.delete(file_path)

    def get_file(self, file_path: str) -> BinaryIO:
        return self.backend.get(file_path)

    def list_files(self, prefix: Optional[str] = "") -> List[str]:
        return self.backend.list(prefix)

    def file_exists(self, file_path: str) -> bool:
        return self.backend.exists(file_path)

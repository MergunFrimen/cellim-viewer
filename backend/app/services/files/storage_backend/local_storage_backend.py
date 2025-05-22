import os
from typing import BinaryIO, List, Optional

from app.services.files.storage_backend.base_storage_backend import StorageBackend


class LocalStorageBackend(StorageBackend):
    def __init__(self, base_path: str):
        self.base_path = base_path
        os.makedirs(base_path, exist_ok=True)

    def _full_path(self, file_path: str) -> str:
        return os.path.join(self.base_path, file_path)

    def save(self, file_path: str, file_data: BinaryIO) -> None:
        full_path = self._full_path(file_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "wb") as out_file:
            out_file.write(file_data.read())

    def delete(self, file_path: str) -> None:
        os.remove(self._full_path(file_path))

    def get(self, file_path: str) -> BinaryIO:
        return open(self._full_path(file_path), "rb")

    def list(self, prefix: Optional[str] = "") -> List[str]:
        base = os.path.join(self.base_path, prefix)
        file_list = []
        for root, _, files in os.walk(base):
            for file in files:
                relative_path = os.path.relpath(os.path.join(root, file), self.base_path)
                file_list.append(relative_path)
        return file_list

    def exists(self, file_path: str) -> bool:
        return os.path.exists(self._full_path(file_path))

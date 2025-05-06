import os
import shutil
from pathlib import Path
from typing import BinaryIO


class LocalStorageBackend:
    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        os.makedirs(self.base_path, exist_ok=True)

    async def save_file(self, file_content: BinaryIO, file_path: str) -> str:
        full_path = self.base_path / file_path

        os.makedirs(os.path.dirname(full_path), exist_ok=True)

        with open(full_path, "wb") as f:
            shutil.copyfileobj(file_content, f)

        return file_path

    async def get_file(self, file_path: str) -> bytes:
        full_path = self.base_path / file_path

        if not os.path.exists(full_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        with open(full_path, "rb") as f:
            return f.read()

    async def delete_file(self, file_path: str) -> bool:
        full_path = self.base_path / file_path

        if not os.path.exists(full_path):
            return False

        os.remove(full_path)
        return True

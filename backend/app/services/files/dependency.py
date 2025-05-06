from functools import lru_cache

from app.core.settings import get_settings
from app.services.files.file_storage import FileStorage
from app.services.files.storage_backend.local_storage_backend import LocalStorageBackend


@lru_cache
def get_file_storage():
    return FileStorage(
        LocalStorageBackend(
            base_path=get_settings().FILE_STORAGE_BASE_PATH,
        )
    )

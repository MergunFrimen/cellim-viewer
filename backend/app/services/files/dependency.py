from functools import lru_cache

from app.core.settings import get_settings
from app.services.files.file_service import FileService
from app.services.files.storage_backend.local_storage_backend import LocalStorageBackend
from app.services.files.storage_backend.minio_storage_backend import MinioStorageBackend


@lru_cache
def get_view_storage():
    settings = get_settings()
    return FileService(
        MinioStorageBackend(
            endpoint=settings.MINIO_ENDPOINT,
            bucket=settings.MINIO_BUCKET,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE,
        )
    )

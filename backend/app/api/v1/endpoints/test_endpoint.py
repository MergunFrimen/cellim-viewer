from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, File, UploadFile
from pydantic import BaseModel

from app.core.settings import get_settings
from app.services.files.storage_backend.minio_storage_backend import MinioStorageBackend

router = APIRouter(prefix="/test", tags=["Testing"])


class UploadFileRequest(BaseModel):
    file: UploadFile = File()

    model_config = {"extra": "forbid"}


@router.post("/upload")
async def upload_file(
    request: Annotated[UploadFileRequest, File()],
):
    settings = get_settings()
    print(settings.MINIO_ENDPOINT)
    storage = MinioStorageBackend(
        endpoint=settings.MINIO_ENDPOINT,
        bucket=settings.MINIO_BUCKET,
        access_key=settings.MINIO_ACCESS_KEY,
        secret_key=settings.MINIO_SECRET_KEY,
        secure=settings.MINIO_SECURE,
    )

    await storage.save(
        f"somewhere/{uuid4()}",
        request.file.file,
    )

    return "OK"

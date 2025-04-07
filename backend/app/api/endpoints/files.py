from typing import Annotated

from fastapi import APIRouter, File, UploadFile

router = APIRouter(tags=["files"])


@router.post("")
async def create_file(file: Annotated[bytes, File()]):
    return {"file_size": len(file)}


@router.post("/uploadfile/")
async def create_upload_file(
    file: Annotated[list[UploadFile], File()],
):
    return {"filename": file}

from typing import Annotated

from fastapi import APIRouter, Cookie, File, UploadFile

router = APIRouter(tags=["files"])


@router.post("")
async def create_file(
    file: Annotated[bytes, File()], ads_id: Annotated[str | None, Cookie()] = None
):
    return {"file_size": len(file), "ads_id": ads_id}


@router.post("/uploadfile/")
async def create_upload_file(
    file: Annotated[list[UploadFile], File()],
):
    return {"filename": file}

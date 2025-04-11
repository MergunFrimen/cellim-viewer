from typing import Annotated

from fastapi import APIRouter, Cookie, File, Response, UploadFile
from pydantic import BaseModel

from backend.app.api.v1.tags import Tags

router = APIRouter(prefix="/files", tags=[Tags.files])


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


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: list[str] = []


@router.get("/items/")
async def read_items() -> Annotated[list[Item], Response()]:
    return [
        {"name": "Portal Gun", "price": 42.0},
        {"name": "Plumbus", "price": 32.0},
    ]

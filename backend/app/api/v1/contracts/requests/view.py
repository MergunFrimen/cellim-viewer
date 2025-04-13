from fastapi import File, Form, UploadFile
from pydantic import BaseModel


class BaseViewRequest(BaseModel):
    name: str = Form(max_length=255, examples=["View Name"])
    description: str | None = Form(default=None, max_length=255, examples=["View Description"])


class ViewCreateRequest(BaseViewRequest):
    thumbnail_image: UploadFile | None = File(default=None, description="Thumbnail image for view")
    snapshot_json: UploadFile | None = File(
        default=None, description="Mol* state file (.molj file)"
    )


class ViewUpdateRequest(BaseViewRequest):
    pass

from fastapi import File, Form, UploadFile
from pydantic import BaseModel, Field


class ViewCreateRequest(BaseModel):
    name: str = Form(max_length=255, examples=["View Name"])
    description: str | None = Form(default=None, max_length=255, examples=["View Description"])
    snapshot_json: UploadFile = File(description="Mol* state file (.molj file)")
    thumbnail_image: UploadFile | None = File(default=None, description="Thumbnail image for view")
    is_thumbnail: bool = Form(default=False)

    model_config = {"extra": "forbid"}


class ViewUpdateRequest(BaseModel):
    name: str | None = Field(default=None, max_length=255, examples=["View Name"])
    description: str | None = Field(default=None, max_length=255, examples=["View Description"])
    snapshot_json: UploadFile | None = File(description="Mol* state file (.molj file)")
    thumbnail_image: UploadFile | None = File(default=None, description="Thumbnail image for view")
    is_thumbnail: bool | None = Field(default=None)

    model_config = {"extra": "forbid"}

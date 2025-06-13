from fastapi import File, Form, UploadFile
from pydantic import BaseModel, Field


class ViewCreateRequest(BaseModel):
    name: str = Form(max_length=255, examples=["View Name"])
    description: str | None = Form(default=None, max_length=255, examples=["View Description"])
    snapshot_json: UploadFile = File(description="Mol* state file (.molj file)")
    thumbnail_image: UploadFile | None = File(default=None, description="Thumbnail image for view")

    model_config = {"extra": "forbid"}


class ViewUpdateRequest(BaseModel):
    name: str | None = Field(default=None, max_length=255, examples=["View Name"])
    description: str | None = Field(default=None, max_length=255, examples=["View Description"])

    model_config = {"extra": "forbid"}

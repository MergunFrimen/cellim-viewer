from fastapi import Form, File, UploadFile
from pydantic import BaseModel, Field, ConfigDict


class ViewRequest(BaseModel):
    name: str = Field(max_length=255, examples=["View Name"])
    description: str | None = Field(default=None, examples=["Markdown description."])

    model_config = ConfigDict(from_attributes=True)


class ViewCreateRequest(ViewRequest):
    name: str = Form()
    description: str | None = (Form(default=None),)
    thumbnail_image: UploadFile | None = (File(default=None),)
    snapshot_json: str | None = (Form(default=None),)


class ViewUpdateRequest(BaseModel):
    pass

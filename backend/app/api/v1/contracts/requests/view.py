from typing import Any, Dict
from uuid import UUID

from fastapi import Form, UploadFile
from pydantic import BaseModel, Field


class ViewCreateRequest(BaseModel):
    entry_id: UUID
    name: str = Field(max_length=255)
    description: str | None = Field(default=None, max_length=255)
    snapshot: Dict[str, Any] | None = Field(default=None)


class ViewUpdateRequest(BaseModel):
    name: str | None = Field(default=None, max_length=255)
    description: str | None = Field(default=None, max_length=255)
    snapshot: Dict[str, Any] | None = Field(default=None)


# Form model for multipart/form-data request with file upload
class ViewCreateFormRequest:
    def __init__(
        self,
        entry_id: UUID = Form(...),
        name: str = Form(...),
        description: str | None = Form(None),
        image: UploadFile | None = None,
        snapshot: Dict[str, Any] | None = None,
    ):
        self.entry_id = entry_id
        self.name = name
        self.description = description
        self.image = image
        self.snapshot = snapshot


class ViewUpdateFormRequest:
    def __init__(
        self,
        name: str | None = Form(None),
        description: str | None = Form(None),
        image: UploadFile | None = None,
        snapshot: Dict[str, Any] | None = None,
    ):
        self.name = name
        self.description = description
        self.image = image
        self.snapshot = snapshot

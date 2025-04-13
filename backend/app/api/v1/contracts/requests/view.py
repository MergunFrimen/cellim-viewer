from uuid import UUID

from fastapi import Form
from pydantic import BaseModel


class ViewRequest(BaseModel):
    name: str = Form(max_length=255, examples=["View Name"])
    description: str | None = Form(default=None, examples=["Markdown description."])


# TODO: figure out how to put File and Form stuff into pydantic model
class ViewCreateRequest(ViewRequest):
    pass


class ViewUpdateRequest(ViewRequest):
    pass

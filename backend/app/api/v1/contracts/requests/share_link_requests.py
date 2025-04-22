from pydantic import BaseModel, Field


class ShareLinkUpdateRequest(BaseModel):
    is_editable: bool | None = Field(default=None)
    is_active: bool | None = Field(default=None)

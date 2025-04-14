from pydantic import BaseModel, Field

from app.api.v1.contracts.common import Timestamp, Uuid


class EntryPreviewResponse(Uuid, Timestamp, BaseModel):
    name: str = Field(max_length=255, examples=["Entry Name"])
    description: str | None = Field(default=None, examples=["Markdown description."])
    thumbnail_url: str | None = Field(default=None, examples=["URL for entry thumbnail preview"])


class EntryWithViewsResponse(Timestamp, BaseModel):
    name: str = Field(max_length=255)
    description: str | None = None
    is_public: bool = False
    # link: ShareLinkBase
    # views: list[ViewResponse]


class PrivateEntryResponse(Timestamp, BaseModel):
    name: str = Field(max_length=255)
    description: str | None = None
    is_public: bool = False
    # link: ShareLinkResponse
    # views: list[ViewResponse]

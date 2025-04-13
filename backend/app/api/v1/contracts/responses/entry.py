from datetime import datetime

from pydantic import BaseModel, Field


class Timestamp:
    created_at: datetime
    updated_at: datetime


class EntryResponse(BaseModel):
    name: str = Field(max_length=255)
    description: str | None = None
    is_public: bool = False


class EntryWithViewsResponse(BaseModel, Timestamp):
    name: str = Field(max_length=255)
    description: str | None = None
    is_public: bool = False
    # link: ShareLinkBase
    # views: list[ViewResponse]

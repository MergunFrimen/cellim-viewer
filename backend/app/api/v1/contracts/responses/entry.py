from pydantic import BaseModel, Field

from app.api.v1.contracts.common.timestamp import Timestamp


class PublicEntryResponse(BaseModel, Timestamp):
    name: str = Field(max_length=255)
    description: str | None = None
    is_public: bool = False


class EntryWithViewsResponse(BaseModel, Timestamp):
    name: str = Field(max_length=255)
    description: str | None = None
    is_public: bool = False
    # link: ShareLinkBase
    # views: list[ViewResponse]


class PrivateEntryResponse(BaseModel, Timestamp):
    name: str = Field(max_length=255)
    description: str | None = None
    is_public: bool = False
    # link: ShareLinkResponse
    # views: list[ViewResponse]

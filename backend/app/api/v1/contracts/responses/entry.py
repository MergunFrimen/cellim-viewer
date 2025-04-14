from pydantic import BaseModel, ConfigDict, Field

from app.api.v1.contracts.common import DebugModelName, Timestamp, Uuid


class PublicEntryPreviewResponse(Uuid, Timestamp, DebugModelName, BaseModel):
    name: str = Field(max_length=255, examples=["Entry Name"])
    description: str | None = Field(default=None, examples=["Markdown description."])
    thumbnail_url: str | None = Field(default=None, examples=["URL for entry thumbnail preview"])
    is_public: bool = Field(default=False)

    model_config = ConfigDict(from_attributes=True)


class PublicEntryResponse(Uuid, Timestamp, DebugModelName, BaseModel):
    name: str = Field(max_length=255, examples=["Entry Name"])
    description: str | None = Field(default=None, examples=["Markdown description."])
    thumbnail_url: str | None = Field(default=None, examples=["URL for entry thumbnail preview"])
    is_public: bool = Field(default=False)

    model_config = ConfigDict(from_attributes=True)


class PrivateEntryResponse(Uuid, Timestamp, DebugModelName, BaseModel):
    name: str = Field(max_length=255, examples=["Entry Name"])
    description: str | None = Field(default=None, examples=["Markdown description."])
    thumbnail_url: str | None = Field(default=None, examples=["URL for entry thumbnail preview"])
    is_public: bool = Field(default=False)
    # link: ShareLinkBase
    # views: list[ViewResponse]

    model_config = ConfigDict(from_attributes=True)

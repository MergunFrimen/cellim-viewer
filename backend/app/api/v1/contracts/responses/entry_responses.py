from pydantic import BaseModel, ConfigDict, Field

from app.api.v1.contracts.responses.common import DebugModelName, Timestamp, Uuid
from app.api.v1.contracts.responses.share_link_responses import PrivateShareLinkResponse
from app.api.v1.contracts.responses.view_responses import PrivateViewResponse, PublicViewResponse


class EntryResponse(Uuid, BaseModel):
    name: str = Field(max_length=255, examples=["Entry Name"])
    description: str | None = Field(default=None, examples=["Markdown description."])
    thumbnail_url: str | None = Field(default=None, examples=["URL for entry thumbnail preview"])


class PublicEntryPreviewResponse(EntryResponse, DebugModelName, BaseModel):
    model_config = ConfigDict(from_attributes=True)


class PublicEntryDetailsResponse(Timestamp, EntryResponse, DebugModelName, BaseModel):
    views: list[PublicViewResponse]

    model_config = ConfigDict(from_attributes=True)


class PrivateEntryDetailsResponse(Timestamp, EntryResponse, DebugModelName, BaseModel):
    is_public: bool

    views: list[PrivateViewResponse]
    link: PrivateShareLinkResponse

    model_config = ConfigDict(from_attributes=True)

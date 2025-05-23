from pydantic import BaseModel, ConfigDict, Field

from app.api.v1.contracts.responses.common import DebugModelName, Timestamp, Uuid


class EntryResponse(Timestamp, Uuid, BaseModel):
    name: str = Field(max_length=255, examples=["Entry Name"])
    description: str | None = Field(default=None, examples=["Markdown description."])
    thumbnail_url: str | None = Field(default=None, examples=["URL for entry thumbnail preview"])
    is_public: bool

    model_config = ConfigDict(from_attributes=True)


class EntryPreviewResponse(EntryResponse, DebugModelName):
    pass


class EntryDetailsResponse(EntryResponse, DebugModelName):
    pass

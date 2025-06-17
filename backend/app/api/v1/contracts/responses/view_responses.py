from pydantic import BaseModel, ConfigDict, Field

from app.api.v1.contracts.responses.common import DebugModelName, Timestamp, Uuid


class ViewResponse(Timestamp, Uuid, DebugModelName, BaseModel):
    name: str = Field(max_length=255)
    description: str | None = Field()
    # TODO: update with HttpUrl
    thumbnail_url: str | None = Field(max_length=2083)
    snapshot_url: str = Field(max_length=2083)
    is_thumbnail: bool = Field()

    model_config = ConfigDict(from_attributes=True)

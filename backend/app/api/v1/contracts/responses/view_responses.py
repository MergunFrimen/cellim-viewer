from pydantic import BaseModel, ConfigDict, Field

from app.api.v1.contracts.responses.common import DebugModelName, Timestamp, Uuid


class ViewResponse(Timestamp, Uuid, DebugModelName, BaseModel):
    name: str = Field(max_length=255)
    description: str | None = Field(default=None)
    # TODO: update with HttpUrl
    thumbnail_url: str | None = Field(max_length=2083)
    snapshot_url: str = Field(max_length=2083)

    model_config = ConfigDict(from_attributes=True)

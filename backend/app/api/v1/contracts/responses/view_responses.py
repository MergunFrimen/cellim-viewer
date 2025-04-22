from pydantic import BaseModel, ConfigDict, Field

from app.api.v1.contracts.responses.common import DebugModelName, Timestamp, Uuid


class ViewResponse(Uuid, Timestamp, BaseModel):
    name: str = Field(max_length=255)
    description: str | None = None
    # TODO: update with HttpUrl
    thumbnail_url: str | None = Field(
        default=None,
        max_length=2083,
    )
    snapshot_url: str | None = Field(
        default=None,
        max_length=2083,
    )


class PublicViewResponse(ViewResponse, DebugModelName, BaseModel):
    model_config = ConfigDict(from_attributes=True)


class PrivateViewResponse(ViewResponse, DebugModelName, BaseModel):
    model_config = ConfigDict(from_attributes=True)

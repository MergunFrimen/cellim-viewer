from pydantic import BaseModel, Field


class ViewResponse(BaseModel):
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

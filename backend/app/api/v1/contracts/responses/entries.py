from pydantic import BaseModel, Field

from app.database.models.mixins import TimestampMixin


class EntryResponse(BaseModel):
    name: str = Field(max_length=255)
    description: str | None = None
    is_public: bool = False


class EntryWithViewsResponse(EntryResponse, TimestampMixin):
    # link: ShareLinkBase
    # views: list[ViewResponse]
    pass

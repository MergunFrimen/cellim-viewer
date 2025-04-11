from sqlmodel import SQLModel, Field

from app.database.models.mixins import WithUuid, WithTimestamp


class View(WithUuid, WithTimestamp):
    __tablename__ = "views"

    name: str = Field(max_length=255)
    description: str | None = None
    thumbnail_url: str | None = None
    snapshot_url: str | None = None

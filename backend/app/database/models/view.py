from uuid import UUID

from sqlmodel import Field, Relationship, SQLModel

from app.database.models.entry import Entry
from app.database.models.mixins import WithTimestamp, WithUuid


class ViewBase(SQLModel):
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


class View(ViewBase, WithUuid, WithTimestamp, table=True):
    __tablename__ = "views"

    entry_id: UUID = Field(foreign_key="entries.id", ondelete="CASCADE")
    entry: Entry = Relationship(back_populates="views")

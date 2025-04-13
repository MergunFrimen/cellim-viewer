from uuid import UUID

from sqlmodel import Field, Relationship, SQLModel

from app.database.models.mixins import WithTimestamp, WithUuid


class ViewBase(SQLModel):
    name: str = Field(max_length=255)
    description: str | None = None
    thumbnail_url: str | None = None
    snapshot_url: str | None = None


class View(ViewBase, WithUuid, WithTimestamp, table=True):
    __tablename__ = "views"

    # entry_id: UUID = Field(foreign_key="entry.id", ondelete="CASCADE")
    # entry: ["Entry"] = Relationship(back_populates="entries")

from sqlmodel import Field, SQLModel

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

    # entry_id: UUID = Field(foreign_key="entry.id", ondelete="CASCADE")
    # entry: ["Entry"] = Relationship(back_populates="entries")

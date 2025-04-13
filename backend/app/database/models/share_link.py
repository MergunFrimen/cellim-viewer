from uuid import UUID

from sqlmodel import Field, Relationship, SQLModel

from app.database.models.mixins import WithTimestamp, WithUuid


class ShareLinkBase(SQLModel):
    # TODO: update with HttpUrl
    url: str | None = Field(
        default=None,
        max_length=2083,
    )
    editable: bool = False
    active: bool = False


class ShareLink(ShareLinkBase, WithUuid, WithTimestamp, table=True):
    __tablename__ = "share_links"

    entry_id: UUID = Field(foreign_key="entries.id", ondelete="CASCADE")
    entry: "Entry" = Relationship(back_populates="link")

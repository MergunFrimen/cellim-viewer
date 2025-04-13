from uuid import UUID

from pydantic import HttpUrl
from sqlmodel import Field, Relationship, SQLModel

from app.database.models.mixins import WithTimestamp, WithUuid


class ShareLinkBase(SQLModel):
    link: HttpUrl
    editable: bool = False
    active: bool = False


class ShareLink(ShareLinkBase, WithUuid, WithTimestamp, table=True):
    __tablename__ = "share_links"

    entry_id: UUID = Field(foreign_key="entry.id")
    entry: ["Entry"] = Relationship(back_populates="link")

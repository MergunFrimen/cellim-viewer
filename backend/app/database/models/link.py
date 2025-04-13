from pydantic import HttpUrl
from sqlmodel import Field, SQLModel

from app.database.models.mixins import WithTimestamp, WithUuid
from app.database.models.types.http_url import HttpUrlType


class ShareLinkBase(SQLModel):
    url: HttpUrl = Field(
        unique=True,
        sa_type=HttpUrlType,
    )
    editable: bool = False
    active: bool = False


class ShareLink(ShareLinkBase, WithUuid, WithTimestamp, table=True):
    __tablename__ = "share_links"

    # entry_id: UUID = Field(foreign_key="entry.id", ondelete="CASCADE")
    # entry: ["Entry"] = Relationship(back_populates="link")

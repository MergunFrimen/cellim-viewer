from uuid import UUID, uuid4

from sqlmodel import SQLModel

from app.database.models.mixins import WithUuid, WithTimestamp


class ShareLink(WithUuid, WithTimestamp):
    __tablename__ = "share_links"

    link: UUID = uuid4()
    editable: bool = False
    active: bool = False

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models.base import Base, UuidFk, UuidPk


class ShareLink(Base):
    __tablename__ = "share_links"

    # Attributes
    id: Mapped[UuidPk]

    # Relationships
    entry_id: Mapped[UuidFk] = mapped_column(ForeignKey("entries.id"))
    entry: Mapped["Entry"] = relationship()

    link: Mapped[UUID] = mapped_column(Uuid, default=uuid4)
    editable: Mapped[bool] = mapped_column(default=False)
    active: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)
    deleted_at: Mapped[datetime | None] = mapped_column(default=None)

from datetime import datetime
from enum import Enum

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models.base import Base, uuidfk, uuidpk


class LinkType(Enum):
    viewer = "viewer"
    editor = "editor"


class Link(Base):
    __tablename__ = "links"

    # Attributes
    id: Mapped[uuidpk]
    type: Mapped[LinkType]
    # Relationships
    entry_id: Mapped[uuidfk] = mapped_column(ForeignKey("entries.id"))
    user_id: Mapped[uuidfk] = mapped_column(ForeignKey("users.id"))
    entry: Mapped["Entry"] = relationship()
    user: Mapped["User"] = relationship()

    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)
    deleted_at: Mapped[datetime | None] = mapped_column(default=None)

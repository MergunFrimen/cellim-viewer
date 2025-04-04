from datetime import datetime

from sqlalchemy import ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models.base import Base, str255, timestamptz, uuidfk, uuidpk


class Entry(Base):
    __tablename__ = "entries"

    # Attributes
    id: Mapped[uuidpk]
    name: Mapped[str255]
    description: Mapped[str | None]
    is_public: Mapped[bool]

    # Relationships
    user_id: Mapped[uuidfk] = mapped_column(ForeignKey("users.id"))
    views: Mapped[list["View"]] = relationship()
    links: Mapped[list["Link"]] = relationship()
    user: Mapped["User"] = relationship()

    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)
    deleted_at: Mapped[datetime | None] = mapped_column(default=None)

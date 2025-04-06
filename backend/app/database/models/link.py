from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models.base import Base, LinkType, UuidFk, UuidPk


class Link(Base):
    __tablename__ = "links"

    # Attributes
    id: Mapped[UuidPk]
    type: Mapped[LinkType]
    # Relationships
    entry_id: Mapped[UuidFk] = mapped_column(ForeignKey("entries.id"))
    user_id: Mapped[UuidFk] = mapped_column(ForeignKey("users.id"))
    entry: Mapped["Entry"] = relationship()
    user: Mapped["User"] = relationship()

    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)
    deleted_at: Mapped[datetime | None] = mapped_column(default=None)

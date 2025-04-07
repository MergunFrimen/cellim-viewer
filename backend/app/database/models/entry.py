from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models.base import Base, Str255, UuidFk, UuidPk


class Entry(Base):
    __tablename__ = "entries"

    # Attributes
    id: Mapped[UuidPk]
    name: Mapped[Str255]
    description: Mapped[str | None]

    # Relationships
    user_id: Mapped[UuidFk] = mapped_column(ForeignKey("users.id"))
    views: Mapped[list["View"]] = relationship()
    links: Mapped[list["Link"]] = relationship()
    user: Mapped["User"] = relationship()

    is_public: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now())
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now())
    deleted_at: Mapped[datetime | None] = mapped_column(default=None)

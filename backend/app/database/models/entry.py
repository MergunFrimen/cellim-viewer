from datetime import datetime

from sqlalchemy import ForeignKey, Mapped, mapped_column, relationship

from app.database.models import Base, User, View, str255, uuidpk


class Entry(Base):
    __tablename__ = "entries"

    # Attributes
    id: Mapped[uuidpk]
    name: Mapped[str255]
    description: Mapped[str | None]
    is_public: Mapped[bool]
    created_at: Mapped[datetime | None]
    updated_at: Mapped[datetime | None]
    deleted_at: Mapped[datetime | None]

    # Relationships
    views: Mapped[list["View"]] = relationship()
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship()

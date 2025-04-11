from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models.base import Base, Str255, UuidFk


class Entry(Base):
    __tablename__ = "entries"

    # Attributes
    name: Mapped[Str255]
    description: Mapped[str | None]

    # Relationships
    user_id: Mapped[UuidFk] = mapped_column(ForeignKey("users.id"))
    views: Mapped[list["View"]] = relationship()
    link: Mapped["ShareLink"] = relationship()
    user: Mapped["User"] = relationship()

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    is_public: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now())
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now())
    deleted_at: Mapped[datetime | None] = mapped_column(default=None)

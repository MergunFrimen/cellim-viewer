from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models.base import Base, uuidpk


class User(Base):
    __tablename__ = "users"

    # Attributes
    id: Mapped[uuidpk]

    # Relationships
    entries: Mapped[list["Entry"]] = relationship()

    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)
    deleted_at: Mapped[datetime | None] = mapped_column(default=None)

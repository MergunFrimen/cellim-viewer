from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models.base import Base, UuidPk


class User(Base):
    __tablename__ = "users"

    # Attributes
    id: Mapped[UuidPk]

    # Relationships
    entries: Mapped[list["Entry"]] = relationship()

    is_superuser: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)
    deleted_at: Mapped[datetime | None] = mapped_column(default=None)

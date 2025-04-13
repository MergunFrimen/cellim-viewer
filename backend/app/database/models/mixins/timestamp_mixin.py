from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column

from app.database.models.base import Base


def utcnow() -> datetime:
    return datetime.now()


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(default=utcnow, onupdate=utcnow)

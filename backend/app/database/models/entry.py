from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.models.base import Base
from app.database.models.mixins import TimestampMixin, UuidMixin


class Entry(Base, UuidMixin, TimestampMixin):
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(default=None)
    is_public: Mapped[bool] = mapped_column(default=False)

    # user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    # user: Mapped["User"] = relationship(back_populates="entries")
    # views: Mapped[list["View"]] = relationship(back_populates="entry", cascade="all, delete-orphan")
    # link: Mapped["ShareLink"] = relationship(back_populates="entry", cascade="all, delete-orphan")

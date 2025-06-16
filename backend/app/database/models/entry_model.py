from uuid import UUID

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models.base_model import Base
from app.database.models.mixins import TimestampMixin, UuidMixin


class Entry(Base, UuidMixin, TimestampMixin):
    __tablename__ = "entries"

    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(default=None)
    is_public: Mapped[bool] = mapped_column(default=False)

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))

    user: Mapped["User"] = relationship(  # type: ignore
        back_populates="entries",
    )
    views: Mapped[list["View"]] = relationship(  # type: ignore
        back_populates="entry",
        cascade="all, delete-orphan",
    )
    link: Mapped["ShareLink"] = relationship(  # type: ignore
        back_populates="entry",
        cascade="all, delete-orphan",
        uselist=False,  # For one-to-one relationship
    )
    volseg_entry_id: Mapped[UUID] = mapped_column(
        ForeignKey("volseg_entries.id", ondelete="CASCADE")
    )

    volseg_entry: Mapped["VolsegEntry"] = relationship(  # type: ignore
        back_populates="entries",
    )

    def has_owner(self, user_id: UUID) -> bool:
        return self.user_id == user_id

from uuid import UUID

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models.base_model import Base
from app.database.models.mixins import TimestampMixin, UuidMixin


class VolsegEntry(Base, UuidMixin, TimestampMixin):
    __tablename__ = "volseg_entries"

    db_name: Mapped[str] = mapped_column(String(255))
    entry_id: Mapped[str] = mapped_column(String(255))
    is_public: Mapped[bool] = mapped_column(default=False)

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))

    user: Mapped["User"] = relationship(  # type: ignore
        back_populates="volseg_entries",
    )
    entries: Mapped[list["Entry"]] = relationship(  # type: ignore
        back_populates="volseg_entry",
    )

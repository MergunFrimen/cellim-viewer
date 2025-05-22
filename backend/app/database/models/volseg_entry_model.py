from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.models.base_model import Base
from app.database.models.mixins import TimestampMixin, UuidMixin


class VolsegEntry(Base, UuidMixin, TimestampMixin):
    __tablename__ = "volseg_entries"

    db_name: Mapped[str] = mapped_column(String(255))
    entry_id: Mapped[str] = mapped_column(String(255))
    
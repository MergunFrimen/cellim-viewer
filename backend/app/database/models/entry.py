from sqlmodel import SQLModel, Field

from app.database.models.mixins import WithTimestamp, WithUuid


class Entry(WithUuid, WithTimestamp, table=True):
    __tablename__ = "entries"

    name: str = Field(max_length=255)
    description: str | None = None
    is_public: bool = False

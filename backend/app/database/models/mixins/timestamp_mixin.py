from datetime import datetime

from sqlmodel import Field, SQLModel


def utcnow() -> datetime:
    return datetime.now()


class WithTimestamp(SQLModel):
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow, sa_column_kwargs={"onupdate": utcnow})

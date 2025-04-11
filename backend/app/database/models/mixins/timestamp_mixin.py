from datetime import datetime, timezone

from sqlmodel import Field, SQLModel, text


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class WithTimestamp(SQLModel):
    created_at: datetime = Field(
        default_factory=utcnow,
    )
    updated_at: datetime = Field(default_factory=utcnow, sa_column_kwargs={"onupdate": utcnow})

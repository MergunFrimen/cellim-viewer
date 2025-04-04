from uuid import UUID

from pydantic import BaseModel, Field


class Entry(BaseModel):
    user_id: UUID
    name: str = Field(..., max_length=255)
    description: str | None = None
    is_public: bool = True

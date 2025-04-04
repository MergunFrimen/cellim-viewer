from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class Entry(BaseModel):
    user_id: UUID
    name: str = Field(..., max_length=255)
    description: str | None = None
    is_public: bool = True

    model_config = ConfigDict(from_attributes=True)

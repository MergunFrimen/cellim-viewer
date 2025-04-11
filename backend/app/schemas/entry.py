from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class Entry(BaseModel):
    user_id: UUID
    name: str = Field(max_length=255, examples=["Entry Name"])
    description: str | None = Field(default=None, examples=["Markdown description."])
    is_public: bool = True

    model_config = ConfigDict(from_attributes=True)

from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict


class EntryResponse(BaseModel):
    name: str = Field(max_length=255, examples=["Entry Name"])
    description: str | None = Field(default=None, examples=["Markdown description."])
    is_public: bool = True
    thumbnail_url: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

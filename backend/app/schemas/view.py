from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class View(BaseModel):
    entry_id: UUID
    name: str = Field(max_length=255)
    description: str | None = Field(default=None, max_length=255)
    snapshot: dict[str, Any] | None = Field(default=None)

    model_config = ConfigDict(from_attributes=True)

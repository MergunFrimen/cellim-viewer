from typing import Any, Dict
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class View(BaseModel):
    entry_id: UUID
    name: str = Field(..., max_length=255)
    description: str | None = None
    snapshot: Dict[str, Any] | None = None

    model_config = ConfigDict(from_attributes=True)

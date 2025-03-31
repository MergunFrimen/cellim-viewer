from typing import Optional

from pydantic import Field

from app.api.contracts.base import EntryBase


class EntryCreateRequest(EntryBase):
    pass


class EntryUpdateRequest(EntryBase):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = None
    is_public: Optional[bool] = None

from typing import Any, Dict, Optional

from pydantic import BaseModel, Field

from app.api.contracts.base import ViewBase


class ViewCreateRequest(ViewBase):
    entry_id: int


class ViewUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = None
    mvsj: Optional[Dict[str, Any]] = None

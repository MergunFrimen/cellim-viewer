from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class EntryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    is_public: bool = True


class ViewBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=50)
    description: str
    mvsj: Optional[Dict[str, Any]] = None

from typing import Any, Dict, Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.api.contracts.base import ViewBase


class ViewCreateRequest(ViewBase):
    entry_id: UUID


class ViewUpdateRequest(ViewBase):
    pass
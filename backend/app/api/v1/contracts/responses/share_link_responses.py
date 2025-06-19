from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.api.v1.contracts.responses.common import DebugModelName, Timestamp, Uuid


class ShareLinkResponse(Timestamp, Uuid, DebugModelName, BaseModel):
    entry_id: UUID
    is_editable: bool
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

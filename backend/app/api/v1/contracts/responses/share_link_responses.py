from pydantic import BaseModel, ConfigDict

from app.api.v1.contracts.responses.common import DebugModelName, Timestamp, Uuid


class ShareLinkResponse(Timestamp, Uuid, DebugModelName, BaseModel):
    is_editable: bool
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

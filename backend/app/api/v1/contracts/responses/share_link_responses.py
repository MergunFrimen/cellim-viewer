from pydantic import BaseModel, ConfigDict

from app.api.v1.contracts.responses.common import Timestamp, Uuid


class ShareLinkResponse(Uuid, Timestamp, BaseModel):
    is_editable: bool
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

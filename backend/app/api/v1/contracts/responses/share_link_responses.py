from pydantic import BaseModel, ConfigDict

from app.api.v1.contracts.responses.common import Uuid


class PrivateShareLinkResponse(Uuid, BaseModel):
    is_editable: bool
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

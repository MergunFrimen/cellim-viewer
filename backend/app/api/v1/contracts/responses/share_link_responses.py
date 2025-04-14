from pydantic import BaseModel, ConfigDict, Field

from app.api.v1.contracts.responses.common import Uuid


class PrivateShareLinkResponse(Uuid, BaseModel):
    link_url: str = Field(max_length=255, examples=["https://www.example.com"])
    editable: bool
    active: bool

    model_config = ConfigDict(from_attributes=True)
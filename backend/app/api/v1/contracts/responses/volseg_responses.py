from pydantic import BaseModel, ConfigDict, Field

from app.api.v1.contracts.responses.common import DebugModelName, Timestamp, Uuid


class VolsegEntryResponse(Timestamp, Uuid, DebugModelName, BaseModel):
    db_name: str = Field(min_length=1, max_length=255, examples=["emdb"])
    entry_id: str = Field(min_length=1, max_length=255, examples=["emd-1832"])
    is_public: bool = Field()

    model_config = ConfigDict(from_attributes=True)

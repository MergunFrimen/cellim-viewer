from uuid import uuid4

from pydantic import UUID4, AwareDatetime, BaseModel, Field

from app.database.models.mixins.timestamp_mixin import utcnow


class Uuid(BaseModel):
    id: UUID4 = Field(examples=[str(uuid4())])


class Timestamp(BaseModel):
    created_at: AwareDatetime = Field(examples=[str(utcnow())])
    updated_at: AwareDatetime = Field(examples=[str(utcnow())])

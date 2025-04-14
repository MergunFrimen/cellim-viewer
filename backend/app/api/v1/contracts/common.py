from uuid import uuid4

from pydantic import UUID4, AwareDatetime, BaseModel, Field, model_validator

from app.database.models.mixins.timestamp_mixin import utcnow


class Uuid(BaseModel):
    id: UUID4 = Field(examples=[str(uuid4())])


class Timestamp(BaseModel):
    created_at: AwareDatetime = Field(examples=[str(utcnow())])
    updated_at: AwareDatetime = Field(examples=[str(utcnow())])


class DebugModelName(BaseModel):
    response_model: str = ""

    @model_validator(mode="after")
    def set_model_name(self):
        self.response_model = self.__class__.__name__
        return self

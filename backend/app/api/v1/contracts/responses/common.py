from uuid import UUID

from pydantic import AwareDatetime, BaseModel, Field, model_validator


class Uuid(BaseModel):
    id: UUID = Field(examples=["6cfec811-c860-4727-a0ba-a6482b8d29cc"])


class Timestamp(BaseModel):
    created_at: AwareDatetime = Field(examples=["2025-04-24 09:46:15.895023+00:00"])
    updated_at: AwareDatetime = Field(examples=["2025-04-24 09:46:15.895023+00:00"])


class DebugModelName(BaseModel):
    response_model: str = ""

    @model_validator(mode="after")
    def set_model_name(self):
        self.response_model = self.__class__.__name__
        return self

from pydantic import BaseModel, Field, ConfigDict


class ViewResponse(BaseModel):
    name: str = Field(max_length=255, examples=["View Name"])
    description: str | None = Field(default=None, examples=["Markdown description."])
    snapshot_url: str | None = None
    thumbnail_url: str | None = None

    model_config = ConfigDict(from_attributes=True)

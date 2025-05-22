from fastapi import File, UploadFile
from pydantic import BaseModel, Field


class VolsegUploadDataset(BaseModel):
    db_name: str = Field(min_length=1, max_length=255, examples=["Volseg Database Name"])
    entry_id: str = Field(min_length=1, max_length=255, examples=["Volseg Entry Id"])
    annotations: UploadFile = File(description="Entry annotations")
    metadata: UploadFile = File(description="Entry metadata")
    data: UploadFile = File(description="Entry data")

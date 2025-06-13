from fastapi import File, Form, UploadFile
from pydantic import BaseModel


class VolsegUploadEntry(BaseModel):
    db_name: str = Form(min_length=1, max_length=255, examples=["emdb"])
    entry_id: str = Form(min_length=1, max_length=255, examples=["emd-1832"])
    is_public: bool | None = Form(default=False)

    # data
    annotations: UploadFile = File(description="Entry annotations")
    metadata: UploadFile = File(description="Entry metadata")
    data: UploadFile = File(description="Entry data (zip)")

    model_config = {"extra": "forbid"}

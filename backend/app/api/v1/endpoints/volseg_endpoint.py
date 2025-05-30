from typing import Annotated

from fastapi import APIRouter, File, HTTPException, status

from app.api.v1.contracts.requests.volseg_requests import VolsegUploadDataset
from app.api.v1.dependencies import VolsegStorage

router = APIRouter(prefix="/volseg", tags=["volseg"])


@router.post("", status_code=status.HTTP_200_OK)
async def upload_volseg_entry(
    request: Annotated[VolsegUploadDataset, File()],
    file_storage: VolsegStorage,
):
    if request.annotations:
        try:
            file_path = f"volseg/{}"
            snapshot_url = await file_storage.upload_file(
                file_path=file_path,
                file_data=file_data,
                file_content=request.annotations.file,
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving JSON snapshot: {str(e)}")

from typing import Annotated

from fastapi import APIRouter, File, HTTPException, status

from app.api.v1.contracts.requests.volseg_requests import VolsegUploadDataset
from app.api.v1.dependencies import ViewStorageDependency

router = APIRouter(prefix="/volseg", tags=["volseg"])


@router.post("", status_code=status.HTTP_200_OK)
async def upload_volseg_entry(
    request: Annotated[VolsegUploadDataset, File()],
    file_storage: ViewStorageDependency,
):
    if request.annotations:
        try:
            snapshot_url = await file_storage.save_view_snapshot(
                entry_id=entry_id,
                view_id=view_id,
                file_content=request.annotations.file,
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving JSON snapshot: {str(e)}")

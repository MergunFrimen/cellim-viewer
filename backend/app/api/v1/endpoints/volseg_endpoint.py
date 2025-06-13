from typing import Annotated

from fastapi import APIRouter, File, status

from app.api.v1.contracts.requests.volseg_requests import VolsegUploadEntry
from app.api.v1.contracts.responses.volseg_responses import VolsegEntryResponse
from app.api.v1.deps import RequireUserDep, VolsegServiceDep
from app.api.v1.tags import Tags

router = APIRouter(prefix="/volseg", tags=[Tags.volseg])


@router.post(
    "",
    status_code=status.HTTP_200_OK,
    response_model=VolsegEntryResponse,
)
async def upload_entry(
    request: Annotated[VolsegUploadEntry, File()],
    current_user: RequireUserDep,
    volseg_service: VolsegServiceDep,
):
    return await volseg_service.upload_entry(
        user=current_user,
        request=request,
    )

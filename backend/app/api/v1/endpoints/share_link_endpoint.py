from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Body, Path, status

from app.api.v1.contracts.requests.share_link_requests import ShareLinkUpdateRequest
from app.api.v1.contracts.responses.share_link_responses import ShareLinkResponse
from app.api.v1.deps import RequireUserDep, ShareLinkServiceDep
from app.api.v1.tags import Tags

router = APIRouter(prefix="/share_links", tags=[Tags.share_links])


@router.get(
    "/{share_link_id}",
    status_code=status.HTTP_200_OK,
    response_model=ShareLinkResponse,
)
async def get_share_link(
    share_link_id: Annotated[UUID, Path(title="Entry ID")],
    current_user: RequireUserDep,
    service: ShareLinkServiceDep,
):
    return await service.get_share_link(
        share_link_id=share_link_id,
        user=current_user,
    )


@router.put(
    "/{share_link_id}",
    status_code=status.HTTP_200_OK,
    response_model=ShareLinkResponse,
)
async def update_share_link(
    share_link_id: Annotated[UUID, Path(title="Entry ID")],
    request: Annotated[ShareLinkUpdateRequest, Body()],
    current_user: RequireUserDep,
    service: ShareLinkServiceDep,
):
    return await service.update(
        share_link_id=share_link_id,
        user=current_user,
        request=request,
    )

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Body, HTTPException, Path, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.api.v1.contracts.requests.share_link_requests import ShareLinkUpdateRequest
from app.api.v1.contracts.responses.share_link_responses import ShareLinkResponse
from app.api.v1.deps import DbSessionDep, RequireUserDep
from app.api.v1.tags import Tags
from app.database.models.entry_model import Entry
from app.database.models.share_link_model import ShareLink

router = APIRouter(prefix="/share_links", tags=[Tags.share_links])


@router.get(
    "/{share_link_id}",
    status_code=status.HTTP_200_OK,
    response_model=ShareLinkResponse,
)
async def get_share_link(
    share_link_id: Annotated[UUID, Path(title="Entry ID")],
    session: DbSessionDep,
    current_user: RequireUserDep,
):
    result: ShareLink | None = await session.execute(
        select(ShareLink)
        .where(ShareLink.id == share_link_id)
        .options(selectinload(ShareLink.entry).selectinload(Entry.user))
    )
    share_link = result.scalar()

    if not share_link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
        )

    print(share_link.entry.user.id)
    print(current_user.id)

    if share_link.entry.user.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
        )

    return ShareLinkResponse.model_validate(share_link)


@router.put(
    "/{share_link_id}",
    status_code=status.HTTP_200_OK,
    response_model=ShareLinkResponse,
)
async def update_share_link(
    share_link_id: Annotated[UUID, Path(title="Entry ID")],
    request: Annotated[ShareLinkUpdateRequest, Body()],
    session: DbSessionDep,
    current_user: RequireUserDep,
):
    result: ShareLink | None = await session.execute(
        select(ShareLink)
        .where(ShareLink.id == share_link_id)
        .options(selectinload(ShareLink.entry).selectinload(Entry.user))
    )
    share_link = result.scalar()

    if not share_link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found",
        )

    if share_link.entry.user.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
        )

    for key, value in request.model_dump(exclude_unset=True).items():
        setattr(share_link, key, value)
    await session.commit()

    return ShareLinkResponse.model_validate(share_link)

from uuid import UUID

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.contracts.requests.share_link_requests import ShareLinkUpdateRequest
from app.api.v1.contracts.responses.share_link_responses import ShareLinkResponse
from app.database.models.share_link_model import ShareLink
from app.database.models.user_model import User
from app.database.session_manager import get_async_session


class ShareLinkService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_share_link(
        self,
        *,
        share_link_id: UUID,
        user: User,
    ) -> ShareLinkResponse:
        share_link: ShareLink = await self.get_share_link_by_id(share_link_id)

        # Load in relationships
        await self.session.refresh(share_link, ["entry"])

        # Check permissions
        if share_link.entry.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
            )

        return ShareLinkResponse.model_validate(share_link)

    async def update(
        self,
        *,
        share_link_id: UUID,
        user: User,
        request: ShareLinkUpdateRequest,
    ) -> ShareLinkResponse:
        share_link: ShareLink = await self.get_share_link_by_id(share_link_id)

        # Load in relationships
        await self.session.refresh(share_link, ["entry"])

        # Check permissions
        if share_link.entry.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
            )

        # Update
        for key, value in request.model_dump(exclude_unset=True).items():
            setattr(share_link, key, value)
        await self.session.commit()

        return ShareLinkResponse.model_validate(share_link)

    async def get_share_link_by_id(self, share_link_id: UUID) -> ShareLink:
        share_link: ShareLink | None = await self.session.get(ShareLink, share_link_id)
        if share_link is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Share link not found",
            )
        return share_link


async def get_share_link_service(
    session: AsyncSession = Depends(get_async_session),
) -> ShareLinkService:
    return ShareLinkService(session)

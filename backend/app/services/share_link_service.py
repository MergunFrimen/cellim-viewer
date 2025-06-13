from uuid import UUID

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.entry_model import Entry
from app.database.models.share_link_model import ShareLink
from app.database.session_manager import get_async_session


class ShareLinkService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, entry: Entry) -> Entry:
        new_link = ShareLink(entry=entry)

        self.session.add(new_link)
        await self.session.commit()

        return new_link

    async def get_share_link_by_id(self, share_link_id: UUID) -> ShareLink:
        share_link: ShareLink | None = await self.session.get(ShareLink, share_link_id)
        if share_link is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Share link not found",
            )
        return share_link

    async def get_share_link_by_entry(self, share_link_id: UUID) -> ShareLink:
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

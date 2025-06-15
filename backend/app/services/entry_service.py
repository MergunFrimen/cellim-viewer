from uuid import UUID

from fastapi import Depends, HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.v1.contracts.requests.entry_requests import (
    EntryCreateRequest,
    EntryUpdateRequest,
    SearchQueryParams,
)
from app.api.v1.contracts.responses.pagination_response import PaginatedResponse
from app.database.models.entry_model import Entry
from app.database.models.share_link_model import ShareLink
from app.database.models.user_model import User
from app.database.models.volseg_entry_model import VolsegEntry
from app.database.session_manager import get_async_session


class EntryService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, user: User, request: EntryCreateRequest) -> Entry:
        volseg_entry: VolsegEntry | None = await self.session.get(
            VolsegEntry,
            request.volseg_entry_id,
        )
        if volseg_entry is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Volseg entry not found",
            )

        new_link = ShareLink()
        new_entry = Entry(
            user=user,
            link=new_link,
            views=[],
            volseg_entry=volseg_entry,
            **request.model_dump(),
        )

        self.session.add(new_entry)
        await self.session.commit()

        return new_entry

    async def get_entry_by_id(self, entry_id: UUID) -> Entry:
        entry: Entry | None = await self.session.get(Entry, entry_id)
        if entry is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Entry not found",
            )
        return entry

    async def list_public_entries(self, search_query: SearchQueryParams):
        query = select(Entry).where(Entry.is_public == True)

        if search_query.search_term:
            search_term = f"%{search_query.search_term}%"
            query = query.filter(
                or_(Entry.name.ilike(search_term), Entry.description.ilike(search_term))
            )

        count_query = select(func.count()).select_from(query.subquery())
        total_items = await self.session.scalar(count_query)
        query = query.order_by(Entry.created_at.desc())
        query = query.offset((search_query.page - 1) * search_query.per_page).limit(
            search_query.per_page
        )
        result = await self.session.execute(query)
        entries = result.scalars().all()
        total_pages = (total_items + search_query.per_page - 1) // search_query.per_page

        return PaginatedResponse(
            items=entries,
            total_items=total_items,
            page=search_query.page,
            per_page=search_query.per_page,
            total_pages=total_pages,
        )

    async def list_user_entries(self, user_id: int, search_query: SearchQueryParams):
        query = select(Entry).where(Entry.user_id == user_id)

        if search_query.search_term:
            search_conditions = []
            for term in search_query.search_term:
                search_term = f"%{term}%"
                search_conditions.append(
                    or_(Entry.name.ilike(search_term), Entry.description.ilike(search_term))
                )
            if search_conditions:
                query = query.filter(*search_conditions)

        count_query = select(func.count()).select_from(query.subquery())
        total_items = await self.session.scalar(count_query)
        query = query.order_by(Entry.created_at.desc())
        query = query.offset((search_query.page - 1) * search_query.per_page).limit(
            search_query.per_page
        )
        query = query.options(selectinload(Entry.views), selectinload(Entry.link))
        result = await self.session.execute(query)
        entries = result.scalars().all()
        total_pages = (total_items + search_query.per_page - 1) // search_query.per_page

        return PaginatedResponse(
            items=entries,
            total_items=total_items,
            page=search_query.page,
            per_page=search_query.per_page,
            total_pages=total_pages,
        )

    async def update(self, entry: Entry, updates: EntryUpdateRequest) -> Entry:
        for key, value in updates.model_dump(exclude_unset=True).items():
            setattr(entry, key, value)
        await self.session.commit()
        return entry

    async def delete(self, entry: Entry) -> UUID:
        await self.session.delete(entry)
        await self.session.commit()
        return entry.id


async def get_entry_service(
    session: AsyncSession = Depends(get_async_session),
) -> EntryService:
    return EntryService(session)

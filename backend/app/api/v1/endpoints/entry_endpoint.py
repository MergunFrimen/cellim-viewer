from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Body, HTTPException, Path, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import selectinload

from app.api.v1.contracts.requests.entry_requests import (
    EntryCreateRequest,
    EntryUpdateRequest,
    SearchQueryParams,
)
from app.api.v1.contracts.responses.entry_responses import (
    PrivateEntryDetailsResponse,
    PublicEntryDetailsResponse,
    PublicEntryPreviewResponse,
)
from app.api.v1.contracts.responses.pagination_response import PaginatedResponse
from app.api.v1.dependencies import OptionalUser, RequireUser, SessionDependency
from app.api.v1.tags import Tags
from app.database.models import Entry
from app.database.models.share_link_model import ShareLink

router = APIRouter(prefix="/entries", tags=[Tags.entries])


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=PrivateEntryDetailsResponse,
)
async def create_entry(
    request: Annotated[EntryCreateRequest, Body()],
    session: SessionDependency,
    current_user: RequireUser,
):
    new_link = ShareLink()
    new_entry = Entry(user=current_user, link=new_link, views=[], **request.model_dump())
    session.add(new_entry)
    await session.commit()

    return new_entry


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=PaginatedResponse[PublicEntryPreviewResponse],
)
async def list_entries(
    search_query: Annotated[SearchQueryParams, Query()],
    session: SessionDependency,
):
    query = select(Entry).where(Entry.is_public == True)

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
    total_items = await session.scalar(count_query)
    query = query.order_by(Entry.created_at.desc())
    query = query.offset((search_query.page - 1) * search_query.per_page).limit(
        search_query.per_page
    )
    result = await session.execute(query)
    entries = result.scalars().all()
    total_pages = (total_items + search_query.per_page - 1) // search_query.per_page

    return PaginatedResponse(
        items=entries,
        total_items=total_items,
        page=search_query.page,
        per_page=search_query.per_page,
        total_pages=total_pages,
    )


@router.get(
    "/user",
    status_code=status.HTTP_200_OK,
    response_model=PaginatedResponse[PrivateEntryDetailsResponse],
)
async def list_entries_for_user(
    search_query: Annotated[SearchQueryParams, Query()],
    session: SessionDependency,
    current_user: RequireUser,
):
    query = select(Entry).where(Entry.user_id == current_user.id)

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
    total_items = await session.scalar(count_query)
    query = query.order_by(Entry.created_at.desc())
    query = query.offset((search_query.page - 1) * search_query.per_page).limit(
        search_query.per_page
    )
    query = query.options(selectinload(Entry.views), selectinload(Entry.link))
    result = await session.execute(query)
    entries = result.scalars().all()
    total_pages = (total_items + search_query.per_page - 1) // search_query.per_page

    return PaginatedResponse(
        items=entries,
        total_items=total_items,
        page=search_query.page,
        per_page=search_query.per_page,
        total_pages=total_pages,
    )


@router.get(
    "/{entry_id}",
    status_code=status.HTTP_200_OK,
    response_model=PrivateEntryDetailsResponse | PublicEntryDetailsResponse,
)
async def get_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    session: SessionDependency,
    current_user: OptionalUser,
):
    entry: Entry | None = await session.get(Entry, entry_id)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found",
        )

    result: Entry | None = await session.execute(
        select(Entry)
        .where(Entry.id == entry_id)
        .options(selectinload(Entry.views), selectinload(Entry.link))
    )
    entry = result.scalar()

    if current_user is not None and entry.user_id == current_user.id:
        return PrivateEntryDetailsResponse.model_validate(entry)

    if not entry.is_public:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Entry is not public",
        )
    return PublicEntryDetailsResponse.model_validate(entry)


@router.get(
    "/share/{share_link_id}",
    status_code=status.HTTP_200_OK,
)
async def get_entry_by_share_link(
    share_link_id: Annotated[UUID, Path(title="Share Link")],
    session: SessionDependency,
):
    share_link = await session.get(ShareLink, share_link_id)
    if not share_link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Link not found")
    if not share_link.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Link is not active")

    result: Entry | None = await session.execute(
        select(Entry)
        .where(Entry.id == share_link.entry_id)
        .options(selectinload(Entry.views), selectinload(Entry.link))
    )
    entry = result.scalar()

    if share_link.is_editable:
        return PrivateEntryDetailsResponse.model_validate(entry)
    return PublicEntryDetailsResponse.model_validate(entry)


@router.put(
    "/{entry_id}",
    status_code=status.HTTP_200_OK,
    response_model=PrivateEntryDetailsResponse,
)
async def update_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    request: Annotated[EntryUpdateRequest, Body()],
    session: SessionDependency,
    current_user: RequireUser,
):
    entry = await session.get(Entry, entry_id)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found",
        )

    if entry.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
        )

    for key, value in request.model_dump(exclude_unset=True).items():
        setattr(entry, key, value)
    await session.commit()

    return entry


@router.delete(
    "/{entry_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    session: SessionDependency,
    current_user: RequireUser,
):
    entry = await session.get(Entry, entry_id)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found",
        )

    if entry.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    await session.delete(entry)
    await session.commit()

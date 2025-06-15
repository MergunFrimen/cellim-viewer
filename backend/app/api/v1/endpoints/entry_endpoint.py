from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Body, HTTPException, Path, Query, status

from app.api.v1.contracts.requests.entry_requests import (
    EntryCreateRequest,
    EntryUpdateRequest,
    SearchQueryParams,
)
from app.api.v1.contracts.responses.entry_responses import (
    EntryDetailsResponse,
)
from app.api.v1.contracts.responses.pagination_response import PaginatedResponse
from app.api.v1.contracts.responses.share_link_responses import ShareLinkResponse
from app.api.v1.deps import (
    DbSessionDep,
    EntryServiceDep,
    OptionalUserDep,
    RequireUserDep,
    ShareLinkServiceDep,
)
from app.api.v1.tags import Tags
from app.database.models import Entry
from app.database.models.share_link_model import ShareLink

router = APIRouter(prefix="/entries", tags=[Tags.entries])


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=EntryDetailsResponse,
)
async def create_entry(
    request: Annotated[EntryCreateRequest, Body()],
    current_user: RequireUserDep,
    entry_service: EntryServiceDep,
):
    return await entry_service.create(
        user=current_user,
        request=request,
    )


@router.get(
    "/{entry_id}",
    status_code=status.HTTP_200_OK,
    response_model=EntryDetailsResponse,
)
async def get_entry_by_id(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    session: DbSessionDep,
    current_user: OptionalUserDep,
    entry_service: EntryServiceDep,
):
    entry: Entry = await entry_service.get_entry_by_id(entry_id)

    # Load in relationships
    await session.refresh(entry, ["views", "link"])

    # Allow owner to always get their own entry
    if entry.is_public or (current_user is not None and entry.has_owner(current_user.id)):
        return EntryDetailsResponse.model_validate(entry)

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Entry is not public",
    )


@router.get(
    "/share/{share_link_id}",
    status_code=status.HTTP_200_OK,
    response_model=EntryDetailsResponse,
)
async def get_entry_by_share_link(
    share_link_id: Annotated[UUID, Path(title="Share Link")],
    session: DbSessionDep,
    share_link_service: ShareLinkServiceDep,
    entry_service: EntryServiceDep,
):
    share_link: ShareLink = await share_link_service.get_share_link_by_id(share_link_id)
    if not share_link.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Link is not active",
        )

    # Get the shared entry
    entry: Entry = await entry_service.get_entry_by_id(share_link.entry_id)
    await session.refresh(entry, ["views", "link"])

    return EntryDetailsResponse.model_validate(entry)


@router.get(
    "/{entry_id}/share_link",
    status_code=status.HTTP_200_OK,
    response_model=ShareLinkResponse,
)
async def get_entry_share_link(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    session: DbSessionDep,
    current_user: RequireUserDep,
    entry_service: EntryServiceDep,
):
    entry: Entry = await entry_service.get_entry_by_id(entry_id)
    await session.refresh(entry, ["link"])

    # check authorization
    if not entry.has_owner(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
        )

    return ShareLinkResponse.model_validate(entry.link)


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=PaginatedResponse[EntryDetailsResponse],
)
async def list_public_entries(
    search_query: Annotated[SearchQueryParams, Query()],
    entry_service: EntryServiceDep,
):
    return await entry_service.list_public_entries(
        search_query=search_query,
    )


@router.put(
    "/{entry_id}",
    status_code=status.HTTP_200_OK,
    response_model=EntryDetailsResponse,
)
async def update_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    request: Annotated[EntryUpdateRequest, Body()],
    entry_service: EntryServiceDep,
    current_user: RequireUserDep,
):
    entry: Entry = await entry_service.get_entry_by_id(entry_id)

    if not entry.has_owner(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
        )

    updated_entry: Entry = await entry_service.update(
        entry=entry,
        updates=request,
    )

    return EntryDetailsResponse.model_validate(updated_entry)


@router.delete(
    "/{entry_id}",
    status_code=status.HTTP_200_OK,
    response_model=UUID,
)
async def delete_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    entry_service: EntryServiceDep,
    current_user: RequireUserDep,
):
    entry: Entry = await entry_service.get_entry_by_id(entry_id)

    if not entry.has_owner(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
        )

    await entry_service.delete(entry)

    return entry_id

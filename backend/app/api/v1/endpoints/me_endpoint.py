from typing import Annotated

from fastapi import APIRouter, Query, status

from app.api.v1.contracts.requests.entry_requests import (
    SearchQueryParams,
)
from app.api.v1.contracts.responses.entry_responses import (
    EntryDetailsResponse,
)
from app.api.v1.contracts.responses.pagination_response import PaginatedResponse
from app.api.v1.deps import (
    EntryServiceDep,
    RequireUserDep,
)
from app.api.v1.tags import Tags

router = APIRouter(prefix="/me", tags=[Tags.entries])


@router.get(
    "/entries",
    status_code=status.HTTP_200_OK,
    response_model=PaginatedResponse[EntryDetailsResponse],
)
async def list_entries_for_user(
    search_query: Annotated[SearchQueryParams, Query()],
    entry_service: EntryServiceDep,
    current_user: RequireUserDep,
):
    return await entry_service.list_user_entries(
        search_query=search_query,
        user_id=current_user.id,
    )

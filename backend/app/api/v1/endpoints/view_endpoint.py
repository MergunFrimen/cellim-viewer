from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Body, File, Path, Response
from fastapi.responses import JSONResponse
from starlette import status

from app.api.v1.contracts.requests.view_requests import ViewCreateRequest, ViewUpdateRequest
from app.api.v1.contracts.responses.view_responses import ViewResponse
from app.api.v1.deps import (
    DbSessionDep,
    OptionalUserDep,
    RequireUserDep,
    ViewServiceDep,
)
from app.api.v1.tags import Tags

router = APIRouter(prefix="/entries/{entry_id}/views", tags=[Tags.views])


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=ViewResponse,
)
async def create_view(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    request: Annotated[ViewCreateRequest, File()],
    view_service: ViewServiceDep,
    current_user: RequireUserDep,
):
    return await view_service.create(
        user=current_user,
        entry_id=entry_id,
        request=request,
    )


@router.get(
    "/{view_id}",
    status_code=status.HTTP_200_OK,
    response_model=ViewResponse,
)
async def get_view_by_id(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    view_id: Annotated[UUID, Path(title="View ID")],
    view_service: ViewServiceDep,
    session: DbSessionDep,
    current_user: OptionalUserDep,
):
    return await view_service.get_view(
        user=current_user,
        view_id=view_id,
    )


@router.get(
    "/{view_id}/snapshot",
    status_code=status.HTTP_200_OK,
    response_class=JSONResponse,
)
async def get_view_snapshot(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    view_id: Annotated[UUID, Path(title="View ID")],
    current_user: OptionalUserDep,
    view_service: ViewServiceDep,
):
    return await view_service.get_view_snapshot(
        user=current_user,
        entry_id=entry_id,
        view_id=view_id,
    )


@router.get(
    "/{view_id}/thumbnail",
    status_code=status.HTTP_200_OK,
    response_class=Response,
)
async def get_view_thumbnail_image(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    view_id: Annotated[UUID, Path(title="View ID")],
    current_user: OptionalUserDep,
    view_service: ViewServiceDep,
):
    return await view_service.get_view_thumbnail(
        user=current_user,
        entry_id=entry_id,
        view_id=view_id,
    )


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=list[ViewResponse],
)
async def list_views_for_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    view_service: ViewServiceDep,
    current_user: OptionalUserDep,
):
    return await view_service.list_views_for_entry(
        user=current_user,
        entry_id=entry_id,
    )


@router.put(
    "/{view_id}",
    status_code=status.HTTP_200_OK,
    response_model=ViewResponse,
)
async def update_view(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    view_id: Annotated[UUID, Path(title="View ID")],
    request: Annotated[ViewUpdateRequest, Body()],
    view_service: ViewServiceDep,
    current_user: RequireUserDep,
):
    return await view_service.update(
        entry_id=entry_id,
        view_id=view_id,
        updates=request,
        user=current_user,
    )


@router.delete(
    "/{view_id}",
    status_code=status.HTTP_200_OK,
    response_model=UUID,
)
async def delete_view(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    view_id: Annotated[UUID, Path(title="View ID")],
    view_service: ViewServiceDep,
    current_user: OptionalUserDep,
):
    return await view_service.delete(
        entry_id=entry_id,
        view_id=view_id,
        user=current_user,
    )

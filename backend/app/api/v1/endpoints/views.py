from typing import Annotated
from uuid import UUID, uuid4

from fastapi import APIRouter, Body, File, HTTPException, Path
from sqlalchemy import select
from starlette import status

from app.api.v1.contracts.requests.view_requests import ViewCreateRequest, ViewUpdateRequest
from app.api.v1.contracts.responses.view_responses import ViewResponse
from app.api.v1.dependencies import SessionDependency
from app.api.v1.tags import Tags
from app.database.models.entry_model import Entry
from app.database.models.view_model import View
from app.services.files.upload import file_storage

router = APIRouter(prefix="/entries/{entry_id}/views", tags=[Tags.views])


@router.post("", status_code=status.HTTP_201_CREATED, response_model=ViewResponse)
async def create_view(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    request: Annotated[ViewCreateRequest, File()],
    session: SessionDependency,
):
    result = await session.get(Entry, entry_id)
    if not result:
        raise HTTPException(status_code=404, detail="Entry not found")

    view_id = uuid4()
    thumbnail_url: str | None = None
    snapshot_url: str | None = None

    # save snapshot
    if request.snapshot_json:
        try:
            snapshot_url = await file_storage.save_view_snapshot(
                view_id,
                request.snapshot_json.file,
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving JSON snapshot: {str(e)}")

    # save image
    if request.thumbnail_image:
        try:
            thumbnail_url = await file_storage.save_view_image(
                view_id,
                request.thumbnail_image.file,
                request.thumbnail_image.filename,
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving image: {str(e)}")

    new_view = View(
        id=view_id,
        name=request.name,
        description=request.description,
        snapshot_url=snapshot_url,
        thumbnail_url=thumbnail_url,
    )

    session.add(new_view)
    await session.commit()

    return new_view


@router.get("", status_code=status.HTTP_200_OK, response_model=list[ViewResponse])
async def list_views_for_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    session: SessionDependency,
):
    result = await session.execute(select(View).where(View.entry_id == entry_id))
    entries = result.scalars().all()
    return entries


@router.get("/{view_id}", status_code=status.HTTP_200_OK, response_model=ViewResponse)
async def get_view(
    view_id: Annotated[UUID, Path(title="View ID")],
    session: SessionDependency,
):
    result = await session.get(View, view_id)
    if not result:
        raise HTTPException(status_code=404, detail="Entry not found")
    return result


@router.put("/{view_id}", status_code=status.HTTP_200_OK, response_model=ViewResponse)
async def update_view(
    view_id: Annotated[UUID, Path(title="View ID")],
    request: Annotated[ViewUpdateRequest, Body()],
    session: SessionDependency,
):
    view = await session.get(View, view_id)
    if not view:
        raise HTTPException(status_code=404, detail="Entry not found")

    view.update(request.model_dump(exclude_unset=True))
    session.add(view)

    await session.commit()

    return view


@router.delete("/{view_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_view(
    view_id: Annotated[UUID, Path(title="View ID")],
    session: SessionDependency,
) -> None:
    view = await session.get(View, view_id)
    if not view:
        raise HTTPException(status_code=404, detail="Entry not found")
    await session.delete(view)
    await session.commit()

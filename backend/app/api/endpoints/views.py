import json
from datetime import datetime
from typing import Annotated
from uuid import UUID, uuid4

from fastapi import APIRouter, File, Form, HTTPException, Response, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy import select

from app.api.contracts.responses.views import ViewResponse
from app.api.dependencies.core import DbSessionDependency
from app.database.models.entry import Entry
from app.database.models.view import View
from app.services.files.upload import file_storage

router = APIRouter(tags=["views"])


@router.post("/with-image", status_code=201)
async def create_view_with_image(
    db: DbSessionDependency,
    entry_id: Annotated[UUID, Form()],
    name: Annotated[str, Form()],
    description: Annotated[str | None, Form()] = None,
    image: Annotated[UploadFile | None, File()] = None,
    snapshot_json: Annotated[str | None, Form()] = None,
) -> Annotated[ViewResponse, Response(status_code=status.HTTP_201_CREATED)]:
    # Check if entry exists
    result = await db.execute(select(Entry).where(Entry.id == entry_id, Entry.deleted_at.is_(None)))
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    # Parse snapshot if provided
    snapshot = None
    if snapshot_json:
        try:
            snapshot = json.loads(snapshot_json)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON in snapshot")

    # Create new view with a UUID
    view_id = uuid4()
    image_path = None

    # Save image if provided
    if image:
        try:
            image_path = await file_storage.save_view_image(view_id, image.file, image.filename)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving image: {str(e)}")

    # Create view record
    new_view = View(
        id=view_id,
        name=name,
        description=description,
        snapshot=snapshot,
        entry_id=entry_id,
        image_path=image_path,
        created_at=datetime.now(),
        updated_at=datetime.now(),
        deleted_at=None,
        entry=entry,
    )

    db.add(new_view)
    await db.commit()
    await db.refresh(new_view)

    return new_view


@router.get("/entry/{entry_id}", response_model=list[ViewResponse])
def list_views_for_entry(entry_id: UUID, db: DbSessionDependency):
    # Check if entry exists
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.deleted_at.is_(None)).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    # Get views
    views = db.query(View).filter(View.entry_id == entry_id, View.deleted_at.is_(None)).all()

    return views


@router.get("/{view_id}", response_model=ViewResponse)
def get_view(view_id: UUID, db: DbSessionDependency):
    view = db.query(View).filter(View.id == view_id, View.deleted_at.is_(None)).first()

    if not view:
        raise HTTPException(status_code=404, detail="View not found")

    return view


@router.get("/{view_id}/image")
async def get_view_image(view_id: UUID, db: DbSessionDependency):
    view = db.query(View).filter(View.id == view_id, View.deleted_at.is_(None)).first()

    if not view:
        raise HTTPException(status_code=404, detail="View not found")

    if not view.image_path:
        raise HTTPException(status_code=404, detail="View has no image")

    try:
        # For local storage, we can use FileResponse
        # In production with MinIO, you'd return a stream or a redirect
        return FileResponse(view.image_path)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Image file not found")

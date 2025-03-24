from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database.models import Entry
from app.database.session import get_db
from app.contracts.responses.entries import SearchResults

router = APIRouter()

@router.get("/", response_model=SearchResults)
def search_entries(
    search: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> Any:
    query = db.query(Entry)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Entry.name.ilike(search_term),
                Entry.description.ilike(search_term),
            )
        )

    total = query.count()

    entries = query.order_by(Entry.created_at.desc()).offset(skip).limit(limit).all()

    page = skip // limit + 1 if limit > 0 else 1
    total_pages = (total + limit - 1) // limit if limit > 0 else 1

    return {
        "results": entries,
        "total": total,
        "page": page,
        "per_page": limit,
        "total_pages": total_pages,
    }

@router.post("/", response_model=SearchResults)
def create_entry(entry: Entry, db: Session = Depends(get_db)):
    pass
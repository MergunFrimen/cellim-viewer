from fastapi import APIRouter

from app.api.tags import Tags

router = APIRouter(prefix="/auth", tags=[Tags.auth])

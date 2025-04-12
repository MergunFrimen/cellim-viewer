from fastapi import APIRouter

from app.api.v1.endpoints import auth, entries, views
from app.core.settings import get_settings

v1_api_router = APIRouter(prefix=get_settings().API_V1_PREFIX)

v1_api_router.include_router(entries.router)
v1_api_router.include_router(views.router)

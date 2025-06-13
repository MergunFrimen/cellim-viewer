from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute

from app.api.v1.api import v1_api_router
from app.api.v1.tags import v1_api_tags_metadata
from app.core.settings import ModeEnum, get_settings
from app.database.models.role_model import RoleEnum
from app.database.session_manager import get_session_manager
from app.middleware.test_auth_middleware import TestAuthMiddleware


# for SDK
def generate_unique_id_function(route: APIRoute):
    return f"{route.tags[0]}-{route.name}"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    yield
    # shutdown
    if get_session_manager().engine is not None:
        await get_session_manager().close()


app = FastAPI(
    title=get_settings().APP_NAME,
    summary=get_settings().APP_SUMMARY,
    version=get_settings().APP_VERSION,
    contact=get_settings().APP_CONTACT,
    license_info=get_settings().APP_LICENCE,
    openapi_url=get_settings().OPENAPI_URL,
    openapi_tags=v1_api_tags_metadata,
    generate_unique_id_function=generate_unique_id_function,
    lifespan=lifespan,
)

# routes
app.include_router(v1_api_router)

# middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    TestAuthMiddleware,
    role=RoleEnum.user,
    enabled=get_settings().MODE != ModeEnum.production,
)

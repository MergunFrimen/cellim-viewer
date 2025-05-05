import shutil
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, logger
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute

from app.api.v1.api import v1_api_router
from app.api.v1.endpoints import upload_endpoint
from app.api.v1.endpoints.upload_endpoint import MAX_SIZE, TEMP_DIR
from app.api.v1.tags import v1_tags_metadata
from app.core.settings import ModeEnum, get_settings
from app.database.models.role_model import RoleEnum
from app.database.session_manager import get_session_manager
from app.middleware.test_auth_middleware import TestAuthMiddleware


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
    openapi_tags=v1_tags_metadata,
    openapi_url=get_settings().OPENAPI_URL,
    generate_unique_id_function=generate_unique_id_function,
    lifespan=lifespan,
)

# routes
app.include_router(v1_api_router)
app.include_router(upload_endpoint.router)

# middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=get_settings().CORS_ORIGINS,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=[
        "Location",
        "Upload-Offset",
        "Upload-Length",
        "Tus-Resumable",
        "Tus-Version",
        "Tus-Extension",
        "Tus-Max-Size",
        "X-Requested-With",
        "Upload-Metadata",
    ],
)
app.add_middleware(
    TestAuthMiddleware,
    role=RoleEnum.user,
    enabled=get_settings().MODE != ModeEnum.production,
)


@app.middleware("http")
async def add_tus_headers(request: Request, call_next):
    # Process the request
    response = await call_next(request)

    # Add TUS headers to all responses from the uploads endpoint
    if request.url.path.startswith("/uploads"):
        response.headers["Tus-Resumable"] = "1.0.0"
        response.headers["Tus-Version"] = "1.0.0"
        response.headers["Tus-Extension"] = "creation,termination,checksum,expiration"
        response.headers["Tus-Max-Size"] = str(MAX_SIZE)
        # Ensure CORS headers are properly set
        response.headers["Access-Control-Expose-Headers"] = (
            "Location, Upload-Location, Upload-Offset, Upload-Length, Tus-Resumable, Tus-Version, Tus-Extension, Tus-Max-Size"
        )

    return response

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import v1_api_router
from app.api.v1.tags import v1_tags_metadata
from app.core.settings import get_settings
from app.database.session_manager import get_session_manager


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
    openapi_url=f"{get_settings().API_V1_PREFIX}/openapi.json",
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

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=get_settings().APP_HOST, port=get_settings().APP_PORT)

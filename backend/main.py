import uuid
from contextlib import asynccontextmanager
from enum import Enum

from fastapi import FastAPI
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints import entries, files, views
from app.database.models import Entry, User
from app.database.models.base import Base
from app.database.session import sessionmanager
from app.middleware.test_middleware import TestMiddleware
from app.shared.settings import settings


async def seed_database():
    """Seed the database with initial data."""
    async with sessionmanager.session() as session:
        # Create a user
        user_id = uuid.uuid4()
        user = User(id=user_id, entries=[])
        session.add(user)

        # Create an entry
        entry_id = uuid.uuid4()
        entry = Entry(
            id=entry_id,
            user_id=user_id,
            name="Sample Entry",
            description="This is a sample entry created during database seeding.",
            user=user,
            views=[],
            links=[],
        )
        session.add(entry)

        # Commit the changes
        await session.commit()

        # Print the created objects
        print(f"Created user with ID: {user_id}")
        print(f"Created entry with ID: {entry_id}")


# TODO: move somewhere else
class Tags(Enum):
    entries = "entries"
    views = "views"


async def init_models():
    async with sessionmanager.engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    await init_models()
    await seed_database()
    yield
    # shutdown
    if sessionmanager.engine is not None:
        await sessionmanager.close()


middleware: list[Middleware] = [
    Middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    ),
    Middleware(TestMiddleware, number=1),
    Middleware(TestMiddleware, number=2),
]

app = FastAPI(
    root_path="/api",
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    middleware=middleware,
)


app.include_router(entries.router, prefix="/v1/entries")
app.include_router(views.router, prefix="/v1/views")
app.include_router(files.router, prefix="/v1/files")

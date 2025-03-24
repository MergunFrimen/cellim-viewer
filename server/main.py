from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import entries, views
from app.database.models import Base
from app.database.session import engine
from app.shared.config import settings

app = FastAPI(
    title="CELLIM Viewer API",
    description="API for visualizing and managing CELLIM data",
    version="0.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(entries.router, prefix="/api/entries", tags=["entries"])
app.include_router(views.router, prefix="/api/views", tags=["views"])

# Create database tables on startup if they don't exist
app.add_event_handler("startup", lambda _: Base.metadata.create_all(bind=engine))


@app.get("/")
async def root():
    return {"message": "Welcome to CELLIM Viewer API"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

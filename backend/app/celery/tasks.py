import asyncio
from typing import Any

from app.celery.celery_app import app


@app.task(bind=True)
async def process_large_dataset(self, seconds: int) -> dict[str, Any]:
    await asyncio.sleep(seconds)

    result = {
        "status": "heavy task finished",
        "seconds": seconds,
    }

    return result

import time
from typing import Any

from app.api.v1.endpoints.test_endpoint import get_airport_service
from app.celery.celery_app import app


@app.task()
async def process_large_dataset(seconds: int) -> dict[str, Any]:
    time.sleep(seconds)

    # await get_airport_service().get_airport_position, "ORD"
    # await get_airport_service().get_airport_position, "ORD"
    # await get_airport_service().get_airport_position, "ORD"
    # await get_airport_service().get_airport_position, "ORD"
    # await get_airport_service().get_airport_position, "ORD"

    result = {
        "status": "heavy task finished",
        "seconds": seconds,
    }

    return result

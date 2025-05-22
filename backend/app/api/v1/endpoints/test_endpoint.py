from functools import lru_cache

import httpx
from fastapi import APIRouter, BackgroundTasks

from app.api.v1.tags import Tags

router = APIRouter(prefix="/test", tags=[Tags.test])


class AirportService:
    async def get_airport_position(
        self,
        iata_code: str,
    ):
        airport_response = await httpx.AsyncClient().get(
            f"https://airport-data.com/api/ap_info.json?iata={iata_code}"
        )
        airport_data = airport_response.json()
        lat = airport_data["latitude"]
        lon = airport_data["longitude"]

        print("DONE", lat, lon)


@lru_cache
def get_airport_service():
    return AirportService()


@router.get("/background-task")
async def background_task(background_tasks: BackgroundTasks):
    background_tasks.add_task(get_airport_service().get_airport_position, "ORD")
    background_tasks.add_task(get_airport_service().get_airport_position, "ORD")
    background_tasks.add_task(get_airport_service().get_airport_position, "ORD")
    background_tasks.add_task(get_airport_service().get_airport_position, "ORD")
    return 123

# app/api/v1/endpoints/ws_endpoint.py
import asyncio
import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from redis import Redis

router = APIRouter(prefix="/ws", tags=["WebSocket"])

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>WebSocket Progress</title>
    </head>
    <body>
        <h1>Task Progress</h1>
        <div id="progress">0%</div>
        <div id="status">Waiting...</div>
        <script>
            const ws = new WebSocket("ws://localhost:8000/ws/progress");
            ws.onmessage = function(event) {
                const data = JSON.parse(event.data);
                if (data.status === "PROGRESS") {
                    document.getElementById("progress").innerText = `${data.progress.toFixed(1)}%`;
                    document.getElementById("status").innerText = `Processing ${data.current} of ${data.total}`;
                } else {
                    document.getElementById("status").innerText = data.message;
                }
            };
        </script>
    </body>
</html>
"""


@router.get("/test")
async def get():
    return HTMLResponse(html)


@router.websocket("/progress/{task_id}")
async def websocket_endpoint(websocket: WebSocket, task_id: str):
    await websocket.accept()
    redis = Redis.from_url("redis://redis:6379/0")
    pubsub = redis.pubsub()
    channel = f"task_updates:{task_id}"
    pubsub.subscribe(channel)

    try:
        while True:
            message = pubsub.get_message(ignore_subscribe_messages=True, timeout=1)
            if message:
                data = json.loads(message["data"])
                await websocket.send_json(data)
                if data.get("status") == "COMPLETED":
                    break
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        pass
    finally:
        pubsub.unsubscribe(channel)
        pubsub.close()

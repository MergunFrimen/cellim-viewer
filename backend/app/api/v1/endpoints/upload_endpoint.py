import logging
import shutil
import uuid
from pathlib import Path
from typing import Any, Dict

from fastapi import APIRouter, HTTPException, Request, Response

router = APIRouter(prefix="", tags=["Uploads"])

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Configuration
UPLOAD_DIR = Path("./uploads")
TEMP_DIR = Path("./temp")
MAX_SIZE = 1024 * 1024 * 1024  # 1GB

# Create directories if they don't exist
UPLOAD_DIR.mkdir(exist_ok=True)
TEMP_DIR.mkdir(exist_ok=True)

# In-memory storage for upload metadata
# In a production environment, use a database
upload_store: Dict[str, Dict[str, Any]] = {}


@router.options("/uploads/", status_code=204)
@router.options("/uploads/{upload_id}", status_code=204)
async def options_handler(request: Request, response: Response):
    # Handle OPTIONS request for CORS preflight
    # No need to set TUS headers here as they'll be added by the middleware
    return Response(status_code=204)


@router.post("/uploads/", status_code=201)
async def create_upload(request: Request, response: Response):
    """Create a new upload resource"""
    logger.info("Creating new upload")

    # Check for TUS protocol version
    if request.headers.get("Tus-Resumable") != "1.0.0":
        return Response(status_code=412, content="Unsupported TUS version")

    # Get upload length
    upload_length = request.headers.get("Upload-Length")
    if not upload_length:
        return Response(status_code=400, content="Upload-Length header required")

    try:
        upload_length = int(upload_length)
    except ValueError:
        return Response(status_code=400, content="Invalid Upload-Length")

    if upload_length > MAX_SIZE:
        return Response(status_code=413, content="File too large")

    # Create upload ID
    upload_id = str(uuid.uuid4())

    # Extract metadata
    metadata = {}
    if "Upload-Metadata" in request.headers:
        for kv in request.headers["Upload-Metadata"].split(","):
            if " " in kv:
                k, v = kv.strip().split(" ", 1)
                import base64

                metadata[k] = base64.b64decode(v).decode("utf-8")

    filename = metadata.get("filename", upload_id)

    # Create temporary file
    temp_file = TEMP_DIR / upload_id
    temp_file.touch()

    # Store upload info
    upload_store[upload_id] = {
        "id": upload_id,
        "filename": filename,
        "size": upload_length,
        "offset": 0,
        "temp_path": str(temp_file),
        "metadata": metadata,
    }

    # Set response headers
    response.headers["Tus-Resumable"] = "1.0.0"
    response.headers["Location"] = f"/uploads/{upload_id}"
    # Add a custom header with the same information that can be read by JS
    response.headers["Upload-Location"] = f"/uploads/{upload_id}"
    response.headers["Access-Control-Expose-Headers"] = "Location, Upload-Location"

    logger.info(f"Created upload: {upload_id}, filename: {filename}")
    return Response(status_code=201, headers=dict(response.headers))


@router.head("/uploads/{upload_id}", status_code=200)
async def head_upload(upload_id: str, response: Response):
    """Get upload offset"""
    if upload_id not in upload_store:
        return Response(status_code=404)

    upload_info = upload_store[upload_id]

    response.headers["Tus-Resumable"] = "1.0.0"
    response.headers["Upload-Length"] = str(upload_info["size"])
    response.headers["Upload-Offset"] = str(upload_info["offset"])
    response.headers["Cache-Control"] = "no-store"

    return Response(status_code=200, headers=dict(response.headers))


@router.patch("/uploads/{upload_id}", status_code=204)
@router.post(
    "/uploads/{upload_id}", status_code=204
)  # Handle POST requests with X-HTTP-Method-Override header
async def patch_upload(upload_id: str, request: Request, response: Response):
    """Handle chunk upload"""
    if upload_id not in upload_store:
        return Response(status_code=404)

    upload_info = upload_store[upload_id]

    # Check headers
    if request.headers.get("Tus-Resumable") != "1.0.0":
        return Response(status_code=412, content="Unsupported TUS version")

    # Handle X-HTTP-Method-Override for browsers that don't support PATCH
    if request.method == "POST" and request.headers.get("X-HTTP-Method-Override") == "PATCH":
        logger.info("Handling POST request with X-HTTP-Method-Override: PATCH")

    content_type = request.headers.get("Content-Type")
    if content_type != "application/offset+octet-stream":
        return Response(status_code=415, content="Invalid Content-Type")

    # Check offset
    try:
        offset = int(request.headers.get("Upload-Offset", "0"))
    except ValueError:
        return Response(status_code=400, content="Invalid Upload-Offset")

    if offset != upload_info["offset"]:
        return Response(status_code=409, content="Conflict: offset doesn't match")

    # Read chunk
    chunk = await request.body()
    chunk_size = len(chunk)

    # Check if the upload would exceed the declared size
    if offset + chunk_size > upload_info["size"]:
        return Response(status_code=413, content="Upload would exceed declared size")

    # Write chunk to file
    temp_path = Path(upload_info["temp_path"])
    with open(temp_path, "ab") as f:
        f.write(chunk)

    # Update offset
    upload_info["offset"] += chunk_size

    # Check if upload is complete
    if upload_info["offset"] == upload_info["size"]:
        # Move file to upload directory
        filename = upload_info["metadata"].get("filename", upload_id)
        safe_filename = secure_filename(filename)
        final_path = UPLOAD_DIR / safe_filename

        # Ensure filename is unique
        counter = 1
        stem = final_path.stem
        suffix = final_path.suffix
        while final_path.exists():
            final_path = UPLOAD_DIR / f"{stem}_{counter}{suffix}"
            counter += 1

        # Move the file
        shutil.move(temp_path, final_path)

        # Update upload info with final path
        upload_info["final_path"] = str(final_path)
        upload_info["url"] = f"/files/{final_path.name}"

        logger.info(f"Upload complete: {upload_id}, saved as: {final_path.name}")

    # Set response headers
    response.headers["Tus-Resumable"] = "1.0.0"
    response.headers["Upload-Offset"] = str(upload_info["offset"])

    return Response(status_code=204, headers=dict(response.headers))


@router.delete("/uploads/{upload_id}", status_code=204)
async def delete_upload(upload_id: str):
    """Terminate an upload"""
    if upload_id not in upload_store:
        return Response(status_code=404)

    upload_info = upload_store[upload_id]

    # Delete temporary file if it exists
    temp_path = Path(upload_info["temp_path"])
    if temp_path.exists():
        temp_path.unlink()

    # Remove from store
    del upload_store[upload_id]

    logger.info(f"Upload terminated: {upload_id}")
    return Response(status_code=204)


@router.get("/files/{filename}")
async def get_file(filename: str):
    """Get uploaded file"""
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    # In a real app, you might want to stream the file instead
    return {"file_url": f"/download/{filename}"}


@router.get("/download/{filename}")
async def download_file(filename: str, response: Response):
    """Download file endpoint"""
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    # Read file and return
    with open(file_path, "rb") as f:
        content = f.read()

    response.headers["Content-Disposition"] = f"attachment; filename={filename}"
    return Response(content=content, media_type="application/octet-stream")


@router.get("/uploads/status")
async def get_uploads_status():
    """Get status of all uploads"""
    return upload_store


def secure_filename(filename: str) -> str:
    """Create a secure version of a filename"""
    # Simple implementation - in production, use a more robust solution
    return "".join(c for c in filename if c.isalnum() or c in "._- ").strip()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

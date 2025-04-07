from io import BytesIO
from typing import BinaryIO

from minio import Minio
from minio.error import S3Error

from app.shared.settings import settings


class MinioBackend:
    """Implementation of storage operations using MinIO S3-compatible storage."""

    def __init__(
        self, endpoint: str, access_key: str, secret_key: str, bucket: str, secure: bool = False
    ):
        self.client = Minio(endpoint, access_key=access_key, secret_key=secret_key, secure=secure)
        self.bucket = bucket

        # Create bucket if it doesn't exist
        if not self.client.bucket_exists(bucket):
            self.client.make_bucket(bucket)

    async def save_file(self, file_content: BinaryIO, file_path: str) -> str:
        """Save file to MinIO storage."""
        try:
            # Get file size
            file_content.seek(0, 2)  # Seek to the end
            file_size = file_content.tell()  # Get current position (file size)
            file_content.seek(0)  # Reset to beginning

            # Upload file
            self.client.put_object(
                self.bucket,
                file_path,
                file_content,
                file_size,
                content_type="application/octet-stream",  # Default content type
            )

            return file_path
        except S3Error as e:
            raise Exception(f"Error saving file to MinIO: {str(e)}")

    async def get_file(self, file_path: str) -> bytes:
        """Get file from MinIO storage."""
        try:
            response = self.client.get_object(self.bucket, file_path)
            data = response.read()
            response.close()
            response.release_conn()
            return data
        except S3Error as e:
            if "NoSuchKey" in str(e):
                raise FileNotFoundError(f"File not found: {file_path}")
            raise Exception(f"Error getting file from MinIO: {str(e)}")

    async def delete_file(self, file_path: str) -> bool:
        """Delete file from MinIO storage."""
        try:
            self.client.remove_object(self.bucket, file_path)
            return True
        except S3Error as e:
            if "NoSuchKey" in str(e):
                return False
            raise Exception(f"Error deleting file from MinIO: {str(e)}")


# To switch from local storage to MinIO, update the file_storage instance:

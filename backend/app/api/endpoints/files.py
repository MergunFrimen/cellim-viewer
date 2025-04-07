from fastapi import APIRouter

router = APIRouter(tags=["files"])


@router.get("")
def download_file():
    pass


@router.post("")
def upload_file():
    pass

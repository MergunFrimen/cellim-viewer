from enum import Enum


class Tags(Enum):
    entries = "entries"
    views = "views"
    files = "files"


tags_metadata = [
    {
        "name": Tags.entries,
        "description": "Operations with entries.",
    },
    {
        "name": Tags.views,
        "description": "Operations with views.",
    },
    {
        "name": Tags.views,
        "description": "Operations with files.",
    },
]

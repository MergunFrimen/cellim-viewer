from enum import Enum


class Tags(Enum):
    entries = "Entries"
    views = "Views"
    files = "Files"


tags_metadata = [
    {
        "name": Tags.entries,
        "description": "Operations with entries.",
        "summary": "Create an item",
    },
    {
        "name": Tags.views,
        "description": "Operations with views.",
    },
    {
        "name": Tags.files,
        "description": "Operations with files.",
    },
]

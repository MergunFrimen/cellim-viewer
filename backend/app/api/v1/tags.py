from enum import Enum


class Tags(Enum):
    auth = "Auth"
    entries = "Entries"
    files = "Files"
    views = "Views"


v1_tags_metadata = [
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

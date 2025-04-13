from enum import Enum


class Tags(Enum):
    auth = "Auth"
    entries = "Entries"
    files = "Files"
    views = "Views"


v1_tags_metadata = [
    # {
    #     "name": Tags.auth,
    #     "description": "Auth",
    # },
    {
        "name": Tags.entries,
        # "description": "Entries",
    },
    # {
    #     "name": Tags.files,
    #     "description": "Files",
    # },
    {
        "name": Tags.views,
        # "description": "Views",
    },
]

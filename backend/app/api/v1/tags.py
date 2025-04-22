from enum import Enum


class Tags(Enum):
    auth = "Auth"
    entries = "Entries"
    files = "Files"
    share_links = "Share Links"
    views = "Views"

    def __str__(self):
        return super().value.lower()


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

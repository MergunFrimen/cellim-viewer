from app.api.v1.contracts.responses.views import ViewResponse
from app.database.models.entry import EntryBase
from app.database.models.mixins import WithTimestamp
from app.database.models.share_link import ShareLinkBase


class EntryResponse(EntryBase):
    pass


class EntryWithViewsResponse(EntryResponse, WithTimestamp):
    link: ShareLinkBase
    views: list[ViewResponse] = []

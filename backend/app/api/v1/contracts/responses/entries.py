from app.api.v1.contracts.responses.views import ViewResponse
from app.database.models.entry import EntryBase
from app.database.models.mixins import WithTimestamp


class EntryResponse(EntryBase):
    pass


class EntryWithViewsResponse(EntryBase, WithTimestamp):
    views: list[ViewResponse]

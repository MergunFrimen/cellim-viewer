from app.database.models.entry import EntryBase
from app.database.models.mixins import WithTimestamp


class EntryResponse(EntryBase, WithTimestamp):
    pass

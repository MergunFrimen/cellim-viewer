from sqlalchemy.ext.asyncio import AsyncSession


class EntryService:
    def __init__(self, session: AsyncSession):
        self._session = session

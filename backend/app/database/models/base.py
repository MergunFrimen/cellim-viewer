from typing import Any
from uuid import UUID

from sqlalchemy import JSON, DeclarativeBase, MappedAsDataclass, String, mapped_column
from typing_extensions import Annotated

str255 = Annotated[str, 255]
uuidpk = Annotated[UUID, mapped_column(primary_key=True)]


class Base(DeclarativeBase, MappedAsDataclass):
    type_annotation_map = {
        dict[str, Any]: JSON,
        str255: String(50),
    }

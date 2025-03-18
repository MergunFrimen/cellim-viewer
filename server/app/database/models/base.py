from datetime import datetime

from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.types import DateTime, String
from typing_extensions import Annotated

intpk = Annotated[int, mapped_column(primary_key=True)]
str255 = Annotated[str, 255]


# class Base(MappedAsDataclass, DeclarativeBase):
class Base(DeclarativeBase):
    type_annotation_map = {
        str255: String(50),
    }

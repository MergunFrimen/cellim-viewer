from datetime import datetime
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import JSON, DateTime, String, Uuid
from sqlalchemy.orm import DeclarativeBase, MappedAsDataclass, mapped_column
from typing_extensions import Annotated

# https://docs.sqlalchemy.org/en/20/changelog/whatsnew_20.html#step-five-make-use-of-pep-593-annotated-to-package-common-directives-into-types
uuidpk = Annotated[str, mapped_column(Uuid, primary_key=True, default=uuid4)]
uuidfk = Annotated[str, mapped_column(Uuid)]
str255 = Annotated[str, mapped_column(String(255))]
timestamptz = Annotated[datetime, mapped_column(DateTime(timezone=True))]
snapshot = Annotated[dict[str, Any], mapped_column(JSON)]


class Base(DeclarativeBase, MappedAsDataclass):
    type_annotation_map = {}

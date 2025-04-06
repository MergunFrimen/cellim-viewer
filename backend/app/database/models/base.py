from datetime import datetime
from typing import Annotated, Any, Literal
from uuid import uuid4

from sqlalchemy import JSON, DateTime, String, Uuid
from sqlalchemy.orm import DeclarativeBase, MappedAsDataclass, mapped_column

# https://docs.sqlalchemy.org/en/20/changelog/whatsnew_20.html#step-five-make-use-of-pep-593-annotated-to-package-common-directives-into-types
UuidPk = Annotated[str, mapped_column(Uuid, primary_key=True, default=uuid4)]
UuidFk = Annotated[str, mapped_column(Uuid)]
Str255 = Annotated[str, mapped_column(String(255))]
Timestamptz = Annotated[datetime, mapped_column(DateTime(timezone=True))]
SnapshotType = Annotated[dict[str, Any], mapped_column(JSON)]
LinkType = Literal["viewer", "editor"]


class Base(DeclarativeBase, MappedAsDataclass):
    type_annotation_map = {}

from typing import Annotated
from uuid import UUID, uuid4

from sqlalchemy import String, Uuid
from sqlalchemy.orm import DeclarativeBase, MappedAsDataclass, mapped_column

# https://docs.sqlalchemy.org/en/20/changelog/whatsnew_20.html#step-five-make-use-of-pep-593-annotated-to-package-common-directives-into-types
UuidPk = Annotated[UUID, mapped_column(Uuid, primary_key=True, default=uuid4)]
UuidFk = Annotated[UUID, mapped_column(Uuid)]
Str255 = Annotated[str, mapped_column(String(255))]


class Base(DeclarativeBase, MappedAsDataclass):
    type_annotation_map = {}

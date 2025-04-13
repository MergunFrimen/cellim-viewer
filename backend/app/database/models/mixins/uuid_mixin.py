from uuid import UUID, uuid4

from sqlalchemy.orm import Mapped, mapped_column


class UuidMixin:
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    # @declared_attr
    # def id(cls):
    #     return mapped_column(UUID, primary_key=True, default=uuid4)

from pydantic import HttpUrl
from sqlmodel import String, TypeDecorator


class HttpUrlType(TypeDecorator):
    impl = String(2083)  # chrome max length
    cache_ok = True
    python_type = HttpUrl

    def process_bind_param(self, value, dialect) -> str:
        return str(value)

    def process_result_value(self, value, dialect) -> HttpUrl:
        return HttpUrl(url=value)

    def process_literal_param(self, value, dialect) -> str:
        return str(value)

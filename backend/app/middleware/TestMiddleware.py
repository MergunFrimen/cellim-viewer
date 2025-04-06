from starlette.middleware.base import BaseHTTPMiddleware, Request, RequestResponseEndpoint
from starlette.types import ASGIApp


class TestMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp, number: int = 1):
        super().__init__(app)
        self.app = app
        self.number = number

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint):
        print(f"middleware {self.number}: request")
        response = await call_next(request)
        print(f"middleware {self.number}: response")
        return response

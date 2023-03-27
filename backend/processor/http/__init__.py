import fastapi
from starlette.middleware.sessions import SessionMiddleware

def register_routers(app: fastapi.FastAPI):
    from . import (
        account,
        public,
        google,
    )
    app.include_router(public.router)
    app.include_router(account.router)
    app.add_middleware(SessionMiddleware, secret_key="secret-string")
    app.include_router(google.router)

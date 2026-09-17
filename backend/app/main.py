import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.routes import limiter, router as api_router
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.webhooks.shopify import router as webhooks_router

configure_logging()
logger = logging.getLogger(__name__)
settings = get_settings()

app = FastAPI(
    title="Fieldstone Custom API",
    description="Custom backend services that sit alongside Shopify for the Fieldstone headless store.",
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    logger.warning("Validation error on %s: %s", request.url.path, exc.errors())
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Invalid request", "errors": exc.errors()},
    )


app.include_router(api_router, prefix="/api", tags=["api"])
app.include_router(webhooks_router, prefix="/api", tags=["webhooks"])


@app.get("/")
async def root() -> dict:
    return {"service": "fieldstone-backend", "status": "running", "docs": "/docs"}

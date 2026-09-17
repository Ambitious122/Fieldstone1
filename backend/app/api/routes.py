import logging

from fastapi import APIRouter, HTTPException, Request, status
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import get_settings
from app.schemas.common import HealthResponse
from app.schemas.contact import ContactRequest, ContactResponse
from app.schemas.newsletter import NewsletterRequest, NewsletterResponse
from app.schemas.recommendation import RecommendationResponse
from app.services.email_service import EmailService
from app.services.recommendation_service import RecommendationService

logger = logging.getLogger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

email_service = EmailService()
recommendation_service = RecommendationService()


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(status="ok", environment=settings.environment)


@router.post("/contact", response_model=ContactResponse)
@limiter.limit("5/minute")
async def submit_contact_form(request: Request, payload: ContactRequest) -> ContactResponse:
    try:
        await email_service.send_contact_email(
            name=payload.name, email=payload.email, subject=payload.subject, message=payload.message
        )
    except Exception:
        logger.exception("Failed to send contact email")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not deliver your message right now. Please try again shortly.",
        )
    return ContactResponse(success=True, message="Thanks — we'll get back to you within one business day.")


@router.post("/newsletter", response_model=NewsletterResponse)
@limiter.limit("5/minute")
async def subscribe_newsletter(request: Request, payload: NewsletterRequest) -> NewsletterResponse:
    try:
        await email_service.subscribe_to_newsletter(email=payload.email)
    except Exception:
        logger.exception("Failed to subscribe to newsletter")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not subscribe you right now. Please try again shortly.",
        )
    return NewsletterResponse(success=True, message="You're subscribed.")


@router.get("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(product_id: str, limit: int = 4) -> RecommendationResponse:
    return await recommendation_service.get_recommendations(product_id=product_id, limit=limit)

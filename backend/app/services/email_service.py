"""Outbound email/newsletter integration.

Provider-agnostic wrapper so /api/contact and /api/newsletter don't care
whether the underlying provider is Resend, Postmark, SendGrid, etc.
Swap the implementation of `send` / `subscribe` for your provider's SDK.
"""
import logging

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self) -> None:
        self._settings = get_settings()

    async def send_contact_email(self, name: str, email: str, subject: str, message: str) -> None:
        if not self._settings.email_api_key:
            logger.info("EMAIL_API_KEY not set — logging contact message instead of sending: %s <%s> %s: %s", name, email, subject, message)
            return

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {self._settings.email_api_key}"},
                json={
                    "from": self._settings.email_from,
                    "to": [self._settings.email_from],
                    "reply_to": email,
                    "subject": f"[Contact form] {subject}",
                    "text": f"From: {name} <{email}>\n\n{message}",
                },
            )
            response.raise_for_status()

    async def subscribe_to_newsletter(self, email: str) -> None:
        if not self._settings.email_api_key or not self._settings.newsletter_list_id:
            logger.info("Newsletter provider not configured — logging signup instead: %s", email)
            return

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"https://api.resend.com/audiences/{self._settings.newsletter_list_id}/contacts",
                headers={"Authorization": f"Bearer {self._settings.email_api_key}"},
                json={"email": email},
            )
            response.raise_for_status()

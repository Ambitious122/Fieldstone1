"""Shopify webhook receiver with HMAC verification.

Shopify signs every webhook payload with your webhook secret. We must verify
that signature BEFORE trusting or processing the body, and always with the
raw request bytes (not a re-serialized JSON object, which can produce a
different byte sequence and break the signature check).
"""
import base64
import hashlib
import hmac
import logging

from fastapi import APIRouter, Header, HTTPException, Request, status

from app.core.config import get_settings

logger = logging.getLogger(__name__)
router = APIRouter()


def verify_webhook_signature(raw_body: bytes, hmac_header: str | None, secret: str) -> bool:
    if not hmac_header or not secret:
        return False
    digest = hmac.new(secret.encode("utf-8"), raw_body, hashlib.sha256).digest()
    computed = base64.b64encode(digest).decode("utf-8")
    return hmac.compare_digest(computed, hmac_header)


@router.post("/webhooks/shopify")
async def handle_shopify_webhook(
    request: Request,
    x_shopify_hmac_sha256: str | None = Header(default=None),
    x_shopify_topic: str | None = Header(default=None),
    x_shopify_shop_domain: str | None = Header(default=None),
):
    settings = get_settings()
    raw_body = await request.body()

    if not verify_webhook_signature(raw_body, x_shopify_hmac_sha256, settings.shopify_webhook_secret):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid webhook signature")

    payload = await request.json()
    logger.info("Received Shopify webhook: topic=%s shop=%s", x_shopify_topic, x_shopify_shop_domain)

    match x_shopify_topic:
        case "orders/create":
            await _handle_order_created(payload)
        case "orders/updated":
            await _handle_order_updated(payload)
        case "products/update":
            await _handle_product_updated(payload)
        case "customers/create" | "customers/update":
            await _handle_customer_changed(payload)
        case "inventory_levels/update":
            await _handle_inventory_changed(payload)
        case _:
            logger.info("Unhandled webhook topic: %s", x_shopify_topic)

    return {"received": True}


async def _handle_order_created(payload: dict) -> None:
    logger.info("Order created: id=%s total=%s", payload.get("id"), payload.get("total_price"))
    # e.g. trigger confirmation email, sync to analytics/CRM, etc.


async def _handle_order_updated(payload: dict) -> None:
    logger.info("Order updated: id=%s status=%s", payload.get("id"), payload.get("financial_status"))


async def _handle_product_updated(payload: dict) -> None:
    logger.info("Product updated: id=%s handle=%s", payload.get("id"), payload.get("handle"))
    # e.g. invalidate a CDN/ISR cache tag for this product's pages


async def _handle_customer_changed(payload: dict) -> None:
    logger.info("Customer changed: id=%s email=%s", payload.get("id"), payload.get("email"))


async def _handle_inventory_changed(payload: dict) -> None:
    logger.info("Inventory changed: inventory_item_id=%s available=%s", payload.get("inventory_item_id"), payload.get("available"))

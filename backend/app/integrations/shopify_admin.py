"""Thin async client for Shopify's Admin API.

Kept server-side only — the Admin access token must never reach the browser.
The frontend talks to Shopify exclusively through the public Storefront API.
"""
import httpx

from app.core.config import get_settings


class ShopifyAdminClient:
    def __init__(self) -> None:
        settings = get_settings()
        self._base_url = (
            f"https://{settings.shopify_shop_domain}/admin/api/"
            f"{settings.shopify_admin_api_version}"
        )
        self._headers = {
            "X-Shopify-Access-Token": settings.shopify_admin_access_token,
            "Content-Type": "application/json",
        }

    async def graphql(self, query: str, variables: dict | None = None) -> dict:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                f"{self._base_url}/graphql.json",
                headers=self._headers,
                json={"query": query, "variables": variables or {}},
            )
            response.raise_for_status()
            payload = response.json()
            if "errors" in payload:
                raise ShopifyAdminError(str(payload["errors"]))
            return payload["data"]

    async def get_recently_viewed_together(self, product_id: str, limit: int = 8) -> list[dict]:
        """Placeholder for a real recommendation source.

        Shopify exposes a `productRecommendations` query on the Storefront API,
        which is usually the better fit for this and doesn't need Admin scopes.
        This method exists so a future model-based recommender can be swapped
        in on the backend without touching the frontend contract.
        """
        return []


class ShopifyAdminError(RuntimeError):
    pass

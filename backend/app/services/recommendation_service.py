"""Product recommendation logic.

For a real store, prefer Shopify's own `productRecommendations` Storefront
API query first — it's free, fast, and needs no backend. This service is
the extension point for a custom model (e.g. co-purchase history, view
history) once you have first-party behavioral data to train on.
"""
from app.schemas.recommendation import RecommendedProduct, RecommendationResponse


class RecommendationService:
    async def get_recommendations(self, product_id: str, limit: int = 4) -> RecommendationResponse:
        # Placeholder heuristic until a real model/data source is wired in.
        return RecommendationResponse(product_id=product_id, recommendations=[])

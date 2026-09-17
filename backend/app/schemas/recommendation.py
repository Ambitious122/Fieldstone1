from pydantic import BaseModel


class RecommendedProduct(BaseModel):
    id: str
    handle: str
    title: str
    score: float


class RecommendationResponse(BaseModel):
    product_id: str
    recommendations: list[RecommendedProduct]

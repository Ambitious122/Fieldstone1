"""Centralized application configuration, loaded from environment variables."""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: str = "development"
    cors_origins: str = "http://localhost:3000"

    shopify_shop_domain: str = ""
    shopify_admin_access_token: str = ""
    shopify_admin_api_version: str = "2024-10"
    shopify_webhook_secret: str = ""

    email_provider: str = "resend"
    email_api_key: str = ""
    email_from: str = "hello@fieldstone.com"
    newsletter_list_id: str = ""

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

/**
 * Centralized Shopify Storefront API client.
 *
 * Every product/collection/cart read in the app goes through here so there is
 * exactly one place that knows the endpoint, auth header, and API version.
 * This talks to the PUBLIC Storefront API only (safe to call from Server
 * Components / route handlers) — the Admin API token lives on the FastAPI
 * backend and never touches this file.
 */
import { GraphQLClient } from "graphql-request";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2024-10";
export const hasShopifyConfig = Boolean(
  domain &&
    token &&
    domain !== "your-store.myshopify.com" &&
    token !== "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
);

if (!hasShopifyConfig) {
  // Don't throw at import time in dev — surfaces a clearer runtime error
  // pointing at the specific request instead of failing the whole build.
  console.warn(
    "[shopify] NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set."
  );
}

const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

export const storefrontClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token ?? "",
    "Content-Type": "application/json",
  },
});

export async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!hasShopifyConfig) {
    throw new Error(
      "Shopify is not configured. Copy frontend/.env.example to frontend/.env.local and add your store domain and Storefront API token."
    );
  }

  try {
    return await storefrontClient.request<T>(query, variables);
  } catch (error) {
    console.error("[shopify] request failed", error);
    throw new Error("Unable to reach the store right now. Please try again.");
  }
}

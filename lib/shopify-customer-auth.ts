/**
 * Shopify Customer Account API (OAuth 2.0 + PKCE) helpers.
 *
 * Shopify's newer Customer Account API replaces the old classic customer
 * login — the store itself never sees the customer's password. Instead we
 * redirect to Shopify's hosted login, Shopify redirects back with a code,
 * and we exchange that code for tokens server-side. Tokens are kept in an
 * httpOnly cookie; they never touch client JS.
 *
 * Requires a "Headless" sales channel set up in Shopify admin, which
 * provides SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID and the account base URL.
 */
import { randomBytes, createHash } from "crypto";

const SHOP_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_SHOP_ID ?? "";
const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID ?? "";
const REDIRECT_URI = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_REDIRECT_URI ?? "http://localhost:3000/api/auth/callback";

const AUTH_BASE = `https://shopify.com/authentication/${SHOP_ID}`;

export function generatePkcePair() {
  const codeVerifier = randomBytes(32).toString("base64url");
  const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");
  return { codeVerifier, codeChallenge };
}

export function buildAuthorizationUrl(codeChallenge: string, state: string) {
  const url = new URL(`${AUTH_BASE}/oauth/authorize`);
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("scope", "openid email customer-account-api:full");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

export async function exchangeCodeForToken(code: string, codeVerifier: string) {
  const response = await fetch(`${AUTH_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code,
      code_verifier: codeVerifier,
    }),
  });
  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.status}`);
  }
  return response.json() as Promise<{ access_token: string; expires_in: number; refresh_token: string }>;
}

export async function fetchCustomerOrders(accessToken: string) {
  const query = /* GraphQL */ `
    query CustomerOrders {
      customer {
        firstName
        lastName
        emailAddress {
          emailAddress
        }
        orders(first: 20) {
          nodes {
            id
            name
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;
  const response = await fetch(`${AUTH_BASE.replace("authentication", "account")}/customer/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) {
    throw new Error(`Customer API request failed: ${response.status}`);
  }
  return response.json();
}

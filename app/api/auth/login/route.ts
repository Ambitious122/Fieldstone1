import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { generatePkcePair, buildAuthorizationUrl } from "@/lib/shopify-customer-auth";

/**
 * Kicks off Shopify's hosted customer login. Stashes the PKCE verifier and
 * an anti-CSRF state value in short-lived httpOnly cookies so the callback
 * route can verify them.
 */
export async function GET() {
  const { codeVerifier, codeChallenge } = generatePkcePair();
  const state = randomBytes(16).toString("hex");

  const response = NextResponse.redirect(buildAuthorizationUrl(codeChallenge, state));
  const cookieOpts = { httpOnly: true, secure: true, sameSite: "lax" as const, maxAge: 600, path: "/" };
  response.cookies.set("pkce_verifier", codeVerifier, cookieOpts);
  response.cookies.set("oauth_state", state, cookieOpts);
  return response;
}

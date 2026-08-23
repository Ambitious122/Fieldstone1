import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/shopify-customer-auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const storedState = request.cookies.get("oauth_state")?.value;
  const codeVerifier = request.cookies.get("pkce_verifier")?.value;

  if (!code || !state || !codeVerifier || state !== storedState) {
    return NextResponse.redirect(new URL("/account?error=invalid_state", request.url));
  }

  try {
    const tokens = await exchangeCodeForToken(code, codeVerifier);
    const response = NextResponse.redirect(new URL("/account", request.url));
    response.cookies.set("customer_access_token", tokens.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: tokens.expires_in,
      path: "/",
    });
    response.cookies.delete("pkce_verifier");
    response.cookies.delete("oauth_state");
    return response;
  } catch (error) {
    console.error("[auth callback] token exchange failed", error);
    return NextResponse.redirect(new URL("/account?error=auth_failed", request.url));
  }
}

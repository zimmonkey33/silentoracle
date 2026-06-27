import { NextRequest, NextResponse } from "next/server";
import { isWhopConfigured, signSession, setSessionCookie } from "@/lib/auth";
import { exchangeCodeForToken, getWhopUser, isUserSubscribed } from "@/lib/whop";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!isWhopConfigured()) return NextResponse.redirect(new URL("/?auth_error=whop_not_configured", req.url));
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = req.cookies.get("so_oauth_state")?.value;
  if (!code || !state || state !== storedState) return NextResponse.redirect(new URL("/?auth_error=invalid_state", req.url));
  const tokenRes = await exchangeCodeForToken(code);
  if (!tokenRes?.access_token) return NextResponse.redirect(new URL("/?auth_error=token_exchange_failed", req.url));
  const whopUser = await getWhopUser(tokenRes.access_token);
  if (!whopUser) return NextResponse.redirect(new URL("/?auth_error=user_fetch_failed", req.url));
  const subscribed = await isUserSubscribed(tokenRes.access_token);
  const sessionToken = await signSession({ sub: whopUser.id, email: whopUser.email, name: whopUser.username || whopUser.email.split("@")[0], isSubscribed: subscribed, isAdmin: false });
  await setSessionCookie(sessionToken);
  const res = NextResponse.redirect(new URL("/?auth=success", req.url));
  res.cookies.delete("so_oauth_state");
  return res;
}

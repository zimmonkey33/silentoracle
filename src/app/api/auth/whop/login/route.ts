import { NextResponse } from "next/server";
import { isWhopConfigured } from "@/lib/auth";
import { buildAuthorizeUrl, generateCodeVerifier, generateCodeChallenge } from "@/lib/whop";
import { webcrypto } from "node:crypto";
export const runtime = "nodejs";

export async function GET() {
  if (!isWhopConfigured()) return NextResponse.json({ error: "Whop is not configured." }, { status: 503 });
  const state = webcrypto.randomUUID();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const res = NextResponse.redirect(buildAuthorizeUrl(state, codeChallenge));
  res.cookies.set("so_oauth_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 600 });
  res.cookies.set("so_oauth_verifier", codeVerifier, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 600 });
  return res;
}

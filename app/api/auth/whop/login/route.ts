import { NextResponse } from "next/server";
import { isWhopConfigured } from "@/lib/auth";
import { buildAuthorizeUrl } from "@/lib/whop";
import { webcrypto } from "node:crypto";
export const runtime = "nodejs";

export async function GET() {
  if (!isWhopConfigured()) return NextResponse.json({ error: "Whop is not configured." }, { status: 503 });
  const state = webcrypto.randomUUID();
  const res = NextResponse.redirect(buildAuthorizeUrl(state));
  res.cookies.set("so_oauth_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 600 });
  return res;
}

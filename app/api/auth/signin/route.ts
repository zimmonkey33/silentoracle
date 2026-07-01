import { NextRequest, NextResponse } from "next/server";
import { getDemoUser, verifyPin, signSession, setSessionCookie } from "@/lib/auth";
import { db } from "@/lib/db";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = body.email?.toLowerCase().trim();
  const pin = body.pin;
  if (!email || !email.includes("@")) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  if (!pin) return NextResponse.json({ error: "Enter your PIN." }, { status: 400 });
  const user = await getDemoUser(email);
  if (!user) return NextResponse.json({ error: "No account found with that email." }, { status: 404 });
  const pinOk = await verifyPin(pin, user.pinHash);
  if (!pinOk) return NextResponse.json({ error: "Incorrect PIN." }, { status: 401 });
  const dbUser = await db.user.findUnique({ where: { email } });
  if (dbUser && !dbUser.emailVerifiedAt) return NextResponse.json({ error: "Please verify your email first. Check your inbox for a verification code.", requiresVerification: true, email }, { status: 403 });
  const token = await signSession({ sub: user.id, email: user.email, name: user.name, isSubscribed: user.subscribed, isAdmin: user.isAdmin });
  await setSessionCookie(token);
  return NextResponse.json({ ok: true, user: { email: user.email, name: user.name, isSubscribed: user.subscribed, isAdmin: user.isAdmin } });
}

import { NextRequest, NextResponse } from "next/server";
import { verifyEmailCode, getDemoUser, signSession, setSessionCookie, generateVerificationCode, setVerificationCode } from "@/lib/auth";
import { sendVerificationCode } from "@/lib/email";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = body.email?.toLowerCase().trim();
  const code = body.code?.trim();

  if (!email || !email.includes("@")) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) return NextResponse.json({ error: "Enter the 6-digit verification code." }, { status: 400 });

  const result = await verifyEmailCode(email, code);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  const user = await getDemoUser(email);
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 500 });

  const token = await signSession({ sub: user.id, email: user.email, name: user.name, isSubscribed: user.subscribed, isAdmin: user.isAdmin });
  await setSessionCookie(token);
  return NextResponse.json({ ok: true, user: { email: user.email, name: user.name, isSubscribed: user.subscribed, isAdmin: user.isAdmin } });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const email = body.email?.toLowerCase().trim();

  if (!email || !email.includes("@")) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });

  const code = generateVerificationCode();
  await setVerificationCode(email, code);
  try {
    await sendVerificationCode(email, code);
  } catch {
    return NextResponse.json({ error: "Failed to send verification email. Try again later." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { createDemoUser, generateVerificationCode, setVerificationCode, isWhopConfigured } from "@/lib/auth";
import { sendVerificationCode } from "@/lib/email";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (isWhopConfigured()) return NextResponse.json({ error: "Sign-up is handled via Whop." }, { status: 400 });
  const body = await req.json();
  const email = body.email?.toLowerCase().trim();
  const name = body.name?.trim();
  const birthdate = body.birthdate;
  const pin = body.pin;
  if (!email || !email.includes("@")) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  if (!name) return NextResponse.json({ error: "Enter your name." }, { status: 400 });
  if (!birthdate) return NextResponse.json({ error: "Enter your birth date." }, { status: 400 });
  if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) return NextResponse.json({ error: "PIN must be exactly 4 digits." }, { status: 400 });
  const result = await createDemoUser({ email, name, birthdate, pin });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 409 });
  const code = generateVerificationCode();
  await setVerificationCode(email, code);
  try {
    await sendVerificationCode(email, code);
  } catch {
    return NextResponse.json({ error: "Failed to send verification email. Check your email address or try again later." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, requiresVerification: true, email });
}

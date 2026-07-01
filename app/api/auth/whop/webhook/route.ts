import { NextRequest, NextResponse } from "next/server";
import { Webhook, WebhookVerificationError } from "svix";
import { setDemoUserSubscribed } from "@/lib/auth";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.WHOP_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });

  const body = await req.text();
  const headers = Object.fromEntries(req.headers);

  let payload: { type: string; data: any };
  try {
    const wh = new Webhook(secret);
    payload = wh.verify(body, headers) as any;
  } catch (e) {
    if (e instanceof WebhookVerificationError) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }

  const email = payload?.data?.user?.email?.toLowerCase().trim();
  if (!email) return NextResponse.json({ error: "No email in payload" }, { status: 200 });

  if (payload.type === "membership.activated") {
    await setDemoUserSubscribed(email, true);
  } else if (payload.type === "membership.deactivated") {
    await setDemoUserSubscribed(email, false);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession, setDemoUserSubscribed, setSessionCookie, signSession, isWhopCheckoutConfigured, getWhopPlanId } from "@/lib/auth";
import { buildCheckoutUrl } from "@/lib/whop";
export const runtime = "nodejs";

export async function GET() {
  if (isWhopCheckoutConfigured() && getWhopPlanId()) return NextResponse.redirect(buildCheckoutUrl("/?subscribed=1"));
  return NextResponse.json({ ok: true, demo: true });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  if (isWhopCheckoutConfigured() && getWhopPlanId()) {
    const body = await req.json().catch(() => ({}));
    const plan = body.plan === "yearly" ? process.env.WHOP_YEARLY_PLAN_ID : process.env.WHOP_PLAN_ID;
    const checkoutUrl = buildCheckoutUrl("/api/auth/whop/verify", plan);
    const url = new URL(checkoutUrl);
    url.searchParams.set("email", session.email);
    return NextResponse.json({ ok: true, checkoutUrl: url.toString() });
  }
  await setDemoUserSubscribed(session.email, true);
  const newToken = await signSession({ sub: session.sub, email: session.email, name: session.name, isSubscribed: true, isAdmin: (session as any).isAdmin || false });
  await setSessionCookie(newToken);
  return NextResponse.json({ ok: true, demo: true, activated: true });
}

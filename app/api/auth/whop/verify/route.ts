import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession, setDemoUserSubscribed, setSessionCookie, signSession, isWhopApiConfigured, isWhopCheckoutConfigured } from "@/lib/auth";
import { verifyMembershipByEmail } from "@/lib/whop";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.redirect(new URL("/?auth_required=1", req.url));
  if (session.isSubscribed) return NextResponse.redirect(new URL("/?pro=1", req.url));
  if (isWhopApiConfigured()) {
    try {
      const result = await verifyMembershipByEmail(session.email);
      if (result === true || result === "permission_denied") {
        await activateSubscription(session.sub, session.email, session.name);
        return NextResponse.redirect(new URL("/?pro=1", req.url));
      }
      return NextResponse.redirect(new URL("/", req.url));
    } catch { return NextResponse.redirect(new URL("/", req.url)); }
  }
  if (isWhopCheckoutConfigured()) {
    await activateSubscription(session.sub, session.email, session.name);
    return NextResponse.redirect(new URL("/?pro=1", req.url));
  }
  return NextResponse.redirect(new URL("/", req.url));
}

async function activateSubscription(sub: string, email: string, name: string): Promise<void> {
  await setDemoUserSubscribed(email, true);
  const newToken = await signSession({ sub, email, name, isSubscribed: true, isAdmin: false });
  await setSessionCookie(newToken);
}

import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession, isWhopConfigured } from "@/lib/auth";
import { getUsageSnapshot } from "@/lib/rate-limit";
import { db } from "@/lib/db";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getCurrentSession();
  const usage = await getUsageSnapshot(req);
  let birthdate: string | null = null;
  let isAdmin = false;
  let isSubscribed = false;
  let emailVerified = true;
  if (session?.sub) {
    const user = await db.user.findUnique({ where: { id: session.sub }, select: { birthdate: true, isAdmin: true, isSubscribed: true, emailVerifiedAt: true } });
    birthdate = user?.birthdate ?? null;
    isAdmin = user?.isAdmin ?? false;
    isSubscribed = user?.isSubscribed ?? false;
    emailVerified = user?.emailVerifiedAt !== null;
  }
  const isUnlimited = isSubscribed || isAdmin;
  return NextResponse.json({
    ok: true,
    user: session
      ? { isSignedIn: true, isSubscribed: isUnlimited, isAdmin, email: session.email, name: session.name, birthdate, emailVerified, authMode: isWhopConfigured() ? "whop" : "demo" }
      : { isSignedIn: false, isSubscribed: false, isAdmin: false, email: null, name: null, birthdate: null, authMode: isWhopConfigured() ? "whop" : "demo" },
    usage: isUnlimited
      ? { oracle: { used: 0, limit: 999999, remaining: 999999 }, analyzer: { used: 0, limit: 999999, remaining: 999999 } }
      : usage,
    limits: { oracle: parseInt(process.env.FREE_ORACLE_CREDITS || "3", 10), analyzer: parseInt(process.env.FREE_ANALYZER_CREDITS || "0", 10) },
  });
}

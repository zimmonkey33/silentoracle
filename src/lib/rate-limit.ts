import { db } from "@/lib/db";
import { getCurrentSession } from "./auth";

export type RateLimitType = "oracle" | "analyzer";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  used: number;
  reason?: "free_limit_reached" | "sign_in_required" | "analyzer_pro_only";
}

export interface UsageInfo { used: number; limit: number; remaining: number; }

function getCreditLimit(type: RateLimitType): number {
  if (type === "oracle") return parseInt(process.env.FREE_ORACLE_CREDITS || "3", 10);
  return parseInt(process.env.FREE_ANALYZER_CREDITS || "0", 10);
}

async function getUserOracleUsageCount(userId: string): Promise<number> {
  return db.oracleUsage.count({ where: { userId } });
}

export async function checkRateLimit(req: Request, type: RateLimitType): Promise<RateLimitResult> {
  const session = await getCurrentSession();
  // Admin and Pro users bypass all limits
  if (session?.isSubscribed || (session as any)?.isAdmin) return { allowed: true, remaining: 999999, limit: 999999, used: 0 };
  if (type === "analyzer") return { allowed: false, remaining: 0, limit: 0, used: 0, reason: "analyzer_pro_only" };
  if (!session) return { allowed: false, remaining: 0, limit: getCreditLimit("oracle"), used: 0, reason: "sign_in_required" };
  const used = await getUserOracleUsageCount(session.sub);
  const limit = getCreditLimit("oracle");
  return { allowed: used < limit, remaining: Math.max(0, limit - used), limit, used, reason: used >= limit ? "free_limit_reached" : undefined };
}

export async function incrementUsage(req: Request, type: RateLimitType, question?: string): Promise<void> {
  const session = await getCurrentSession();
  if (!session?.sub || session.isSubscribed || (session as any)?.isAdmin) return;
  if (type === "oracle") {
    await db.oracleUsage.create({ data: { userId: session.sub, question: (question ?? "").slice(0, 500) } });
  }
}

export async function getUsageSnapshot(req: Request): Promise<{ oracle: UsageInfo; analyzer: UsageInfo }> {
  const session = await getCurrentSession();
  if (session?.isSubscribed || (session as any)?.isAdmin) return { oracle: { used: 0, limit: 999999, remaining: 999999 }, analyzer: { used: 0, limit: 999999, remaining: 999999 } };
  if (session?.sub) {
    const oracleUsed = await getUserOracleUsageCount(session.sub);
    const oracleLimit = getCreditLimit("oracle");
    return { oracle: { used: oracleUsed, limit: oracleLimit, remaining: Math.max(0, oracleLimit - oracleUsed) }, analyzer: { used: 0, limit: getCreditLimit("analyzer"), remaining: 0 } };
  }
  return { oracle: { used: 0, limit: getCreditLimit("oracle"), remaining: getCreditLimit("oracle") }, analyzer: { used: 0, limit: getCreditLimit("analyzer"), remaining: 0 } };
}

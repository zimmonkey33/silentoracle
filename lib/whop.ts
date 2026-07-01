import { getAppUrl } from "./auth";

const WHOP_OAUTH_AUTHORIZE = "https://whop.com/oauth/authorize";
const WHOP_OAUTH_TOKEN = "https://api.whop.com/api/v2/oauth/token";
const WHOP_API_BASE = "https://api.whop.com/api/v2";
const WHOP_CHECKOUT_BASE = "https://whop.com/checkout";

export function buildAuthorizeUrl(state: string): string {
  const clientId = process.env.WHOP_CLIENT_ID!;
  const redirectUri = `${getAppUrl()}/api/auth/whop/callback`;
  const params = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: "code", state, scope: "identity:read" });
  return `${WHOP_OAUTH_AUTHORIZE}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string) {
  const res = await fetch(WHOP_OAUTH_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: process.env.WHOP_CLIENT_ID!, client_secret: process.env.WHOP_CLIENT_SECRET!, grant_type: "authorization_code", code, redirect_uri: `${getAppUrl()}/api/auth/whop/callback` }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getWhopUser(accessToken: string) {
  const res = await fetch(`${WHOP_API_BASE}/users/me`, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.data ?? data;
}

export async function getWhopMemberships(accessToken: string) {
  const res = await fetch(`${WHOP_API_BASE}/me/memberships?status=active`, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.data ?? [];
}

export async function isUserSubscribed(accessToken: string): Promise<boolean> {
  const memberships = await getWhopMemberships(accessToken);
  const planId = process.env.WHOP_PLAN_ID;
  if (planId) return memberships.some((m: any) => m.status === "active" && m.plan_id === planId);
  return memberships.some((m: any) => m.status === "active");
}

export function buildCheckoutUrl(returnPath: string = "/", planId?: string): string {
  const productId = process.env.WHOP_PRODUCT_ID;
  const pid = productId || planId || process.env.WHOP_PLAN_ID!;
  const redirect = `${getAppUrl()}${returnPath}`;
  const params = new URLSearchParams({ redirect });
  return `${WHOP_CHECKOUT_BASE}/${pid}?${params.toString()}`;
}

export async function verifyMembershipByEmail(email: string): Promise<boolean | "permission_denied"> {
  const apiKey = process.env.WHOP_API_KEY!;
  const planIds = [process.env.WHOP_PLAN_ID, process.env.WHOP_YEARLY_PLAN_ID].filter(Boolean);
  if (planIds.length === 0) return false;
  try {
    for (const planId of planIds) {
      let page = 1;
      while (page <= 5) {
        const params = new URLSearchParams({ status: "active", plan_id: planId!, page: String(page), per_page: "50" });
        const res = await fetch(`${WHOP_API_BASE}/memberships?${params}`, { headers: { Authorization: `Bearer ${apiKey}` } });
        if (res.status === 401) return "permission_denied";
        if (!res.ok) break;
        const data = await res.json();
        const memberships = data?.data ?? [];
        if (memberships.length === 0) break;
        for (const m of memberships) {
          if (m?.user?.email?.toLowerCase().trim() === email.toLowerCase().trim()) return true;
        }
        if (!data?.has_more || page >= (data?.total_pages ?? 1)) break;
        page++;
      }
    }
    return false;
  } catch { return false; }
}

import { getAppUrl } from "./auth";

const WHOP_OAUTH_AUTHORIZE = "https://api.whop.com/oauth/authorize";
const WHOP_OAUTH_TOKEN = "https://api.whop.com/oauth/token";
const WHOP_OAUTH_USERINFO = "https://api.whop.com/oauth/userinfo";
const WHOP_API_BASE = "https://api.whop.com/api/v2";
const WHOP_CHECKOUT_BASE = "https://whop.com/checkout";

function base64url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url");
}

export function generateCodeVerifier(): string {
  return base64url(crypto.getRandomValues(new Uint8Array(32)));
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(verifier));
  return base64url(new Uint8Array(digest));
}

export function buildAuthorizeUrl(state: string, codeChallenge: string): string {
  const clientId = process.env.WHOP_CLIENT_ID!;
  const redirectUri = `${getAppUrl()}/api/auth/whop/callback`;
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "openid profile email",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  return `${WHOP_OAUTH_AUTHORIZE}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string, codeVerifier: string) {
  const redirectUri = `${getAppUrl()}/api/auth/whop/callback`;
  const res = await fetch(WHOP_OAUTH_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: process.env.WHOP_CLIENT_ID!,
      code_verifier: codeVerifier,
    }),
  });
  if (!res.ok) return null;
  return res.json();
}

export interface WhopUserInfo {
  sub: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  email_verified?: boolean;
}

export async function getWhopUser(accessToken: string): Promise<WhopUserInfo | null> {
  const res = await fetch(WHOP_OAUTH_USERINFO, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getWhopMemberships(accessToken: string) {
  const res = await fetch(`${WHOP_API_BASE}/me/memberships?status=active`, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.data ?? [];
}

export async function isUserSubscribed(accessToken: string): Promise<boolean> {
  const memberships = await getWhopMemberships(accessToken);
  const planIds = [process.env.WHOP_PLAN_ID, process.env.WHOP_YEARLY_PLAN_ID].filter(Boolean);
  if (planIds.length > 0) return memberships.some((m: any) => m.status === "active" && planIds.includes(m.plan_id));
  return memberships.some((m: any) => m.status === "active");
}

export function buildCheckoutUrl(returnPath: string = "/", planId?: string): string {
  const pid = planId || process.env.WHOP_PLAN_ID!;
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

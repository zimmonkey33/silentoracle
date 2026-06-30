import { cookies } from "next/headers";
import * as nodeCrypto from "node:crypto";
import { db } from "@/lib/db";

const SESSION_COOKIE = "so_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const AUTH_SECRET = process.env.AUTH_SECRET || "dev-only-secret-change-me";

export function isWhopConfigured(): boolean { return Boolean(process.env.WHOP_CLIENT_ID && process.env.WHOP_CLIENT_SECRET); }
export function isWhopCheckoutConfigured(): boolean { return Boolean(process.env.WHOP_PLAN_ID); }
export function isWhopApiConfigured(): boolean { return Boolean(process.env.WHOP_API_KEY); }
export function getWhopPlanId(): string | undefined { return process.env.WHOP_PLAN_ID || undefined; }
export function getAppUrl(): string { return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"; }

function b64url(input: Uint8Array | string): string { const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input; return Buffer.from(bytes).toString("base64url"); }
function b64urlDecode(input: string): string { return Buffer.from(input, "base64url").toString("utf8"); }
async function hmacSign(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return b64url(new Uint8Array(sig));
}
async function hmacVerify(data: string, signature: string, secret: string): Promise<boolean> {
  const expected = await hmacSign(data, secret);
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

export interface SessionPayload { sub: string; email: string; name: string; isSubscribed: boolean; isAdmin: boolean; iat: number; exp: number; }

export async function signSession(payload: Omit<SessionPayload, "iat" | "exp">): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const full: SessionPayload = { ...payload, iat: now, exp: now + SESSION_TTL_SECONDS };
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(full));
  const sig = await hmacSign(`${header}.${body}`, AUTH_SECRET);
  return `${header}.${body}.${sig}`;
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const [header, body, sig] = token.split(".");
    if (!header || !body || !sig) return null;
    if (!await hmacVerify(`${header}.${body}`, sig, AUTH_SECRET)) return null;
    const payload = JSON.parse(b64urlDecode(body)) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch { return null; }
}

export async function setSessionCookie(token: string): Promise<void> { const store = await cookies(); store.set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_TTL_SECONDS }); }
export async function clearSessionCookie(): Promise<void> { const store = await cookies(); store.delete(SESSION_COOKIE); }
export async function getSessionToken(): Promise<string | undefined> { const store = await cookies(); return store.get(SESSION_COOKIE)?.value; }
export async function getCurrentSession(): Promise<SessionPayload | null> { const token = await getSessionToken(); if (!token) return null; return verifySession(token); }

export async function hashPin(pin: string): Promise<string> { return nodeCrypto.createHmac("sha256", AUTH_SECRET).update(pin).digest("hex"); }
export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  const computed = nodeCrypto.createHmac("sha256", AUTH_SECRET).update(pin).digest("hex");
  if (computed.length !== hash.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.length; i++) diff |= computed.charCodeAt(i) ^ hash.charCodeAt(i);
  return diff === 0;
}

export async function createDemoUser(input: { email: string; name: string; birthdate: string; pin: string }): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = input.email.toLowerCase().trim();
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { ok: false, error: "An account with this email already exists. Sign in instead." };
  const pinHash = nodeCrypto.createHmac("sha256", AUTH_SECRET).update(input.pin).digest("hex");
  await db.user.create({ data: { email, name: input.name.trim(), birthdate: input.birthdate, pinHash, isSubscribed: false, isAdmin: false } });
  return { ok: true };
}

export async function getDemoUser(email: string): Promise<{ id: string; email: string; name: string; birthdate: string | null; pinHash: string; subscribed: boolean; isAdmin: boolean; subscribedAt: Date | null } | null> {
  const u = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!u) return null;
  return { id: u.id, email: u.email, name: u.name ?? "", birthdate: u.birthdate, pinHash: u.pinHash, subscribed: u.isSubscribed, isAdmin: u.isAdmin, subscribedAt: u.subscribedAt };
}

export async function setDemoUserSubscribed(email: string, subscribed: boolean): Promise<void> {
  await db.user.update({ where: { email: email.toLowerCase().trim() }, data: { isSubscribed: subscribed, subscribedAt: subscribed ? new Date() : null } });
}

export function generateVerificationCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function setVerificationCode(email: string, code: string): Promise<void> {
  await db.user.update({
    where: { email: email.toLowerCase().trim() },
    data: { verificationCode: code, verificationCodeExpiry: new Date(Date.now() + 15 * 60 * 1000) },
  });
}

export async function verifyEmailCode(email: string, code: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) return { ok: false, error: "No account found." };
  if (user.emailVerifiedAt) return { ok: false, error: "Email already verified." };
  if (!user.verificationCode || !user.verificationCodeExpiry) return { ok: false, error: "No verification code pending. Request a new one." };
  if (new Date() > user.verificationCodeExpiry) return { ok: false, error: "Verification code expired. Request a new one." };
  if (user.verificationCode !== code) return { ok: false, error: "Incorrect verification code." };
  await db.user.update({
    where: { id: user.id },
    data: { emailVerifiedAt: new Date(), verificationCode: null, verificationCodeExpiry: null },
  });
  return { ok: true };
}

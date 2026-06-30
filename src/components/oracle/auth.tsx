"use client";
import { useEffect, useState, useCallback, createContext, useContext } from "react";

export interface AuthUser { isSignedIn: boolean; isSubscribed: boolean; isAdmin: boolean; email: string | null; name: string | null; birthdate: string | null; emailVerified: boolean; authMode: "whop" | "demo"; }
export interface UsageInfo { used: number; limit: number; remaining: number; }
export interface AuthState { user: AuthUser; usage: { oracle: UsageInfo; analyzer: UsageInfo }; limits: { oracle: number; analyzer: number }; }

const DEFAULT_STATE: AuthState = {
  user: { isSignedIn: false, isSubscribed: false, isAdmin: false, email: null, name: null, birthdate: null, emailVerified: true, authMode: "demo" },
  usage: { oracle: { used: 0, limit: 3, remaining: 3 }, analyzer: { used: 0, limit: 0, remaining: 0 } },
  limits: { oracle: 3, analyzer: 0 },
};

const AuthContext = createContext<{ state: AuthState; refresh: () => Promise<void>; loading: boolean; showAuthView: boolean; setShowAuthView: (v: boolean) => void; }>({ state: DEFAULT_STATE, refresh: async () => {}, loading: true, showAuthView: false, setShowAuthView: () => {} });
export function useAuth() { return useContext(AuthContext); }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const [showAuthView, setShowAuthView] = useState(false);
  const refresh = useCallback(async () => { try { const res = await fetch("/api/auth/me", { cache: "no-store" }); if (!res.ok) return; const data = await res.json(); setState({ user: data.user, usage: data.usage, limits: data.limits }); } catch {} finally { setLoading(false); } }, []);
  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { if (loading) return; if (!state.user.isSignedIn) { try { const dismissed = localStorage.getItem("so_auth_dismissed"); if (!dismissed) setShowAuthView(true); } catch { setShowAuthView(true); } } }, [loading, state.user.isSignedIn]);
  return <AuthContext.Provider value={{ state, refresh, loading, showAuthView, setShowAuthView }}>{children}</AuthContext.Provider>;
}

export async function signOut(): Promise<void> { await fetch("/api/auth/signout", { method: "POST" }); }
export async function demoSignUp(input: { email: string; name: string; birthdate: string; pin: string }): Promise<{ ok: boolean; error?: string }> { const res = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) }); const data = await res.json(); if (!res.ok) return { ok: false, error: data.error }; return { ok: true }; }
export async function demoSignIn(input: { email: string; pin: string }): Promise<{ ok: boolean; error?: string }> { const res = await fetch("/api/auth/signin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) }); const data = await res.json(); if (!res.ok) return { ok: false, error: data.error }; return { ok: true }; }
export async function activatePro(): Promise<{ ok: boolean; checkoutUrl?: string; demo?: boolean; error?: string }> { const res = await fetch("/api/auth/subscribe", { method: "POST" }); const data = await res.json(); if (!res.ok) return { ok: false, error: data.error }; return data; }
export async function demoVerifyCode(email: string, code: string): Promise<{ ok: boolean; error?: string }> { const res = await fetch("/api/auth/verify-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code }) }); const data = await res.json(); if (!res.ok) return { ok: false, error: data.error }; return { ok: true }; }
export async function resendVerificationCode(email: string): Promise<{ ok: boolean; error?: string }> { const res = await fetch("/api/auth/verify-code", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); const data = await res.json(); if (!res.ok) return { ok: false, error: data.error }; return { ok: true }; }

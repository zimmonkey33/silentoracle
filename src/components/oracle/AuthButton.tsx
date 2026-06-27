"use client";
import { useEffect, useRef, useState } from "react";
import { T } from "@/lib/oracle/theme";
import { useAuth, signOut, activatePro } from "./auth";

export function AuthButton() {
  const { state, refresh, loading, setShowAuthView } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { if (!menuOpen) return; function onDoc(e: MouseEvent) { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); } document.addEventListener("mousedown", onDoc); return () => document.removeEventListener("mousedown", onDoc); }, [menuOpen]);

  async function handleSignOut() { await signOut(); await refresh(); setMenuOpen(false); }
  async function handleUpgrade() { setUpgrading(true); try { const r = await activatePro(); if (r.ok && r.checkoutUrl) { window.location.href = r.checkoutUrl; return; } await refresh(); } finally { setUpgrading(false); setMenuOpen(false); } }

  if (loading) return <div style={{ padding: "8px 14px", borderRadius: "6px", border: `1px solid ${T.border}`, background: T.bg3, fontSize: "11px", color: T.textDim }}>…</div>;
  if (!state.user.isSignedIn) return <button onClick={() => setShowAuthView(true)} style={{ padding: "8px 16px", borderRadius: "6px", background: `linear-gradient(135deg, ${T.orange}, ${T.orange}bb)`, border: "none", color: "#000", fontSize: "11px", fontWeight: 900, letterSpacing: "2px", cursor: "pointer", fontFamily: "inherit" }} className="hover:opacity-85">* SIGN IN</button>;

  const { user } = state;
  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button onClick={() => setMenuOpen(v => !v)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px 6px 8px", borderRadius: "6px", background: user.isSubscribed ? `${T.green}22` : `${T.orange}22`, border: `1px solid ${user.isSubscribed ? T.green : T.orange}`, color: user.isSubscribed ? T.green : T.orange, cursor: "pointer", fontFamily: "inherit" }} className="hover:opacity-85">
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: user.isSubscribed ? T.green : T.orange, color: "#000", display: "grid", placeItems: "center", fontSize: "11px", fontWeight: 900 }}>{(user.name || user.email || "?").charAt(0).toUpperCase()}</div>
        <span style={{ fontSize: "11px", fontWeight: "bold", letterSpacing: "1px", maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name || user.email}</span>
        {user.isSubscribed && <span style={{ fontSize: "9px", letterSpacing: "1px", color: T.green, fontWeight: 900 }}>{user.isAdmin ? "ADMIN" : "PRO"}</span>}
      </button>
      {menuOpen && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, minWidth: "240px", background: T.card, border: `1px solid ${T.border}`, borderRadius: "10px", padding: "12px", zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
          <div style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontSize: "12px", color: T.text, fontWeight: "bold" }}>{user.name}</div>
            <div style={{ fontSize: "10px", color: T.textDim, marginTop: 2 }}>{user.email}</div>
            <div style={{ fontSize: "10px", color: user.isSubscribed ? T.green : T.textDim, marginTop: 4 }}>{user.isAdmin ? "✓ Admin — Unlimited" : user.isSubscribed ? "✓ Oracle Pro — Unlimited" : "Free plan"}</div>
          </div>
          {!user.isSubscribed && (
            <>
              <div style={{ marginBottom: 10, fontSize: "11px", color: T.textMid, lineHeight: 1.8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Oracle credits:</span><span style={{ color: state.usage.oracle.remaining > 0 ? T.orange : T.red, fontWeight: "bold" }}>{state.usage.oracle.remaining === 999999 ? "∞" : `${state.usage.oracle.used}/${state.usage.oracle.limit} used`}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Analyzer:</span><span style={{ color: T.red, fontWeight: "bold" }}>PRO ONLY</span></div>
              </div>
              <button onClick={handleUpgrade} disabled={upgrading} style={{ width: "100%", padding: "9px", borderRadius: "6px", background: `linear-gradient(135deg, ${T.orange}, ${T.orange}bb)`, border: "none", color: "#000", fontSize: "11px", fontWeight: 900, letterSpacing: "1px", cursor: "pointer", fontFamily: "inherit", marginBottom: 6 }} className="hover:opacity-85">{upgrading ? "* OPENING..." : "* UPGRADE TO PRO"}</button>
            </>
          )}
          <button onClick={handleSignOut} style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "transparent", border: `1px solid ${T.border}`, color: T.textDim, fontSize: "11px", letterSpacing: "1px", cursor: "pointer", fontFamily: "inherit" }} className="hover:border-orange-500">SIGN OUT</button>
        </div>
      )}
    </div>
  );
}

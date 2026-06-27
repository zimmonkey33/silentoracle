"use client";
import { useEffect, useState } from "react";
import { T } from "@/lib/oracle/theme";
import { OracleButton, OracleOutlineButton } from "./primitives";
import { activatePro, useAuth } from "./auth";

interface PaywallProps { open: boolean; onClose: () => void; feature: "oracle" | "analyzer"; used?: number; limit?: number; resetsAt?: string; }

export function PaywallModal({ open, onClose, feature, used, limit }: PaywallProps) {
  const { state, refresh, setShowAuthView } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (!open) return; function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); } window.addEventListener("keydown", onKey); const prev = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; }; }, [open, onClose]);
  if (!open) return null;
  const featureLabel = feature === "oracle" ? "Oracle queries" : "Analyzer searches";

  async function handleUpgrade() {
    setError(null);
    if (!state.user.isSignedIn) { onClose(); setShowAuthView(true); return; }
    setLoading(true);
    try { const r = await activatePro(); if (!r.ok) { setError(r.error || "Upgrade failed."); return; } if (r.checkoutUrl) { window.location.href = r.checkoutUrl; return; } await refresh(); onClose(); } finally { setLoading(false); }
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.93)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", overflowY: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: T.card, border: `2px solid ${T.orange}`, borderRadius: "16px", padding: "28px 22px", maxWidth: "400px", width: "100%", textAlign: "center", margin: "auto" }}>
        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🔮</div>
        <div style={{ fontSize: "18px", fontWeight: 900, color: T.orange, letterSpacing: "2px", marginBottom: "6px" }}>ORACLE PRO</div>
        <p style={{ fontSize: "12px", color: "#ccc", lineHeight: 1.7, marginBottom: "16px" }}>
          {feature === "analyzer" ? <>The <strong style={{ color: T.orange }}>Analyzer</strong> is a Pro-only feature.<br />Upgrade to unlock unlimited searches.</> : <>You&apos;ve used all <strong style={{ color: T.orange }}>{limit} free {featureLabel}</strong>{used !== undefined && limit !== undefined && <span> ({used}/{limit})</span>}.<br />Upgrade for unlimited access.</>}
        </p>
        <div style={{ background: "#0a0600", border: `1px solid ${T.border}`, borderRadius: "10px", padding: "14px", marginBottom: "18px" }}>
          <div style={{ fontSize: "34px", fontWeight: 900, color: T.orange, fontFamily: "Georgia, serif" }}>$8<span style={{ fontSize: "14px" }}>/month</span></div>
          <div style={{ fontSize: "11px", color: "#888", marginTop: "4px", marginBottom: "10px" }}>Cancel anytime</div>
          <div style={{ fontSize: "11px", color: "#ccc", lineHeight: 1.8, textAlign: "left" }}>→ Unlimited Oracle AI queries<br />→ Unlimited Analyzer searches<br />→ All future features included</div>
        </div>
        <OracleButton onClick={handleUpgrade} disabled={loading} color={loading ? T.orangeDim : T.orange}>{loading ? "* OPENING CHECKOUT..." : "* UPGRADE TO ORACLE PRO"}</OracleButton>
        {error && <div style={{ marginTop: 10, fontSize: "11px", color: T.red }}>{error}</div>}
        <OracleOutlineButton color={T.textDim} onClick={onClose} disabled={loading}>{feature === "analyzer" ? "MAYBE LATER" : "CONTINUE WITH FREE PLAN"}</OracleOutlineButton>
      </div>
    </div>
  );
}

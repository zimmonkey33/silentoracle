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
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");

  async function handleUpgrade() {
    setError(null);
    if (!state.user.isSignedIn) { onClose(); setShowAuthView(true); return; }
    setLoading(true);
    try { const r = await activatePro(selectedPlan); if (!r.ok) { setError(r.error || "Upgrade failed."); return; } if (r.checkoutUrl) { window.location.href = r.checkoutUrl; return; } await refresh(); onClose(); } finally { setLoading(false); }
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.93)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", overflowY: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: T.card, border: `2px solid ${T.orange}`, borderRadius: "16px", padding: "28px 22px", maxWidth: "400px", width: "100%", textAlign: "center", margin: "auto" }}>
        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🔮</div>
        <div style={{ fontSize: "18px", fontWeight: 900, color: T.orange, letterSpacing: "2px", marginBottom: "6px" }}>ORACLE PRO</div>
        <p style={{ fontSize: "12px", color: "#ccc", lineHeight: 1.7, marginBottom: "16px" }}>
          {feature === "analyzer" ? <>The <strong style={{ color: T.orange }}>Analyzer</strong> is a Pro-only feature.<br />Upgrade to unlock unlimited searches.</> : <>You&apos;ve used all <strong style={{ color: T.orange }}>{limit} free {featureLabel}</strong>{used !== undefined && limit !== undefined && <span> ({used}/{limit})</span>}.<br />Upgrade for unlimited access.</>}
        </p>
        <div className="grid grid-cols-2 gap-2" style={{ marginBottom: "18px" }}>
          <div
            onClick={() => setSelectedPlan("monthly")}
            style={{
              background: selectedPlan === "monthly" ? `${T.orange}22` : "#0a0600",
              border: `2px solid ${selectedPlan === "monthly" ? T.orange : T.border}`,
              borderRadius: "10px", padding: "14px 10px", cursor: "pointer", textAlign: "center",
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 900, color: selectedPlan === "monthly" ? T.orange : T.textMid, fontFamily: "Georgia, serif" }}>$8<span style={{ fontSize: "12px" }}>/mo</span></div>
            <div style={{ fontSize: "10px", color: T.textDim, marginTop: "4px" }}>Cancel anytime<br />Billed monthly</div>
          </div>
          <div
            onClick={() => setSelectedPlan("yearly")}
            style={{
              background: selectedPlan === "yearly" ? `${T.orange}22` : "#0a0600",
              border: `2px solid ${selectedPlan === "yearly" ? T.orange : T.border}`,
              borderRadius: "10px", padding: "14px 10px", cursor: "pointer", textAlign: "center", position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", background: T.orange, color: "#000", fontSize: "9px", fontWeight: "bold", padding: "2px 8px", borderRadius: "8px", letterSpacing: "1px" }}>BEST VALUE</div>
            <div style={{ fontSize: "28px", fontWeight: 900, color: selectedPlan === "yearly" ? T.orange : T.textMid, fontFamily: "Georgia, serif" }}>$71<span style={{ fontSize: "12px" }}>/yr</span></div>
            <div style={{ fontSize: "10px", color: "#888", marginTop: "4px" }}>$5.92/mo · Save 26%<br />Cancel anytime</div>
          </div>
        </div>
        <div style={{ fontSize: "11px", color: "#ccc", lineHeight: 1.8, textAlign: "left", marginBottom: "18px", padding: "0 4px" }}>→ Unlimited Oracle AI queries<br />→ Unlimited Analyzer searches<br />→ All future features included</div>
        <OracleButton onClick={handleUpgrade} disabled={loading} color={loading ? T.orangeDim : T.orange}>{loading ? "* OPENING CHECKOUT..." : `* GO PRO — $${selectedPlan === "yearly" ? "71" : "8"}`}</OracleButton>
        {error && <div style={{ marginTop: 10, fontSize: "11px", color: T.red }}>{error}</div>}
        <OracleOutlineButton color={T.textDim} onClick={onClose} disabled={loading}>{feature === "analyzer" ? "MAYBE LATER" : "CONTINUE WITH FREE PLAN"}</OracleOutlineButton>
      </div>
    </div>
  );
}

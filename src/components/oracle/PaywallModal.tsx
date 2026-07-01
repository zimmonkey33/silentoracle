"use client";
import { useEffect, useState } from "react";
import { T } from "@/lib/oracle/theme";
import { OracleButton, OracleOutlineButton } from "./primitives";
import { useAuth } from "./auth";

interface PaywallProps { open: boolean; onClose: () => void; feature: "oracle" | "analyzer"; used?: number; limit?: number; resetsAt?: string; }

const CHECKOUT_BASE = "https://whop.com/checkout";

export function PaywallModal({ open, onClose, feature, used, limit }: PaywallProps) {
  const { state, setShowAuthView } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (!open) return; function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); } window.addEventListener("keydown", onKey); const prev = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; }; }, [open, onClose]);
  if (!open) return null;
  const featureLabel = feature === "oracle" ? "Oracle queries" : "Analyzer searches";

  function handleUpgrade(plan: "monthly" | "yearly") {
    if (!state.user.isSignedIn) { onClose(); setShowAuthView(true); return; }
    const planId = plan === "yearly" ? "plan_AWBGeplyAlwQy" : "plan_m0wDrbw83zXDL";
    const redirect = encodeURIComponent(`${window.location.origin}/api/auth/whop/verify?email=${encodeURIComponent(state.user.email || "")}`);
    window.location.href = `${CHECKOUT_BASE}/${planId}?redirect=${redirect}`;
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
            onClick={() => handleUpgrade("monthly")}
            style={{
              background: `${T.orange}11`,
              border: `2px solid ${T.border}`,
              borderRadius: "10px", padding: "18px 10px", cursor: "pointer", textAlign: "center",
            }}
            className="hover:border-orange-500"
          >
            <div style={{ fontSize: "28px", fontWeight: 900, color: T.orange, fontFamily: "Georgia, serif" }}>$8<span style={{ fontSize: "12px" }}>/mo</span></div>
            <div style={{ fontSize: "10px", color: T.textDim, marginTop: "4px" }}>Cancel anytime · Billed monthly</div>
          </div>
          <div
            onClick={() => handleUpgrade("yearly")}
            style={{
              background: `${T.orange}22`,
              border: `2px solid ${T.orange}`,
              borderRadius: "10px", padding: "18px 10px", cursor: "pointer", textAlign: "center", position: "relative",
            }}
            className="hover:border-orange-500"
          >
            <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", background: T.orange, color: "#000", fontSize: "9px", fontWeight: "bold", padding: "2px 8px", borderRadius: "8px", letterSpacing: "1px" }}>BEST VALUE</div>
            <div style={{ fontSize: "28px", fontWeight: 900, color: T.orange, fontFamily: "Georgia, serif" }}>$71<span style={{ fontSize: "12px" }}>/yr</span></div>
            <div style={{ fontSize: "10px", color: "#888", marginTop: "4px" }}>$5.92/mo · Save 26% · Cancel anytime</div>
          </div>
        </div>
        <div style={{ fontSize: "11px", color: "#ccc", lineHeight: 1.8, textAlign: "left", marginBottom: "18px", padding: "0 4px" }}>→ Unlimited Oracle AI queries<br />→ Unlimited Analyzer searches<br />→ All future features included</div>
        {error && <div style={{ marginTop: 10, fontSize: "11px", color: T.red }}>{error}</div>}
        <OracleOutlineButton color={T.textDim} onClick={onClose}>MAYBE LATER</OracleOutlineButton>
      </div>
    </div>
  );
}

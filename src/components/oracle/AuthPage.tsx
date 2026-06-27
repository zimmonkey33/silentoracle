"use client";
import { useEffect, useState } from "react";
import { T } from "@/lib/oracle/theme";
import { OracleButton, OracleOutlineButton, OracleInput, OracleLabel } from "./primitives";
import { demoSignUp, demoSignIn, useAuth } from "./auth";

type Mode = "welcome" | "signup" | "signin";

export function AuthPage() {
  const { refresh, showAuthView, setShowAuthView } = useAuth();
  const [mode, setMode] = useState<Mode>("welcome");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suName, setSuName] = useState(""); const [suEmail, setSuEmail] = useState(""); const [suBirth, setSuBirth] = useState(""); const [suPin, setSuPin] = useState(""); const [suPin2, setSuPin2] = useState("");
  const [siEmail, setSiEmail] = useState(""); const [siPin, setSiPin] = useState("");

  useEffect(() => { if (!showAuthView) return; const prev = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = prev; }; }, [showAuthView]);
  if (!showAuthView) return null;

  function close() { setShowAuthView(false); setMode("welcome"); setError(null); setLoading(false); }
  function continueAsGuest() { try { localStorage.setItem("so_auth_dismissed", "1"); } catch {} close(); }

  async function handleSignUp() {
    setError(null);
    if (!suName.trim()) return setError("Enter your name.");
    if (!suEmail.includes("@")) return setError("Enter a valid email.");
    if (!suBirth) return setError("Enter your birth date.");
    if (!/^\d{4}$/.test(suPin)) return setError("PIN must be exactly 4 digits.");
    if (suPin !== suPin2) return setError("PINs do not match.");
    setLoading(true);
    const r = await demoSignUp({ email: suEmail, name: suName, birthdate: suBirth, pin: suPin });
    setLoading(false);
    if (!r.ok) return setError(r.error || "Sign-up failed.");
    await refresh(); close();
  }

  async function handleSignIn() {
    setError(null);
    if (!siEmail.includes("@")) return setError("Enter a valid email.");
    if (!siPin) return setError("Enter your PIN.");
    setLoading(true);
    const r = await demoSignIn({ email: siEmail, pin: siPin });
    setLoading(false);
    if (!r.ok) return setError(r.error || "Sign-in failed.");
    await refresh(); close();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: T.bg, color: T.text, zIndex: 9999, overflowY: "auto", fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${T.orange}, ${T.orangeHi})`, display: "grid", placeItems: "center", fontSize: 16 }}>🔮</div>
          <span style={{ fontSize: 14, fontWeight: 900, color: T.orange, letterSpacing: "2px", fontFamily: "Georgia, serif" }}>SILENT ORACLE</span>
        </div>
        <button onClick={close} style={{ background: "transparent", border: `1px solid ${T.border}`, color: T.textDim, fontSize: 11, letterSpacing: "1px", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }} className="hover:border-orange-500">← BACK TO APP</button>
      </div>
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🔮</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: T.orange, letterSpacing: "3px", fontFamily: "Georgia, serif", margin: 0, textShadow: `0 0 50px ${T.orange}44` }}>SILENT ORACLE</h1>
          <p style={{ fontSize: 11, color: T.textDim, letterSpacing: "3px", marginTop: 8 }}>NUMEROLOGY · ASTROLOGY · ENERGY INTELLIGENCE</p>
        </div>

        {mode === "welcome" && (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 32 }}>
            <p style={{ fontSize: 14, color: T.textMid, textAlign: "center", marginBottom: 24, lineHeight: 1.7 }}>Sign up to sync your numerology profile across devices and unlock <strong style={{ color: T.orange }}>Oracle Pro</strong> for unlimited access.</p>
            <div style={{ background: "#0a0600", border: `1px solid ${T.border}`, borderRadius: 8, padding: "14px 16px", marginBottom: 20, fontSize: 12, color: T.textMid, lineHeight: 1.8 }}>
              <div style={{ color: T.orange, fontWeight: "bold", marginBottom: 6, letterSpacing: "1px" }}>FREE TIER</div>
              <div>→ 3 Oracle AI queries (lifetime)</div>
              <div>→ Full numerology profile + daily energy</div>
              <div>→ Entity database (1,000+ entries)</div>
              <div style={{ color: T.green, fontWeight: "bold", marginTop: 8, letterSpacing: "1px" }}>ORACLE PRO — $8/month</div>
              <div>→ Unlimited Oracle AI queries</div>
              <div>→ Unlimited Analyzer searches</div>
            </div>
            <OracleButton onClick={() => setMode("signup")} disabled={loading}>* CREATE ACCOUNT</OracleButton>
            <OracleOutlineButton color={T.orange} onClick={() => setMode("signin")} disabled={loading}>SIGN IN</OracleOutlineButton>
            <button onClick={continueAsGuest} style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: T.textDim, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Continue as guest (explore tools — no Oracle AI)</button>
          </div>
        )}

        {mode === "signup" && (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: T.orange, letterSpacing: "2px", textAlign: "center", margin: "0 0 24px" }}>CREATE ACCOUNT</h2>
            <OracleLabel>FULL NAME</OracleLabel>
            <OracleInput value={suName} onChange={(e) => setSuName(e.target.value)} style={{ marginBottom: 14 }} placeholder="Your full name" />
            <OracleLabel>EMAIL</OracleLabel>
            <OracleInput type="email" value={suEmail} onChange={(e) => setSuEmail(e.target.value)} style={{ marginBottom: 14 }} placeholder="you@example.com" />
            <OracleLabel>BIRTH DATE</OracleLabel>
            <OracleInput type="date" value={suBirth} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setSuBirth(e.target.value)} style={{ marginBottom: 14 }} />
            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 6 }}>
              <div><OracleLabel>4-DIGIT PIN</OracleLabel><OracleInput type="password" inputMode="numeric" maxLength={4} value={suPin} onChange={(e) => setSuPin(e.target.value.replace(/\D/g, ""))} placeholder="••••" /></div>
              <div><OracleLabel>CONFIRM PIN</OracleLabel><OracleInput type="password" inputMode="numeric" maxLength={4} value={suPin2} onChange={(e) => setSuPin2(e.target.value.replace(/\D/g, ""))} placeholder="••••" /></div>
            </div>
            <OracleButton onClick={handleSignUp} disabled={loading}>{loading ? "* CREATING..." : "* CREATE MY ACCOUNT"}</OracleButton>
            <button onClick={() => { setMode("welcome"); setError(null); }} style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: T.textDim, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
          </div>
        )}

        {mode === "signin" && (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: T.orange, letterSpacing: "2px", textAlign: "center", margin: "0 0 24px" }}>SIGN IN</h2>
            <OracleLabel>EMAIL</OracleLabel>
            <OracleInput type="email" value={siEmail} onChange={(e) => setSiEmail(e.target.value)} style={{ marginBottom: 14 }} placeholder="you@example.com" />
            <OracleLabel>4-DIGIT PIN</OracleLabel>
            <OracleInput type="password" inputMode="numeric" maxLength={4} value={siPin} onChange={(e) => setSiPin(e.target.value.replace(/\D/g, ""))} placeholder="••••" />
            <OracleButton onClick={handleSignIn} disabled={loading}>{loading ? "* SIGNING IN..." : "* SIGN IN"}</OracleButton>
            <button onClick={() => { setMode("welcome"); setError(null); }} style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: T.textDim, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
          </div>
        )}

        {error && <div style={{ marginTop: 16, padding: "12px 16px", background: `${T.red}11`, border: `1px solid ${T.red}55`, borderRadius: 8, fontSize: 12, color: T.red, textAlign: "center" }}>{error}</div>}
        <p style={{ fontSize: 10, color: T.textDim, textAlign: "center", marginTop: 32, lineHeight: 1.6, letterSpacing: "1px" }}>By signing up you agree to our <a href="/privacy" style={{ color: T.orange, textDecoration: "underline" }}>Privacy Policy</a> and <a href="/terms" style={{ color: T.orange, textDecoration: "underline" }}>Terms of Service</a>.<br />For reflection and entertainment purposes only.</p>
      </div>
    </div>
  );
}

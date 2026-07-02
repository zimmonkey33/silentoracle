"use client";

import { useState } from "react";
import { T } from "@/lib/oracle/theme";
import { getPersonalMonthInfo, calcDayLP, calcSecondaryEnergy } from "@/lib/oracle/calc";
import { OracleCard, OracleLabel, OracleTextarea, OracleButton, OracleHr } from "./primitives";
import { useAuth } from "./auth";
import { PaywallModal } from "./PaywallModal";
import type { OracleProfile } from "./MyReadingTab";

const QUICK_QUESTIONS = [
  "Is 2026 a good year for me to launch my business?",
  "How do I choose the best founding date for my company?",
  "What does my Life Path say about building generational wealth?",
  "Should I trust a business partner born in the Year of the Snake?",
  "How do I navigate an enemy year without losing ground?",
  "What's the best LP number for a business partner?",
  "Is a company with the same LP as me naturally aligned?",
  "When is my next enemy year and what should I do about it?",
];

export function OracleChatTab({ profile }: { profile: OracleProfile | null }) {
  const { state, refresh, setShowAuthView } = useAuth();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const { user, usage } = state;
  const oracleUsage = usage.oracle;
  const isSubscribed = user.isSubscribed;
  const isSignedIn = user.isSignedIn;
  const remaining = oracleUsage.remaining;

  async function askOracle() {
    if (!question.trim() || loading) return;
    setLoading(true);
    setAnswer("");
    setError(null);
    const pmInfo = profile ? getPersonalMonthInfo(profile.pm) : undefined;
    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          profile: profile ? {
            birthDate: `${profile.y}-${String(profile.m).padStart(2, "0")}-${String(profile.d).padStart(2, "0")}`,
            lifePath: profile.lp, lifePathTitle: profile.lpd?.title,
            chineseZodiac: profile.bz?.name, chineseZodiacEnemy: profile.bz?.enemy, chineseZodiacFriends: profile.bz?.friends,
            currentYearZodiac: profile.yz?.name, zodiacRelation: profile.ys?.type,
            personalYear: profile.py, yearStatusLabel: profile.ys?.label, yearStatusType: profile.ys?.type,
            personalMonth: profile.pm, personalMonthLabel: pmInfo?.label,
            luckyNumber: profile.lk.lucky, luckyBreakdown: `M${profile.lk.first} + Y${profile.lk.last}`,
            westernZodiac: profile.wz?.name, westernZodiacElement: profile.wz?.element,
            dailyPrimary: calcDayLP(new Date()), dailySecondary: calcSecondaryEnergy(new Date()),
          } : null,
        }),
      });
      const data = await res.json();
      if (res.status === 401) { setShowAuthView(true); return; }
      if (res.status === 402) { setShowPaywall(true); await refresh(); return; }
      if (!res.ok || !data.ok) throw new Error(data.error || `Request failed (${res.status})`);
      setAnswer(data.answer || "The numbers are unclear. Ask again.");
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <PaywallModal open={showPaywall} feature="oracle" used={oracleUsage.used} limit={oracleUsage.limit} onClose={() => setShowPaywall(false)} />

      {!isSignedIn ? (
        <OracleCard highlight>
          <div style={{ textAlign: "center", padding: "20px 10px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔮</div>
            <OracleLabel>THE SILENT ORACLE</OracleLabel>
            <h3 style={{ fontSize: "20px", fontWeight: 900, color: T.orange, letterSpacing: "1px", margin: "8px 0 12px", fontFamily: "Georgia, serif" }}>Sign up to consult the Oracle</h3>
            <p style={{ fontSize: "13px", color: T.textMid, lineHeight: 1.7, marginBottom: "16px", maxWidth: "380px", margin: "0 auto 16px" }}>
              Create a free account to get <strong style={{ color: T.orange }}>3 Oracle AI queries</strong> — personalized numerology guidance. Credits are lifetime.
            </p>
            <div style={{ background: "#0a0600", border: `1px solid ${T.border}`, borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", fontSize: "11px", color: T.textMid, lineHeight: 1.8, textAlign: "left", maxWidth: "340px", margin: "0 auto 16px" }}>
              <div style={{ color: T.orange, fontWeight: "bold", marginBottom: 4 }}>FREE ACCOUNT INCLUDES:</div>
              <div>→ 3 Oracle AI queries (lifetime)</div>
              <div>→ Full numerology profile</div>
              <div>→ Daily energy + compatibility</div>
              <div>→ 20 sample entities (Pro unlocks all 1,000+)</div>
            </div>
            <OracleButton onClick={() => setShowAuthView(true)} color={T.orange}>* SIGN UP — IT&apos;S FREE</OracleButton>
          </div>
        </OracleCard>
      ) : (
        <>
          <OracleCard highlight>
            <div style={{ textAlign: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "36px" }}>🔮</div>
              <OracleLabel>THE SILENT ORACLE</OracleLabel>
              <p style={{ fontSize: "11px", color: T.textDim }}>
                {profile ? `Reading LP ${profile.lp} · ${profile.bz?.name} · ${profile.ys?.label}` : "Enter your birth date in MY READING for personalized answers."}
              </p>
              {!isSubscribed && (
                <p style={{ fontSize: "10px", color: remaining > 0 ? T.orange : T.red, marginTop: "6px" }}>
                  {remaining > 0 ? `${remaining} free ${remaining === 1 ? "query" : "queries"} left (lifetime)` : "All free queries used — upgrade for unlimited"}
                </p>
              )}
              {isSubscribed && <p style={{ fontSize: "10px", color: T.green, marginTop: "6px" }}>✓ {user.isAdmin ? "Admin" : "Oracle Pro"} — unlimited queries</p>}
            </div>
            <OracleTextarea value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); askOracle(); } }} placeholder="Ask about timing, business, investments, compatibility, enemy years, what year to launch... press Enter to send" style={{ minHeight: "80px", resize: "vertical" }} rows={3} />
            <OracleButton onClick={askOracle} disabled={loading || (!isSubscribed && remaining === 0)} color={loading ? T.orangeDim : T.orange}>
              {loading ? "* READING THE NUMBERS..." : !isSubscribed && remaining === 0 ? "* LIMIT REACHED — UPGRADE FOR MORE" : "* CONSULT THE ORACLE"}
            </OracleButton>
            {!isSubscribed && remaining === 0 && (
              <button onClick={() => setShowPaywall(true)} style={{ display: "block", margin: "8px auto 0", background: "transparent", border: "none", color: T.orange, fontSize: "11px", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>→ Upgrade for unlimited queries</button>
            )}
            {error && <div style={{ marginTop: "10px", padding: "10px 12px", background: `${T.red}11`, border: `1px solid ${T.red}55`, borderRadius: "7px", fontSize: "12px", color: T.red }}>{error}</div>}
          </OracleCard>

          {answer && (
            <OracleCard highlight className="oracle-fade-in">
              <OracleLabel>THE ORACLE SPEAKS</OracleLabel>
              <p style={{ fontSize: "14px", lineHeight: 1.9, color: T.white, whiteSpace: "pre-wrap" }}>{answer}</p>
            </OracleCard>
          )}

          <OracleCard>
            <OracleLabel>QUICK QUESTIONS — TAP TO FILL</OracleLabel>
            {QUICK_QUESTIONS.map((q) => (
              <button key={q} onClick={() => setQuestion(q)} style={{ display: "block", width: "100%", textAlign: "left", background: "#0a0600", border: `1px solid ${T.border}`, borderRadius: "7px", padding: "9px 13px", color: T.textMid, fontSize: "11px", cursor: "pointer", marginBottom: "6px", fontFamily: "inherit", transition: "border-color 0.15s" }} className="hover:border-orange-500">→ {q}</button>
            ))}
          </OracleCard>

          <OracleHr />
          <p style={{ fontSize: "11px", color: T.textDim, textAlign: "center", padding: "6px 0" }}>
            * Free tier: {oracleUsage.limit} lifetime queries · Pro: unlimited · For reflection, not professional advice
          </p>
        </>
      )}
    </div>
  );
}

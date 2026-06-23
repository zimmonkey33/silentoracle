"use client";

import { useEffect, useState } from "react";
import { T } from "@/lib/oracle/theme";
import { getPersonalMonthInfo } from "@/lib/oracle/calc";
import {
  OracleCard,
  OracleLabel,
  OracleTextarea,
  OracleButton,
  OracleHr,
} from "./primitives";
import type { OracleProfile } from "./MyReadingTab";

const MONTHLY_LIMIT = 5;

const QUICK_QUESTIONS = [
  "Is 2026 a good year for me to launch my business?",
  "How do I choose the best founding date for my company?",
  "What does my Life Path say about building generational wealth?",
  "Should I trust a business partner born in the Year of the Snake?",
  "How do I navigate an enemy year without losing ground?",
  "What's the best LP number for a business partner?",
  "Is a company with the same LP as me naturally aligned?",
];

export function OracleChatTab({ profile }: { profile: OracleProfile | null }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [freeQueries, setFreeQueries] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Load subscription state + free query count on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("so_queries") || "{}");
      const thisMonth = new Date().toISOString().slice(0, 7);
      if (stored.month === thisMonth) {
        setFreeQueries(stored.count || 0);
      } else {
        localStorage.setItem("so_queries", JSON.stringify({ month: thisMonth, count: 0 }));
      }
      const sub = localStorage.getItem("so_subscribed");
      if (sub === "1") setIsSubscribed(true);
    } catch {
      /* ignore */
    }
  }, []);

  function trackQuery() {
    const thisMonth = new Date().toISOString().slice(0, 7);
    const newCount = freeQueries + 1;
    setFreeQueries(newCount);
    try {
      localStorage.setItem("so_queries", JSON.stringify({ month: thisMonth, count: newCount }));
    } catch {
      /* ignore */
    }
  }

  function activatePro() {
    setIsSubscribed(true);
    try {
      localStorage.setItem("so_subscribed", "1");
    } catch {
      /* ignore */
    }
    setShowPaywall(false);
  }

  async function askOracle() {
    if (!question.trim() || loading) return;
    if (!isSubscribed && freeQueries >= MONTHLY_LIMIT) {
      setShowPaywall(true);
      return;
    }
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
          profile: profile
            ? {
                birthDate: `${profile.y}-${String(profile.m).padStart(2, "0")}-${String(profile.d).padStart(2, "0")}`,
                lifePath: profile.lp,
                lifePathTitle: profile.lpd?.title,
                chineseZodiac: profile.bz?.name,
                personalYear: profile.py,
                yearStatusLabel: profile.ys?.label,
                personalMonth: profile.pm,
                personalMonthLabel: pmInfo?.label,
                luckyNumber: profile.lk.lucky,
                luckyBreakdown: `M${profile.lk.first} + Y${profile.lk.last}`,
              }
            : null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      setAnswer(data.answer || "The numbers are unclear. Ask again.");
      if (!isSubscribed) trackQuery();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const remainingQueries = Math.max(0, MONTHLY_LIMIT - freeQueries);

  return (
    <div>
      {/* Paywall modal */}
      {showPaywall && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.93)",
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#120c00",
              border: `2px solid ${T.orange}`,
              borderRadius: "16px",
              padding: "28px 22px",
              maxWidth: "380px",
              width: "100%",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "8px" }}>🔮</div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 900,
                color: T.orange,
                letterSpacing: "2px",
                marginBottom: "6px",
              }}
            >
              ORACLE PRO
            </div>
            <p style={{ fontSize: "12px", color: "#ccc", lineHeight: 1.7, marginBottom: "16px" }}>
              You have used your <strong style={{ color: T.orange }}>{MONTHLY_LIMIT} free queries</strong> this month.
              <br />
              Upgrade for unlimited access.
            </p>
            <div
              style={{
                background: "#0a0600",
                border: `1px solid ${T.border}`,
                borderRadius: "10px",
                padding: "14px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  fontSize: "34px",
                  fontWeight: 900,
                  color: T.orange,
                  fontFamily: "Georgia, serif",
                }}
              >
                $8<span style={{ fontSize: "14px" }}>/month</span>
              </div>
              <div style={{ fontSize: "11px", color: "#888", marginTop: "4px", marginBottom: "10px" }}>
                Cancel anytime
              </div>
              <div style={{ fontSize: "11px", color: "#ccc", lineHeight: 1.8, textAlign: "left" }}>
                → Unlimited oracle queries
                <br />
                → Saved entities (25 slots)
                <br />
                → Profile synced across devices
                <br />
                → All future features included
              </div>
            </div>
            <OracleButton onClick={activatePro} color={T.orange}>
              * ACTIVATE PRO (DEMO)
            </OracleButton>
            <p style={{ fontSize: "9px", color: "#555", marginTop: "10px" }}>
              Demo mode: Pro activates instantly in this browser. Payment integration coming soon.
            </p>
            <button
              onClick={() => setShowPaywall(false)}
              style={{
                background: "none",
                border: "none",
                color: "#555",
                fontSize: "11px",
                cursor: "pointer",
                fontFamily: "inherit",
                marginTop: "10px",
              }}
            >
              Continue with free plan ({remainingQueries} queries left this month)
            </button>
          </div>
        </div>
      )}

      {/* Oracle hero */}
      <OracleCard highlight>
        <div style={{ textAlign: "center", marginBottom: "14px" }}>
          <div style={{ fontSize: "36px" }}>🔮</div>
          <OracleLabel>THE SILENT ORACLE</OracleLabel>
          <p style={{ fontSize: "11px", color: T.textDim }}>
            {profile
              ? `Reading LP ${profile.lp} · ${profile.bz?.name} · ${profile.ys?.label}`
              : "Enter your birth date in MY READING for personalized answers."}
          </p>
          {!isSubscribed && (
            <p style={{ fontSize: "10px", color: T.orange, marginTop: "6px" }}>
              {remainingQueries} free {remainingQueries === 1 ? "query" : "queries"} remaining this month
            </p>
          )}
          {isSubscribed && (
            <p style={{ fontSize: "10px", color: T.green, marginTop: "6px" }}>✓ Oracle Pro — unlimited queries</p>
          )}
        </div>
        <OracleTextarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              askOracle();
            }
          }}
          placeholder="Ask about timing, business, investments, compatibility, what year to launch... press Enter to send"
          style={{ minHeight: "80px", resize: "vertical" }}
          rows={3}
        />
        <OracleButton onClick={askOracle} disabled={loading} color={loading ? T.orangeDim : T.orange}>
          {loading ? "* READING THE NUMBERS..." : "* CONSULT THE ORACLE"}
        </OracleButton>
        {error && (
          <div
            style={{
              marginTop: "10px",
              padding: "10px 12px",
              background: `${T.red}11`,
              border: `1px solid ${T.red}55`,
              borderRadius: "7px",
              fontSize: "12px",
              color: T.red,
            }}
          >
            {error}
          </div>
        )}
      </OracleCard>

      {/* Silent reveal */}
      {answer && (
        <OracleCard highlight className="oracle-fade-in">
          <OracleLabel>THE ORACLE SPEAKS</OracleLabel>
          <p style={{ fontSize: "14px", lineHeight: 1.9, color: T.white, whiteSpace: "pre-wrap" }}>{answer}</p>
        </OracleCard>
      )}

      {/* Quick questions */}
      <OracleCard>
        <OracleLabel>QUICK QUESTIONS — TAP TO FILL</OracleLabel>
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => setQuestion(q)}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              background: "#0a0600",
              border: `1px solid ${T.border}`,
              borderRadius: "7px",
              padding: "9px 13px",
              color: T.textMid,
              fontSize: "11px",
              cursor: "pointer",
              marginBottom: "6px",
              fontFamily: "inherit",
              transition: "border-color 0.15s",
            }}
            className="hover:border-orange-500"
          >
            → {q}
          </button>
        ))}
      </OracleCard>

      <OracleHr />
      <p style={{ fontSize: "11px", color: T.textDim, textAlign: "center", padding: "6px 0" }}>
        * Oracle responses are AI-generated guidance based on GG33 numerology · For reflection, not professional advice
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { T } from "@/lib/oracle/theme";
import { calcLP, getZodiac, getWesternZodiac, luckyNums, zodiacRelation } from "@/lib/oracle/calc";
import { LP } from "@/lib/oracle/data";
import { OracleCard, OracleLabel, OracleInput, OracleButton, BigNumber, MiniBox, Trait, OracleHr } from "./primitives";
import { ZodiacEmojiButton } from "./ZodiacModal";

interface CompatibilityResult {
  lp1: number;
  lp2: number;
  z1: ReturnType<typeof getZodiac>;
  z2: ReturnType<typeof getZodiac>;
  wz1: ReturnType<typeof getWesternZodiac>;
  wz2: ReturnType<typeof getWesternZodiac>;
  zr: ReturnType<typeof zodiacRelation>;
  lm: boolean;
  lp1Info: typeof LP[number];
  lp2Info: typeof LP[number];
}

export function CompatibilityTab() {
  const [b1, setB1] = useState("");
  const [b2, setB2] = useState("");
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  function analyze() {
    if (!b1 || !b2) return;
    const [y1, m1, d1] = b1.split("-").map(Number);
    const [y2, m2, d2] = b2.split("-").map(Number);
    const lp1 = calcLP(m1, d1, y1);
    const lp2 = calcLP(m2, d2, y2);
    const z1 = getZodiac(m1, d1, y1);
    const z2 = getZodiac(m2, d2, y2);
    const wz1 = getWesternZodiac(m1, d1);
    const wz2 = getWesternZodiac(m2, d2);
    const zr = zodiacRelation(z1, z2);
    const lm = lp1 === lp2;
    setResult({
      lp1,
      lp2,
      z1,
      z2,
      wz1,
      wz2,
      zr,
      lm,
      lp1Info: LP[lp1],
      lp2Info: LP[lp2],
    });
  }

  // Compatibility score: friend +60, neutral +30, enemy +5; same LP +20; same element +10
  const score = result
    ? (result.zr?.rel === "friend" ? 60 : result.zr?.rel === "neutral" ? 30 : 5) +
      (result.lm ? 20 : 0) +
      (result.wz1.element === result.wz2.element ? 10 : 0)
    : 0;

  const tierLabel =
    score >= 80 ? "COSMIC ALIGNMENT" : score >= 60 ? "STRONG BOND" : score >= 40 ? "WORKABLE" : "CHALLENGING";
  const tierColor = score >= 80 ? T.green : score >= 60 ? T.orange : score >= 40 ? T.orangeHi : T.red;

  return (
    <div>
      <OracleCard>
        <OracleLabel>PERSON 1 — BIRTH DATE</OracleLabel>
        <OracleInput
          type="date"
          value={b1}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setB1(e.target.value)}
        />
        <div style={{ height: "12px" }} />
        <OracleLabel>PERSON 2 — BIRTH DATE</OracleLabel>
        <OracleInput
          type="date"
          value={b2}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setB2(e.target.value)}
        />
        <OracleButton onClick={analyze} disabled={!b1 || !b2}>
          * ANALYZE COMPATIBILITY
        </OracleButton>
      </OracleCard>

      {!result ? (
        <OracleCard>
          <div style={{ textAlign: "center", padding: "30px 10px" }}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>💞</div>
            <p style={{ fontSize: "13px", color: T.textDim, lineHeight: 1.7 }}>
              Enter two birth dates to analyze compatibility across Life Path numbers, Chinese zodiac trines, and Western astrological elements.
            </p>
          </div>
        </OracleCard>
      ) : (
        <>
          {/* Score hero */}
          <OracleCard highlight>
            <div style={{ textAlign: "center" }}>
              <OracleLabel>COMPATIBILITY SCORE</OracleLabel>
              <BigNumber n={score} color={tierColor} size={72} />
              <div style={{ fontSize: "10px", color: T.textDim, marginTop: "4px" }}>OUT OF 90</div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: tierColor,
                  letterSpacing: "2px",
                  marginTop: "10px",
                }}
              >
                {tierLabel}
              </div>
            </div>
          </OracleCard>

          {/* Both LPs side by side */}
          <OracleCard>
            <OracleLabel>LIFE PATH COMPARISON</OracleLabel>
            <div className="grid grid-cols-2 gap-3">
              <div
                style={{
                  background: `${result.lp1Info.color}0f`,
                  border: `1px solid ${result.lp1Info.color}50`,
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "32px" }}>{result.lp1Info.emoji}</div>
                <BigNumber n={result.lp1} color={result.lp1Info.color} size={42} />
                <div style={{ fontSize: "13px", fontWeight: "bold", color: result.lp1Info.color, marginTop: "4px" }}>
                  {result.lp1Info.title}
                </div>
                <div style={{ marginTop: "8px" }}>
                  {result.lp1Info.traits.slice(0, 3).map((t) => (
                    <Trait key={t}>{t}</Trait>
                  ))}
                </div>
              </div>
              <div
                style={{
                  background: `${result.lp2Info.color}0f`,
                  border: `1px solid ${result.lp2Info.color}50`,
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "32px" }}>{result.lp2Info.emoji}</div>
                <BigNumber n={result.lp2} color={result.lp2Info.color} size={42} />
                <div style={{ fontSize: "13px", fontWeight: "bold", color: result.lp2Info.color, marginTop: "4px" }}>
                  {result.lp2Info.title}
                </div>
                <div style={{ marginTop: "8px" }}>
                  {result.lp2Info.traits.slice(0, 3).map((t) => (
                    <Trait key={t}>{t}</Trait>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: "14px" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  background: result.lm ? `${T.orange}22` : `${T.textDim}11`,
                  border: `1px solid ${result.lm ? T.orange : T.border}`,
                  borderRadius: "20px",
                  color: result.lm ? T.orange : T.textDim,
                  fontSize: "11px",
                  letterSpacing: "2px",
                  fontWeight: "bold",
                }}
              >
                {result.lm ? "💫 SAME LIFE PATH — RESONANCE" : `${result.lp1} vs ${result.lp2} — COMPLEMENTARY`}
              </div>
            </div>
          </OracleCard>

          {/* Chinese zodiac match */}
          <OracleCard>
            <OracleLabel>CHINESE ZODIAC MATCH</OracleLabel>
            <div className="grid grid-cols-2 gap-3">
              <MiniBox label={`PERSON 1 — ${result.z1.name} · TAP`} color={T.orange}>
                <div style={{ fontSize: "40px", display: "inline-flex" }}>
                  <ZodiacEmojiButton sign={result.z1} size={40} />
                </div>
                <div style={{ fontSize: "10px", color: T.textDim, marginTop: "4px" }}>
                  Friends: {result.z1.friends.join(", ")}
                </div>
              </MiniBox>
              <MiniBox label={`PERSON 2 — ${result.z2.name} · TAP`} color={T.orangeHi}>
                <div style={{ fontSize: "40px", display: "inline-flex" }}>
                  <ZodiacEmojiButton sign={result.z2} size={40} />
                </div>
                <div style={{ fontSize: "10px", color: T.textDim, marginTop: "4px" }}>
                  Friends: {result.z2.friends.join(", ")}
                </div>
              </MiniBox>
            </div>
            <div style={{ textAlign: "center", marginTop: "14px" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "8px 16px",
                  background: `${result.zr?.color}22`,
                  border: `1px solid ${result.zr?.color}66`,
                  borderRadius: "20px",
                  color: result.zr?.color,
                  fontSize: "12px",
                  letterSpacing: "2px",
                  fontWeight: "bold",
                }}
              >
                {result.zr?.label}
              </div>
            </div>
            <p style={{ fontSize: "12px", color: T.textMid, lineHeight: 1.7, marginTop: "12px" }}>
              {result.zr?.rel === "friend"
                ? `Friend signs share a trine — natural alignment, easy flow, mutual support. The ${result.z1.name} and ${result.z2.name} pull in the same cosmic direction.`
                : result.zr?.rel === "enemy"
                ? `Enemy signs sit on opposite sides of the zodiac wheel. The ${result.z1.name} and ${result.z2.name} will need conscious effort to harmonize — friction is the default, but awareness is the cure.`
                : `Neutral zodiac energy — no natural pull, no inherent clash. Success here depends entirely on Life Path compatibility and personal choice.`}
            </p>
          </OracleCard>

          {/* Western zodiac match */}
          <OracleCard>
            <OracleLabel>WESTERN ASTROLOGY MATCH</OracleLabel>
            <div className="grid grid-cols-2 gap-3">
              <MiniBox label={`PERSON 1 — ${result.wz1.name}`} color={result.wz1.color}>
                <div style={{ fontSize: "32px" }}>{result.wz1.emoji}</div>
                <div style={{ fontSize: "10px", color: T.textDim, marginTop: "4px" }}>
                  {result.wz1.element} · {result.wz1.modality}
                </div>
              </MiniBox>
              <MiniBox label={`PERSON 2 — ${result.wz2.name}`} color={result.wz2.color}>
                <div style={{ fontSize: "32px" }}>{result.wz2.emoji}</div>
                <div style={{ fontSize: "10px", color: T.textDim, marginTop: "4px" }}>
                  {result.wz2.element} · {result.wz2.modality}
                </div>
              </MiniBox>
            </div>
            <p style={{ fontSize: "12px", color: T.textMid, lineHeight: 1.7, marginTop: "12px" }}>
              {result.wz1.element === result.wz2.element
                ? `Same element (${result.wz1.element}) — deep mutual understanding. You speak the same emotional language.`
                : result.wz1.compatible.includes(result.wz2.name)
                ? `${result.wz1.name} and ${result.wz2.name} are classically compatible — natural attraction and balance.`
                : `${result.wz1.name} and ${result.wz2.name} bring different elemental energies. Tension is possible, but so is growth — the friction can spark real transformation.`}
            </p>
          </OracleCard>

          <OracleHr />
          <p style={{ fontSize: "11px", color: T.textDim, textAlign: "center", padding: "6px 0" }}>
            * Compatibility score = zodiac trine + Life Path resonance + elemental alignment · For reflection, not prediction
          </p>
        </>
      )}
    </div>
  );
}

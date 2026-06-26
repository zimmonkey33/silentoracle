"use client";

import { useState } from "react";
import { T } from "@/lib/oracle/theme";
import { LP, CZ, type ChineseZodiacInfo } from "@/lib/oracle/data";
import { OracleCard, OracleLabel, BigNumber, MiniBox, Trait, OracleHr } from "./primitives";
import { ZodiacChip, ZodiacSignModal } from "./ZodiacModal";

const LP_KEYS = Object.keys(LP).map(Number).sort((a, b) => a - b);

const TRINES: Array<{ signs: ChineseZodiacInfo[]; color: string; name: string; desc: string }> = [
  { signs: [CZ[0], CZ[4], CZ[8]],   color: T.orange,     name: "The Thinkers",   desc: "Sharp, opportunistic, ambitious. They move together and rise together." },
  { signs: [CZ[1], CZ[5], CZ[9]],   color: T.orangeHi,   name: "The Builders",   desc: "Disciplined, strategic, perfectionist. Slow to start, unstoppable once moving." },
  { signs: [CZ[2], CZ[6], CZ[10]],  color: "#FF5500",    name: "The Warriors",   desc: "Bold, freedom-loving, loyal. They protect their own and charge at the world." },
  { signs: [CZ[3], CZ[7], CZ[11]],  color: "#FFA040",    name: "The Peacemakers",desc: "Intuitive, artistic, generous. They feel deeply and create beauty." },
];

export function NumbersTab() {
  const [selLP, setSelLP] = useState<number | null>(1);
  const [openSign, setOpenSign] = useState<ChineseZodiacInfo | null>(null);

  return (
    <div>
      {/* LP selector grid */}
      <OracleCard>
        <OracleLabel>LIFE PATH PROFILES — TAP A NUMBER TO EXPAND</OracleLabel>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {LP_KEYS.map((num) => {
            const active = selLP === num;
            return (
              <button
                key={num}
                onClick={() => setSelLP(active ? null : num)}
                style={{
                  background: active ? `${T.orange}22` : "#0f0900",
                  border: `1px solid ${active ? T.orange : T.border}`,
                  borderRadius: "8px",
                  padding: "12px 4px",
                  cursor: "pointer",
                  color: active ? T.orange : T.textMid,
                  fontSize: "20px",
                  fontWeight: 900,
                  fontFamily: "Georgia, serif",
                  transition: "all 0.15s",
                }}
              >
                {num}
              </button>
            );
          })}
        </div>
      </OracleCard>

      {/* Selected LP detail */}
      {selLP && LP[selLP] && (
        <OracleCard highlight>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "50px" }}>{LP[selLP].emoji}</div>
            <BigNumber n={selLP} color={LP[selLP].color} size={50} />
            <div style={{ fontSize: "18px", fontWeight: "bold", color: T.orange, letterSpacing: "2px", margin: "8px 0" }}>
              {LP[selLP].title}
            </div>
            <p style={{ fontSize: "13px", lineHeight: 1.7, color: T.textMid, marginBottom: "12px" }}>
              {LP[selLP].desc}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
              {LP[selLP].traits.map((t) => (
                <Trait key={t}>{t}</Trait>
              ))}
            </div>
            <OracleHr />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <MiniBox label="STRENGTHS" color={T.orange}>
                <div style={{ fontSize: "11px", color: T.text, marginTop: 4 }}>{LP[selLP].strengths}</div>
              </MiniBox>
              <MiniBox label="SHADOW" color={T.red}>
                <div style={{ fontSize: "11px", color: T.text, marginTop: 4 }}>{LP[selLP].shadow}</div>
              </MiniBox>
              <MiniBox label="WEALTH" color={T.green}>
                <div style={{ fontSize: "11px", color: T.text, marginTop: 4 }}>{LP[selLP].wealth}</div>
              </MiniBox>
              <MiniBox label="CAREER" color={T.orangeHi}>
                <div style={{ fontSize: "11px", color: T.text, marginTop: 4 }}>{LP[selLP].career}</div>
              </MiniBox>
              <MiniBox label="LOVE" color={T.purple}>
                <div style={{ fontSize: "11px", color: T.text, marginTop: 4 }}>{LP[selLP].love}</div>
              </MiniBox>
              <MiniBox label="FAMOUS" color={T.blue}>
                <div style={{ fontSize: "11px", color: T.text, marginTop: 4 }}>{LP[selLP].famous}</div>
              </MiniBox>
            </div>
          </div>
        </OracleCard>
      )}

      {/* Chinese zodiac browser — all 12 signs clickable */}
      <OracleCard>
        <OracleLabel>CHINESE ZODIAC — TAP ANY SIGN TO LEARN MORE</OracleLabel>
        <p style={{ fontSize: "10px", color: T.textDim, marginBottom: "12px" }}>
          In Silent Oracle methodology, the 4th sign is <strong style={{ color: T.orange }}>Cat</strong>, not Rabbit. Tap any sign below to see its full explanation, traits, element, polarity, friends, enemy, and soulmate.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {CZ.map((sign) => (
            <ZodiacChip key={sign.name} sign={sign} size="md" />
          ))}
        </div>
      </OracleCard>

      {/* Trines — clickable per sign */}
      <OracleCard>
        <OracleLabel>CHINESE ZODIAC TRINES — FRIEND GROUPS</OracleLabel>
        <p style={{ fontSize: "10px", color: T.textDim, marginBottom: "12px" }}>
          Each sign is friends with signs 4 positions away (the trine). Enemies are 6 positions away (opposite side of the zodiac wheel). Tap any sign to learn more.
        </p>
        {TRINES.map(({ signs, color, name, desc }) => (
          <div key={signs[0].name} style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "11px", color: color, fontWeight: "bold", letterSpacing: "2px", marginBottom: "6px" }}>
              {name.toUpperCase()}
            </div>
            <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
              {signs.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setOpenSign(s)}
                  title={`Click to learn about ${s.name}`}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "9px 4px",
                    background: `${color}0f`,
                    border: `1px solid ${color}30`,
                    borderRadius: "7px",
                    fontSize: "11px",
                    color: T.text,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                  className="hover:border-orange-500"
                >
                  <div style={{ fontSize: "20px" }}>{s.emoji}</div>
                  <div style={{ marginTop: "2px" }}>{s.name}</div>
                </button>
              ))}
            </div>
            <p style={{ fontSize: "11px", color: T.textMid, lineHeight: 1.6, paddingLeft: "4px" }}>{desc}</p>
          </div>
        ))}
      </OracleCard>

      {/* Zodiac modal */}
      <ZodiacSignModal sign={openSign} onClose={() => setOpenSign(null)} />

      {/* LP calculation guide */}
      <OracleCard>
        <OracleLabel>HOW TO CALCULATE LIFE PATH</OracleLabel>
        <div style={{ fontSize: "12px", color: T.textMid, lineHeight: 1.9 }}>
          <p>
            Add <strong style={{ color: T.orange }}>all digits</strong> of your full birth date (month + day + year), then reduce to 1-9, 11, 22, or 33.
          </p>
          <p>
            Master numbers <strong style={{ color: T.orange }}>11, 22, 33</strong> are NOT reduced further.
          </p>
          <p>
            Example: <strong style={{ color: T.orange }}>1/7/1978 → 1+7+1+9+7+8 = 33</strong> → STOP (master number)
          </p>
          <p>
            Example: <strong style={{ color: T.orange }}>3/14/1988 → 3+1+4+1+9+8+8 = 34 → 3+4 = 7</strong>
          </p>
          <p>
            Lucky number: <strong style={{ color: T.orange }}>first digit of birth month + last digit of birth year</strong> combined (e.g. Jordan born Feb 1963 → 2 + 3 ={" "}
            <strong style={{ color: T.orange }}>23</strong>).
          </p>
        </div>
      </OracleCard>

      <OracleHr />
      <p style={{ fontSize: "11px", color: T.textDim, textAlign: "center", padding: "6px 0" }}>
        * Strict numerology methodology · Master Numbers 11/22/33 carry higher spiritual stakes · Cat replaces Rabbit as the 4th Chinese zodiac sign
      </p>
    </div>
  );
}

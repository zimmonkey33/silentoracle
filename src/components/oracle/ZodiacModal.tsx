"use client";

import { useEffect, useState } from "react";
import { T } from "@/lib/oracle/theme";
import { CZ, type ChineseZodiacInfo } from "@/lib/oracle/data";
import { OracleLabel, Trait, OracleHr, BigNumber } from "./primitives";

/** Full-screen modal that explains a single Chinese zodiac sign in detail. */
export function ZodiacSignModal({
  sign,
  onClose,
}: {
  sign: ChineseZodiacInfo | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!sign) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [sign, onClose]);

  if (!sign) return null;

  // Trine = this sign + its 2 friends
  const trineSigns = [sign, ...CZ.filter((s) => sign.friends.includes(s.name))];

  // Polarity: Rat/Tiger/Dragon/Horse/Monkey/Dog = Yang; Ox/Cat/Snake/Goat/Rooster/Pig = Yin
  const yangSigns = ["Rat", "Tiger", "Dragon", "Horse", "Monkey", "Dog"];
  const polarity = yangSigns.includes(sign.name) ? "Yang (active, outward)" : "Yin (receptive, inward)";

  // Element by position in the cycle
  const elements: Record<string, string> = {
    Rat: "Water", Ox: "Water",
    Tiger: "Wood", Cat: "Wood",
    Dragon: "Earth", Snake: "Fire",
    Horse: "Fire", Goat: "Earth",
    Monkey: "Metal", Rooster: "Metal",
    Dog: "Earth", Pig: "Water",
  };
  const element = elements[sign.name] || "—";
  const trineName = trineSigns.map((s) => s.name).join(" · ");

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        zIndex: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="oracle-scrollbar"
        style={{
          background: T.card,
          border: `2px solid ${T.orange}`,
          borderRadius: "16px",
          padding: "28px 24px",
          maxWidth: "560px",
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          margin: "auto",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "18px" }}>
          <div style={{ fontSize: "56px", lineHeight: 1 }}>{sign.emoji}</div>
          <div
            style={{
              fontSize: "26px",
              fontWeight: 900,
              color: T.orange,
              letterSpacing: "3px",
              fontFamily: "Georgia, serif",
              marginTop: "8px",
            }}
          >
            {sign.name.toUpperCase()}
          </div>
          <div style={{ fontSize: "10px", color: T.textDim, letterSpacing: "3px", marginTop: "4px" }}>
            CHINESE ZODIAC · POSITION {CZ.findIndex((s) => s.name === sign.name) + 1}/12
          </div>
        </div>

        {/* Polarity + Element + Trine quick grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div
            style={{
              background: `${T.orange}0f`,
              border: `1px solid ${T.orange}30`,
              borderRadius: "8px",
              padding: "10px 8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "9px", color: T.textDim, letterSpacing: "2px" }}>POLARITY</div>
            <div style={{ fontSize: "12px", color: T.orange, fontWeight: "bold", marginTop: "4px" }}>
              {polarity.split(" ")[0]}
            </div>
            <div style={{ fontSize: "9px", color: T.textDim, marginTop: "2px" }}>
              {polarity.split(" ").slice(1).join(" ")}
            </div>
          </div>
          <div
            style={{
              background: `${T.orangeHi}0f`,
              border: `1px solid ${T.orangeHi}30`,
              borderRadius: "8px",
              padding: "10px 8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "9px", color: T.textDim, letterSpacing: "2px" }}>ELEMENT</div>
            <div style={{ fontSize: "14px", color: T.orangeHi, fontWeight: "bold", marginTop: "4px" }}>
              {element}
            </div>
          </div>
          <div
            style={{
              background: `${T.purple}0f`,
              border: `1px solid ${T.purple}30`,
              borderRadius: "8px",
              padding: "10px 8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "9px", color: T.textDim, letterSpacing: "2px" }}>POSITION</div>
            <div style={{ fontSize: "14px", color: T.purple, fontWeight: "bold", marginTop: "4px" }}>
              {CZ.findIndex((s) => s.name === sign.name) + 1}/12
            </div>
          </div>
        </div>

        {/* Traits */}
        <OracleLabel>KEY TRAITS</OracleLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "14px" }}>
          {sign.traits.map((t) => (
            <Trait key={t}>{t}</Trait>
          ))}
        </div>

        {/* Description */}
        <OracleLabel>FULL EXPLANATION</OracleLabel>
        <p style={{ fontSize: "13px", lineHeight: 1.75, color: T.textMid, marginBottom: "14px" }}>
          {sign.desc}
        </p>

        <OracleHr />

        {/* Trine */}
        <OracleLabel>TRINE — FRIEND GROUP</OracleLabel>
        <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
          {trineSigns.map((s) => (
            <div
              key={s.name}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "12px 4px",
                background: s.name === sign.name ? `${T.orange}22` : `${T.orange}0f`,
                border: `1px solid ${s.name === sign.name ? T.orange : `${T.orange}30`}`,
                borderRadius: "8px",
              }}
            >
              <div style={{ fontSize: "24px" }}>{s.emoji}</div>
              <div style={{ fontSize: "11px", color: s.name === sign.name ? T.orange : T.text, fontWeight: "bold", marginTop: "2px" }}>
                {s.name}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "11px", color: T.textMid, lineHeight: 1.6, marginBottom: "14px" }}>
          <strong style={{ color: T.orange }}>{trineName}</strong> form a trine — the most harmonious
          combination in the Chinese zodiac. Signs in the same trine share core energy and naturally
          support each other in business, love, and friendship. When you meet someone from your trine,
          the connection feels instant.
        </p>

        {/* Allies + enemies */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div
            style={{
              background: `${T.green}0f`,
              border: `1px solid ${T.green}30`,
              borderRadius: "8px",
              padding: "12px",
            }}
          >
            <div style={{ fontSize: "9px", color: T.textDim, letterSpacing: "2px" }}>🤝 FRIENDS</div>
            <div style={{ fontSize: "14px", color: T.green, fontWeight: "bold", marginTop: "4px" }}>
              {sign.friends.join(", ")}
            </div>
            <div style={{ fontSize: "10px", color: T.textDim, marginTop: "4px" }}>
              Natural alignment — partnerships flow.
            </div>
          </div>
          <div
            style={{
              background: `${T.red}0f`,
              border: `1px solid ${T.red}30`,
              borderRadius: "8px",
              padding: "12px",
            }}
          >
            <div style={{ fontSize: "9px", color: T.textDim, letterSpacing: "2px" }}>⚔️ ENEMY</div>
            <div style={{ fontSize: "14px", color: T.red, fontWeight: "bold", marginTop: "4px" }}>
              {sign.enemy}
            </div>
            <div style={{ fontSize: "10px", color: T.textDim, marginTop: "4px" }}>
              Opposite side of the wheel — friction is the default.
            </div>
          </div>
        </div>

        {/* Soulmate */}
        {sign.soulmate && (
          <div
            style={{
              background: `${T.purple}0f`,
              border: `1px solid ${T.purple}30`,
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "14px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "9px", color: T.textDim, letterSpacing: "2px" }}>💫 SOULMATE SIGN</div>
            <div style={{ fontSize: "16px", color: T.purple, fontWeight: "bold", marginTop: "4px" }}>
              {sign.soulmate}
            </div>
            <div style={{ fontSize: "10px", color: T.textDim, marginTop: "4px" }}>
              The traditional soulmate pairing for {sign.name}. When {sign.name} meets {sign.soulmate}, the
              bond is rare and lasting.
            </div>
          </div>
        )}

        <OracleHr />

        {/* Silent Oracle context note */}
        <OracleLabel>SILENT ORACLE CONTEXT</OracleLabel>
        <p style={{ fontSize: "11px", color: T.textMid, lineHeight: 1.7, marginBottom: "16px" }}>
          In Silent Oracle methodology, the 4th sign is <strong style={{ color: T.orange }}>Cat</strong>, not
          Rabbit. The 12 signs form 4 trines of 3 signs each:{" "}
          <strong style={{ color: T.orange }}>Rat-Dragon-Monkey</strong>,{" "}
          <strong style={{ color: T.orange }}>Ox-Snake-Rooster</strong>,{" "}
          <strong style={{ color: T.orange }}>Tiger-Horse-Dog</strong>, and{" "}
          <strong style={{ color: T.orange }}>Cat-Goat-Pig</strong>. Trine signs are natural friends;
          opposite signs (6 positions away) are enemies. Use this to time decisions, choose partners, and
          navigate enemy years with awareness.
        </p>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            width: "100%",
            background: `linear-gradient(135deg, ${T.orange}, ${T.orange}bb)`,
            border: "none",
            borderRadius: "8px",
            padding: "13px",
            color: "#000",
            fontSize: "12px",
            fontWeight: 900,
            letterSpacing: "2px",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          * CLOSE
        </button>
      </div>
    </div>
  );
}

/** Clickable bare emoji (no name) — opens the modal. Use inside compact UI. */
export function ZodiacEmojiButton({
  sign,
  size = 28,
}: {
  sign: ChineseZodiacInfo;
  size?: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={`Click to learn about ${sign.name}`}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          fontSize: `${size}px`,
          lineHeight: 1,
          fontFamily: "inherit",
          transition: "transform 0.15s",
        }}
        className="hover:scale-110"
      >
        {sign.emoji}
      </button>
      {open && <ZodiacSignModal sign={sign} onClose={() => setOpen(false)} />}
    </>
  );
}

/** Clickable pill-style chip showing emoji + name + ⓘ icon. */
export function ZodiacChip({
  sign,
  size = "md",
}: {
  sign: ChineseZodiacInfo;
  size?: "sm" | "md" | "lg";
}) {
  const [open, setOpen] = useState(false);
  const sizes = {
    sm: { emoji: "20px", name: "11px", padding: "6px 10px" },
    md: { emoji: "28px", name: "12px", padding: "8px 14px" },
    lg: { emoji: "36px", name: "14px", padding: "10px 18px" },
  };
  const s = sizes[size];
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={`Click to learn about ${sign.name}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: `${T.orange}11`,
          border: `1px solid ${T.orange}55`,
          borderRadius: "20px",
          padding: s.padding,
          color: T.orange,
          fontSize: s.name,
          fontWeight: "bold",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.15s",
        }}
        className="hover:bg-orange-900/40"
      >
        <span style={{ fontSize: s.emoji, lineHeight: 1 }}>{sign.emoji}</span>
        <span>{sign.name}</span>
        <span style={{ fontSize: "9px", color: T.textDim, marginLeft: 2 }}>ⓘ</span>
      </button>
      {open && <ZodiacSignModal sign={sign} onClose={() => setOpen(false)} />}
    </>
  );
}

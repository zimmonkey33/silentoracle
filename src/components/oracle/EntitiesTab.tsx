"use client";

import { useEffect, useMemo, useState } from "react";
import { T } from "@/lib/oracle/theme";
import { ENTITIES, LP, type EntityEntry } from "@/lib/oracle/data";
import {
  calcLP,
  getZodiac,
  luckyNums,
  parseEntityDate,
  zodiacRelation,
  type ChineseZodiacInfo,
} from "@/lib/oracle/calc";
import {
  OracleCard,
  OracleLabel,
  OracleInput,
  OracleButton,
  BigNumber,
  MiniBox,
  OracleHr,
  EntityIcon,
} from "./primitives";
import { ZodiacEmojiButton } from "./ZodiacModal";
import type { OracleProfile } from "./MyReadingTab";

interface EntityResult {
  name: string;
  type?: string;
  y: number;
  m: number;
  d: number;
  lp: number;
  zodiac: ChineseZodiacInfo;
  lucky: ReturnType<typeof luckyNums>;
}

interface SavedEntity {
  name: string;
  date: string;
  lp: number;
  zodiac: string;
  emoji: string;
}

export function EntitiesTab({ profile }: { profile: OracleProfile | null }) {
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [result, setResult] = useState<EntityResult | null>(null);
  const [saved, setSaved] = useState<SavedEntity[]>([]);

  // Load saved entities on mount (deferred to avoid hydration mismatch — localStorage is client-only)
  useEffect(() => {
    try {
      const sv = localStorage.getItem("so_sv");
      /* eslint-disable react-hooks/set-state-in-effect */
      if (sv) setSaved(JSON.parse(sv));
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch {
      /* ignore */
    }
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ENTITIES.slice(0, 50);
    return ENTITIES.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q) ||
        e.notes.toLowerCase().includes(q)
    ).slice(0, 100);
  }, [search]);

  function readEntity(entry: EntityEntry | { name: string; date: string; type?: string }) {
    const parsed = parseEntityDate(entry.date);
    setResult({
      name: entry.name,
      type: "type" in entry ? entry.type : undefined,
      ...parsed,
    });
    setName(entry.name);
    setDate(entry.date);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function readCustom() {
    if (!date || !name.trim()) return;
    const parsed = parseEntityDate(date);
    setResult({
      name: name.trim(),
      type: undefined,
      ...parsed,
    });
  }

  function saveCurrent() {
    if (!result) return;
    const entry = {
      name: result.name,
      date: `${result.y}-${String(result.m).padStart(2, "0")}-${String(result.d).padStart(2, "0")}`,
      lp: result.lp,
      zodiac: result.zodiac.name,
      emoji: result.zodiac.emoji,
    };
    const upd = [entry, ...saved.filter((e) => e.name !== entry.name)].slice(0, 25);
    setSaved(upd);
    try {
      localStorage.setItem("so_sv", JSON.stringify(upd));
    } catch {
      /* ignore */
    }
  }

  return (
    <div>
      {/* Search */}
      <OracleCard>
        <OracleLabel>SEARCH ENTITY DATABASE — {ENTITIES.length.toLocaleString()} ENTRIES</OracleLabel>
        <OracleInput
          type="text"
          placeholder="Search by name, type, or notes — e.g. 'Bitcoin', 'Tech', 'founded June 2009'..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <p style={{ fontSize: "10px", color: T.textDim, marginTop: "8px" }}>
          Showing {filtered.length} of {ENTITIES.length} entities. Click any entity to analyze its numerology.
        </p>
      </OracleCard>

      {/* Result panel */}
      {result && (
        <OracleCard highlight>
          <div style={{ textAlign: "center" }}>
            <OracleLabel>ENTITY READING</OracleLabel>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                marginBottom: 12,
              }}
            >
              <EntityIcon name={result.name} size={56} />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "18px", fontWeight: "bold", color: T.white }}>{result.name}</div>
                <div style={{ fontSize: "10px", color: T.textDim }}>
                  Founded: {result.m}/{result.d}/{result.y}
                </div>
                {result.type && (
                  <div
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      background: `${T.orange}22`,
                      border: `1px solid ${T.orange}66`,
                      borderRadius: "12px",
                      color: T.orange,
                      fontSize: "9px",
                      letterSpacing: "2px",
                      marginTop: "4px",
                      fontWeight: "bold",
                    }}
                  >
                    {result.type.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <BigNumber n={result.lp} color={LP[result.lp]?.color || T.orange} />
            <div style={{ fontSize: "22px", margin: "8px 0" }}>{LP[result.lp]?.emoji}</div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: T.orange,
                letterSpacing: "2px",
                marginBottom: "10px",
              }}
            >
              {LP[result.lp]?.title} ENERGY
            </div>
            <p style={{ fontSize: "12px", lineHeight: 1.7, color: T.textMid, marginBottom: "14px" }}>
              This entity vibrates on <strong style={{ color: T.orange }}>Life Path {result.lp}</strong>.{" "}
              {LP[result.lp]?.desc?.replace(/\bYou\b/g, "It").replace(/\byour\b/g, "its")}
            </p>

            {/* Zodiac + Lucky + LP calc */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <MiniBox label="ZODIAC · TAP TO LEARN" color={T.orangeHi}>
                <div style={{ fontSize: "28px", display: "inline-flex" }}>
                  {result.zodiac && <ZodiacEmojiButton sign={result.zodiac} size={28} />}
                </div>
                <div style={{ fontSize: "12px", color: T.orangeHi, fontWeight: "bold", marginTop: "4px" }}>
                  {result.zodiac?.name}
                </div>
                <div style={{ fontSize: "9px", color: T.textDim, marginTop: "2px" }}>
                  🤝 {result.zodiac?.friends?.join(", ")}
                </div>
                <div style={{ fontSize: "9px", color: T.red, marginTop: "1px" }}>
                  ⚔️ {result.zodiac?.enemy}
                </div>
              </MiniBox>
              <MiniBox label="POWER DIGITS" color={T.orange}>
                <div style={{ fontSize: "28px" }}>🔢</div>
                <div
                  style={{
                    fontSize: "28px",
                    color: T.orange,
                    fontWeight: 900,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {result.lucky?.lucky}
                </div>
                <div style={{ fontSize: "9px", color: T.textDim, marginTop: "2px" }}>
                  M{result.m} + Y{result.y}
                </div>
              </MiniBox>
              <MiniBox label="LP CALC" color={T.orangeDim}>
                <div style={{ fontSize: "28px" }}>📅</div>
                <div style={{ fontSize: "10px", color: T.textMid, lineHeight: 1.6, marginTop: "4px" }}>
                  {result.m}+{result.d}+{result.y}
                  <br />= <strong style={{ color: T.orange }}>{result.lp}</strong>
                </div>
              </MiniBox>
            </div>

            <OracleHr />

            {/* User alignment */}
            {profile ? (
              (() => {
                const zr = zodiacRelation(profile.bz, result.zodiac);
                const lpm = profile.lp === result.lp;
                return (
                  <div>
                    <OracleLabel>YOUR ALIGNMENT WITH THIS ENTITY</OracleLabel>
                    <div className="grid grid-cols-2 gap-2">
                      <MiniBox label="ZODIAC MATCH" color={zr?.color || T.purple}>
                        <div style={{ color: zr?.color, fontWeight: "bold", fontSize: "14px", marginTop: "4px" }}>
                          {zr?.label}
                        </div>
                        <div style={{ fontSize: "9px", color: T.textDim, marginTop: "4px" }}>
                          {profile.bz?.name} vs {result.zodiac?.name}
                        </div>
                      </MiniBox>
                      <MiniBox label="LIFE PATH" color={lpm ? T.orange : T.border}>
                        <div
                          style={{
                            color: lpm ? T.orange : T.textDim,
                            fontWeight: "bold",
                            fontSize: "14px",
                            marginTop: "4px",
                          }}
                        >
                          {lpm ? "💫 SAME LP" : `${profile.lp} vs ${result.lp}`}
                        </div>
                      </MiniBox>
                    </div>
                    <p style={{ fontSize: "12px", color: T.textMid, lineHeight: 1.7, marginTop: "12px" }}>
                      {zr?.rel === "friend"
                        ? `Your ${profile.bz?.name} and this entity's ${result.zodiac?.name} are FRIEND signs. Natural alignment — working with or investing here flows with your cosmic energy.`
                        : zr?.rel === "enemy"
                        ? `Your ${profile.bz?.name} and this entity's ${result.zodiac?.name} are ENEMY signs. Eyes wide open. Don't over-leverage — awareness is your edge.`
                        : `Neutral zodiac energy. Success here depends on execution and LP alignment, not cosmic pull alone.`}
                    </p>
                  </div>
                );
              })()
            ) : (
              <p style={{ fontSize: "11px", color: T.textDim }}>
                → Enter your birth date in MY READING to see your personal alignment
              </p>
            )}

            <OracleButton onClick={saveCurrent} color={T.orangeDim} style={{ marginTop: "10px" }}>
              💾 SAVE TO MY ENTITIES
            </OracleButton>
          </div>
        </OracleCard>
      )}

      {/* Custom entry */}
      <OracleCard>
        <OracleLabel>ANALYZE ANY CUSTOM DATE</OracleLabel>
        <p style={{ fontSize: "11px", color: T.textDim, marginBottom: "10px" }}>
          Enter any entity not in the list above — a person, project, brand, or institution.
        </p>
        <OracleInput
          type="text"
          placeholder="Entity / company / person name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: "8px" }}
        />
        <OracleLabel>FOUNDING / LAUNCH / INCORPORATION / BIRTH DATE</OracleLabel>
        <OracleInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <OracleButton onClick={readCustom} disabled={!date || !name.trim()}>
          * READ ENTITY
        </OracleButton>
      </OracleCard>

      {/* Saved entities */}
      {saved.length > 0 && (
        <OracleCard>
          <OracleLabel>SAVED ENTITIES ({saved.length})</OracleLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {saved.map((e, idx) => (
              <button
                key={idx + e.name}
                onClick={() => readEntity({ name: e.name, date: e.date })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  background: "#0f0900",
                  border: `1px solid ${T.border}`,
                  borderRadius: "8px",
                  padding: "10px 13px",
                  color: T.text,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color 0.15s",
                }}
                className="hover:border-orange-500"
              >
                <EntityIcon name={e.name} size={32} />
                <div style={{ marginLeft: 10, flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {e.name}
                  </div>
                  <div style={{ fontSize: "10px", color: T.textDim }}>
                    {e.date} · {e.zodiac}
                  </div>
                </div>
                <div style={{ paddingLeft: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: LP[e.lp]?.color || T.orange, fontWeight: 900, fontSize: "14px" }}>
                    LP{e.lp}
                  </span>
                  <span style={{ fontSize: "16px" }}>{e.emoji}</span>
                </div>
              </button>
            ))}
          </div>
        </OracleCard>
      )}

      {/* Entity list */}
      <OracleCard>
        <OracleLabel>ENTITY DIRECTORY</OracleLabel>
        <div
          className="oracle-scrollbar"
          style={{ maxHeight: "520px", overflowY: "auto", paddingRight: "4px" }}
        >
          {filtered.length === 0 ? (
            <p style={{ fontSize: "12px", color: T.textDim, textAlign: "center", padding: "20px" }}>
              No entities match &quot;{search}&quot;. Try a different search term.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filtered.map((e) => {
                const parsed = parseEntityDate(e.date);
                return (
                  <button
                    key={e.name}
                    onClick={() => readEntity(e)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      background: "#0f0900",
                      border: `1px solid ${T.border}`,
                      borderRadius: "8px",
                      padding: "9px 11px",
                      color: T.text,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "border-color 0.15s",
                    }}
                    className="hover:border-orange-500"
                  >
                    <EntityIcon name={e.name} size={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {e.name}
                      </div>
                      <div style={{ fontSize: "10px", color: T.textDim }}>
                        {e.type} · {e.date}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 6, flexShrink: 0 }}>
                      <span style={{ color: LP[parsed.lp]?.color || T.orange, fontWeight: 900, fontSize: "13px" }}>
                        LP{parsed.lp}
                      </span>
                      <span style={{ fontSize: "14px" }}>{parsed.zodiac.emoji}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </OracleCard>

      {/* Guide */}
      <OracleCard>
        <OracleLabel>ENTITY DATE GUIDE</OracleLabel>
        <div style={{ fontSize: "12px", color: T.textMid, lineHeight: 1.9 }}>
          <p>
            📅 <strong style={{ color: T.orange }}>Which date to use:</strong> Founding/incorporation date, first public launch, domain registration, genesis block, IPO date. That is the entity&apos;s numerological birth — it never changes.
          </p>
          <p>
            🏢 <strong style={{ color: T.orange }}>Companies:</strong> LP and zodiac energy follow the company forever, just like a person&apos;s Life Path. Apple (LP 6 — The Healer) creates products people love and depend on. Bitcoin (LP 5 — The Entertainer) is magnetic, volatile, magnetic.
          </p>
          <p>
            🔗 <strong style={{ color: T.orange }}>Before partnering or investing:</strong> Friend zodiac = natural flow. Enemy zodiac = proceed with eyes open. Don&apos;t over-leverage in enemy territory.
          </p>
          <p>
            🚀 <strong style={{ color: T.orange }}>Launching your own business:</strong> Pick a founding date that shares your LP or is a friend-sign year. Use your lucky digits in the date if possible.
          </p>
          <p>
            🅰️ <strong style={{ color: T.orange }}>Name numerology:</strong> A=1, B=2 ... Z=26. Sum all letters of your brand name and reduce to a LP. Match to your own LP or a friend LP.
          </p>
          <p>
            📈 <strong style={{ color: T.orange }}>Investment timing:</strong> Use today&apos;s energy number. High LP energy days (8, 11, 22) for big moves. Your own LP day for personal decisions.
          </p>
        </div>
      </OracleCard>
    </div>
  );
}

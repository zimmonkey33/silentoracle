"use client";

import { useState } from "react";
import { T } from "@/lib/oracle/theme";
import {
  calcLP,
  calcPersonalYear,
  calcPersonalMonth,
  getZodiac,
  getWesternZodiac,
  luckyNums,
  yearStatus,
  getLifePathInfo,
  getPersonalMonthInfo,
} from "@/lib/oracle/calc";
import { DAILY_DESC } from "@/lib/oracle/data";
import { ZodiacEmojiButton } from "./ZodiacModal";
import {
  OracleCard,
  OracleLabel,
  OracleInput,
  OracleButton,
  OracleOutlineButton,
  BigNumber,
  MiniBox,
  Trait,
  OracleHr,
} from "./primitives";

export interface OracleProfile {
  lp: number;
  py: number;
  pm: number;
  bz: ReturnType<typeof getZodiac>;
  yz: ReturnType<typeof getZodiac>;
  wz: ReturnType<typeof getWesternZodiac>;
  lk: ReturnType<typeof luckyNums>;
  ys: ReturnType<typeof yearStatus>;
  lpd: ReturnType<typeof getLifePathInfo>;
  m: number;
  d: number;
  y: number;
}

export function buildProfile(ds: string): OracleProfile | null {
  if (!ds) return null;
  const parts = ds.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  const [y, m, d] = parts;
  const now = new Date();
  const lp = calcLP(m, d, y);
  const py = calcPersonalYear(m, d, now);
  const effectiveMonth = now.getDate() >= d ? now.getMonth() + 1 : now.getMonth() || 12;
  const pm = calcPersonalMonth(py, effectiveMonth);
  const bz = getZodiac(m, d, y);
  const yz = getZodiac(now.getMonth() + 1, now.getDate(), now.getFullYear());
  const wz = getWesternZodiac(m, d);
  const lk = luckyNums(m, y);
  const ys = yearStatus(lp, py, bz, yz);
  const lpd = getLifePathInfo(lp);
  return { lp, py, pm, bz, yz, wz, lk, ys, lpd, m, d, y };
}

export function MyReadingTab({
  birthDate,
  onBirthDateChange,
  profile,
}: {
  birthDate: string;
  onBirthDateChange: (s: string) => void;
  profile: OracleProfile | null;
}) {
  const [localDate, setLocalDate] = useState(birthDate);

  function apply() {
    onBirthDateChange(localDate);
    try {
      localStorage.setItem("so_bd", localDate);
    } catch {
      /* ignore */
    }
  }

  function clearProfile() {
    setLocalDate("");
    onBirthDateChange("");
    try {
      localStorage.removeItem("so_bd");
    } catch {
      /* ignore */
    }
  }

  const now = new Date();
  const nowStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div>
      <OracleCard>
        <OracleLabel>YOUR BIRTH DATE</OracleLabel>
        <OracleInput
          type="date"
          value={localDate}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setLocalDate(e.target.value)}
        />
        <OracleButton onClick={apply} disabled={!localDate}>
          * BUILD MY READING
        </OracleButton>
        {birthDate && (
          <OracleOutlineButton color={T.textDim} onClick={clearProfile} style={{ marginTop: 8 }}>
            CLEAR PROFILE
          </OracleOutlineButton>
        )}
        <p className="mt-3" style={{ fontSize: "11px", color: T.textDim }}>
          Today is {nowStr}. Your Personal Year updates on your birthday, not January 1st.
        </p>
      </OracleCard>

      {!profile ? (
        <OracleCard>
          <div style={{ textAlign: "center", padding: "30px 10px" }}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>🔮</div>
            <p style={{ fontSize: "13px", color: T.textDim, lineHeight: 1.7 }}>
              Enter your birth date above to unlock your full Silent Oracle numerology profile — Life Path, Personal Year, Chinese zodiac, Western zodiac, lucky number, and personalised guidance for the current cycle.
            </p>
          </div>
        </OracleCard>
      ) : (
        <>
          {/* Life Path hero */}
          <OracleCard highlight>
            <div style={{ textAlign: "center" }}>
              <OracleLabel>LIFE PATH</OracleLabel>
              <BigNumber n={profile.lp} color={profile.lpd?.color || T.orange} />
              <div style={{ fontSize: "40px", margin: "8px 0" }}>{profile.lpd?.emoji}</div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: T.orange,
                  letterSpacing: "2px",
                  marginBottom: "12px",
                }}
              >
                {profile.lpd?.title}
              </div>
              <p style={{ fontSize: "13px", lineHeight: 1.7, color: T.textMid, marginBottom: "14px" }}>
                {profile.lpd?.desc}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                {profile.lpd?.traits.map((t) => (
                  <Trait key={t}>{t}</Trait>
                ))}
              </div>
            </div>
          </OracleCard>

          {/* Current cycle */}
          <OracleCard>
            <OracleLabel>CURRENT CYCLE — {now.getFullYear()}</OracleLabel>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <MiniBox label="PERSONAL YEAR" color={T.orange}>
                <BigNumber n={profile.py} color={T.orange} size={36} />
              </MiniBox>
              <MiniBox label="PERSONAL MONTH" color={T.orangeHi}>
                <BigNumber n={profile.pm} color={T.orangeHi} size={36} />
              </MiniBox>
              <MiniBox label="LUCKY NUMBER" color={T.purple}>
                <BigNumber n={profile.lk.lucky} color={T.purple} size={36} />
              </MiniBox>
              <MiniBox label="YEAR STATUS" color={profile.ys.color}>
                <div style={{ fontSize: "12px", fontWeight: "bold", color: profile.ys.color }}>
                  {profile.ys.label}
                </div>
              </MiniBox>
            </div>
            <p style={{ fontSize: "12px", color: T.textMid, lineHeight: 1.7, marginTop: "12px" }}>
              {profile.ys.advice}
            </p>
          </OracleCard>

          {/* Personal month advice */}
          {getPersonalMonthInfo(profile.pm) && (
            <OracleCard>
              <OracleLabel>PERSONAL MONTH {profile.pm} — {getPersonalMonthInfo(profile.pm)?.label}</OracleLabel>
              <p style={{ fontSize: "13px", lineHeight: 1.7, color: T.textMid, marginBottom: "10px" }}>
                {getPersonalMonthInfo(profile.pm)?.advice}
              </p>
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  background: `${T.orange}22`,
                  border: `1px solid ${T.orange}66`,
                  borderRadius: "20px",
                  color: T.orange,
                  fontSize: "11px",
                  letterSpacing: "2px",
                  fontWeight: "bold",
                }}
              >
                {getPersonalMonthInfo(profile.pm)?.action}
              </div>
            </OracleCard>
          )}

          {/* Zodiac grid */}
          <OracleCard>
            <OracleLabel>ZODIAC SIGNATURE</OracleLabel>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                style={{
                  background: `${T.orange}0f`,
                  border: `1px solid ${T.orange}30`,
                  borderRadius: "8px",
                  padding: "14px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "36px", display: "inline-flex" }}>
                  <ZodiacEmojiButton sign={profile.bz} size={36} />
                </div>
                <div style={{ fontSize: "10px", color: T.textDim, marginTop: "4px" }}>CHINESE · TAP TO LEARN</div>
                <div style={{ fontSize: "14px", color: T.orange, fontWeight: "bold" }}>
                  {profile.bz.name}
                </div>
                <div style={{ fontSize: "10px", color: T.textDim, marginTop: "4px" }}>
                  Friends: {profile.bz.friends.join(", ")}
                </div>
                <div style={{ fontSize: "10px", color: T.red, marginTop: "2px" }}>
                  Enemy: {profile.bz.enemy}
                </div>
              </div>
              <div
                style={{
                  background: `${T.orangeHi}0f`,
                  border: `1px solid ${T.orangeHi}30`,
                  borderRadius: "8px",
                  padding: "14px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "36px" }}>{profile.wz.emoji}</div>
                <div style={{ fontSize: "10px", color: T.textDim, marginTop: "4px" }}>WESTERN</div>
                <div style={{ fontSize: "14px", color: T.orangeHi, fontWeight: "bold" }}>
                  {profile.wz.name}
                </div>
                <div style={{ fontSize: "10px", color: T.textDim, marginTop: "4px" }}>
                  {profile.wz.element} · {profile.wz.modality}
                </div>
                <div style={{ fontSize: "10px", color: T.textDim, marginTop: "2px" }}>
                  Ruled by {profile.wz.planet}
                </div>
              </div>
              <div
                style={{
                  background: `${T.purple}0f`,
                  border: `1px solid ${T.purple}30`,
                  borderRadius: "8px",
                  padding: "14px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "36px" }}>🔢</div>
                <div style={{ fontSize: "10px", color: T.textDim, marginTop: "4px" }}>LUCKY DIGITS</div>
                <div
                  style={{
                    fontSize: "24px",
                    color: T.purple,
                    fontWeight: 900,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {profile.lk.lucky}
                </div>
                <div style={{ fontSize: "10px", color: T.textDim, marginTop: "4px" }}>
                  Month digit {profile.lk.first} + Year digit {profile.lk.last}
                </div>
              </div>
            </div>
          </OracleCard>

          {/* Today's energy */}
          <OracleCard>
            <OracleLabel>TODAY&apos;S UNIVERSAL ENERGY</OracleLabel>
            {(() => {
              const today = new Date();
              const todayLP = calcLP(today.getMonth() + 1, today.getDate(), today.getFullYear());
              const info = DAILY_DESC[todayLP];
              if (!info) return null;
              return (
                <>
                  <div className="flex items-center gap-4 mb-3">
                    <BigNumber n={todayLP} color={T.orange} size={48} />
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "bold", color: T.orange, letterSpacing: "1px" }}>
                        {info.energy}
                      </div>
                      <div style={{ fontSize: "10px", color: T.textDim, marginTop: "2px" }}>
                        {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: "13px", lineHeight: 1.7, color: T.textMid, marginBottom: "10px" }}>
                    {info.desc}
                  </p>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      background: `${T.orange}22`,
                      border: `1px solid ${T.orange}66`,
                      borderRadius: "20px",
                      color: T.orange,
                      fontSize: "11px",
                      letterSpacing: "2px",
                      fontWeight: "bold",
                    }}
                  >
                    {info.action}
                  </div>
                  <p style={{ fontSize: "10px", color: T.red, marginTop: "10px" }}>
                    Avoid: {info.avoid}
                  </p>
                </>
              );
            })()}
          </OracleCard>

          {/* Life Path detail grid */}
          <OracleCard>
            <OracleLabel>LIFE PATH {profile.lp} — DEEP DIVE</OracleLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MiniBox label="STRENGTHS" color={T.orange}>
                <div style={{ fontSize: "12px", color: T.text, marginTop: 4 }}>{profile.lpd?.strengths}</div>
              </MiniBox>
              <MiniBox label="SHADOW" color={T.red}>
                <div style={{ fontSize: "12px", color: T.text, marginTop: 4 }}>{profile.lpd?.shadow}</div>
              </MiniBox>
              <MiniBox label="WEALTH" color={T.green}>
                <div style={{ fontSize: "12px", color: T.text, marginTop: 4 }}>{profile.lpd?.wealth}</div>
              </MiniBox>
              <MiniBox label="CAREER" color={T.orangeHi}>
                <div style={{ fontSize: "12px", color: T.text, marginTop: 4 }}>{profile.lpd?.career}</div>
              </MiniBox>
              <MiniBox label="LOVE" color={T.purple}>
                <div style={{ fontSize: "12px", color: T.text, marginTop: 4 }}>{profile.lpd?.love}</div>
              </MiniBox>
              <MiniBox label="FAMOUS" color={T.blue}>
                <div style={{ fontSize: "12px", color: T.text, marginTop: 4 }}>{profile.lpd?.famous}</div>
              </MiniBox>
            </div>
          </OracleCard>

          {/* LP calc trace */}
          <OracleCard>
            <OracleLabel>HOW YOUR LIFE PATH IS CALCULATED</OracleLabel>
            <div style={{ fontSize: "12px", color: T.textMid, lineHeight: 1.9 }}>
              <p>
                Birth date: <strong style={{ color: T.orange }}>{profile.m}/{profile.d}/{profile.y}</strong>
              </p>
              <p>
                All digits summed:{" "}
                <strong style={{ color: T.orange }}>
                  {`${profile.m}${profile.d}${profile.y}`.split("").join(" + ")} ={" "}
                  {`${profile.m}${profile.d}${profile.y}`.split("").reduce((a, b) => a + Number(b), 0)}
                </strong>
              </p>
              <p>
                Final Life Path:{" "}
                <strong style={{ color: T.orange }}>{profile.lp}</strong>
                {[11, 22, 33].includes(profile.lp) && (
                  <span style={{ color: T.orangeHi }}> (Master Number — not reduced)</span>
                )}
              </p>
              <p>
                Lucky number: first digit of month ({profile.lk.first}) + last digit of year ({profile.lk.last}) ={" "}
                <strong style={{ color: T.purple }}>{profile.lk.lucky}</strong>
              </p>
            </div>
          </OracleCard>

          <OracleHr />
          <p style={{ fontSize: "11px", color: T.textDim, textAlign: "center", padding: "6px 0" }}>
            * All calculations follow strict strict numerology methodology · Master Numbers 11/22/33 preserved · Personal Year is birthday-aware
          </p>
        </>
      )}
    </div>
  );
}

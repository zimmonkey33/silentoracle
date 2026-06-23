"use client";

import { useEffect, useState } from "react";
import { T } from "@/lib/oracle/theme";
import { calcDayLP, calcSecondaryEnergy, getZodiac, reduceLP } from "@/lib/oracle/calc";
import { LP, DAILY_DESC } from "@/lib/oracle/data";
import { OracleCard, OracleLabel, BigNumber, MiniBox, OracleHr } from "./primitives";

export function DailyEnergyTab() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
  }, []);

  if (!now) {
    return (
      <OracleCard>
        <div style={{ textAlign: "center", padding: "30px 10px" }}>
          <div style={{ fontSize: "32px" }} className="oracle-pulse">
            🔮
          </div>
          <p style={{ fontSize: "12px", color: T.textDim, marginTop: "10px" }}>Loading today's energy...</p>
        </div>
      </OracleCard>
    );
  }

  const primary = calcDayLP(now);
  const secondary = calcSecondaryEnergy(now);
  const todayZodiac = getZodiac(now.getMonth() + 1, now.getDate(), now.getFullYear());
  const info = DAILY_DESC[primary];
  const lpInfo = LP[primary] || LP[reduceLP(primary)];
  const secondaryInfo = LP[secondary] || LP[reduceLP(secondary)];

  // Tomorrow + yesterday previews
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowLP = calcDayLP(tomorrow);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayLP = calcDayLP(yesterday);

  const nowStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div>
      <OracleCard highlight>
        <div style={{ textAlign: "center" }}>
          <OracleLabel>{nowStr}</OracleLabel>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>{todayZodiac.emoji}</div>
          <div style={{ fontSize: "11px", color: T.textDim, letterSpacing: "2px" }}>
            YEAR OF THE {todayZodiac.name.toUpperCase()}
          </div>
          <div style={{ margin: "16px 0" }}>
            <BigNumber n={primary} color={T.orange} size={96} />
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: T.orange,
              letterSpacing: "2px",
              marginBottom: "10px",
            }}
          >
            {info?.energy || "UNIVERSAL ENERGY"}
          </div>
          <p style={{ fontSize: "13px", lineHeight: 1.7, color: T.textMid, marginBottom: "14px", maxWidth: "560px", margin: "0 auto 14px" }}>
            {info?.desc}
          </p>
          <div
            style={{
              display: "inline-block",
              padding: "8px 16px",
              background: `${T.orange}22`,
              border: `1px solid ${T.orange}66`,
              borderRadius: "20px",
              color: T.orange,
              fontSize: "12px",
              letterSpacing: "2px",
              fontWeight: "bold",
            }}
          >
            {info?.action}
          </div>
          <p style={{ fontSize: "11px", color: T.red, marginTop: "14px" }}>
            Avoid: {info?.avoid}
          </p>
        </div>
      </OracleCard>

      {/* Primary vs Secondary energy */}
      <OracleCard>
        <OracleLabel>TODAY&apos;S ENERGY SIGNATURE</OracleLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MiniBox label="PRIMARY ENERGY (Day LP)" color={T.orange}>
            <BigNumber n={primary} color={T.orange} size={48} />
            <div style={{ fontSize: "12px", color: T.orange, fontWeight: "bold", marginTop: "6px" }}>
              {lpInfo?.title}
            </div>
            <div style={{ fontSize: "18px", marginTop: "4px" }}>{lpInfo?.emoji}</div>
          </MiniBox>
          <MiniBox label="SECONDARY ENERGY (Day reduced)" color={T.orangeHi}>
            <BigNumber n={secondary} color={T.orangeHi} size={48} />
            <div style={{ fontSize: "12px", color: T.orangeHi, fontWeight: "bold", marginTop: "6px" }}>
              {secondaryInfo?.title}
            </div>
            <div style={{ fontSize: "18px", marginTop: "4px" }}>{secondaryInfo?.emoji}</div>
          </MiniBox>
        </div>
        <p style={{ fontSize: "11px", color: T.textDim, marginTop: "12px", lineHeight: 1.7 }}>
          Primary = month + day + year, all digits summed and reduced. Secondary = day-of-month alone, reduced.
          When primary and secondary align (same number), the day&apos;s energy is amplified.
        </p>
      </OracleCard>

      {/* 3-day preview */}
      <OracleCard>
        <OracleLabel>3-DAY ENERGY WAVE</OracleLabel>
        <div className="grid grid-cols-3 gap-2">
          <div
            style={{
              background: `${T.textDim}0f`,
              border: `1px solid ${T.textDim}30`,
              borderRadius: "8px",
              padding: "14px 8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "9px", color: T.textDim, letterSpacing: "2px" }}>YESTERDAY</div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: 900,
                color: T.textDim,
                fontFamily: "Georgia, serif",
                marginTop: "4px",
              }}
            >
              {yesterdayLP}
            </div>
            <div style={{ fontSize: "9px", color: T.textDim, marginTop: "4px" }}>
              {LP[yesterdayLP]?.title || LP[reduceLP(yesterdayLP)]?.title}
            </div>
          </div>
          <div
            style={{
              background: `${T.orange}22`,
              border: `1px solid ${T.orange}`,
              borderRadius: "8px",
              padding: "14px 8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "9px", color: T.orange, letterSpacing: "2px", fontWeight: "bold" }}>TODAY</div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: 900,
                color: T.orange,
                fontFamily: "Georgia, serif",
                marginTop: "4px",
              }}
            >
              {primary}
            </div>
            <div style={{ fontSize: "9px", color: T.orange, marginTop: "4px" }}>{lpInfo?.title}</div>
          </div>
          <div
            style={{
              background: `${T.orangeDim}0f`,
              border: `1px solid ${T.orangeDim}30`,
              borderRadius: "8px",
              padding: "14px 8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "9px", color: T.orangeDim, letterSpacing: "2px" }}>TOMORROW</div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: 900,
                color: T.orangeHi,
                fontFamily: "Georgia, serif",
                marginTop: "4px",
              }}
            >
              {tomorrowLP}
            </div>
            <div style={{ fontSize: "9px", color: T.textDim, marginTop: "4px" }}>
              {LP[tomorrowLP]?.title || LP[reduceLP(tomorrowLP)]?.title}
            </div>
          </div>
        </div>
      </OracleCard>

      {/* All 12 energy numbers reference */}
      <OracleCard>
        <OracleLabel>ALL ENERGY NUMBERS — TAP A NUMBER TO SEE ITS MEANING</OracleLabel>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {Object.entries(DAILY_DESC).map(([num, data]) => {
            const active = Number(num) === primary;
            return (
              <div
                key={num}
                style={{
                  background: active ? `${T.orange}22` : "#0f0900",
                  border: `1px solid ${active ? T.orange : T.border}`,
                  borderRadius: "8px",
                  padding: "12px 4px",
                  textAlign: "center",
                  transition: "all 0.15s",
                }}
              >
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 900,
                    color: active ? T.orange : T.textMid,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {num}
                </div>
                <div style={{ fontSize: "8px", color: T.textDim, marginTop: "2px", lineHeight: 1.3 }}>
                  {data.energy.split(" ")[0]}
                </div>
              </div>
            );
          })}
        </div>
      </OracleCard>

      <OracleHr />
      <p style={{ fontSize: "11px", color: T.textDim, textAlign: "center", padding: "6px 0" }}>
        * Universal energy updates at midnight local time · Master Numbers 11/22/33 carry amplified spiritual weight
      </p>
    </div>
  );
}

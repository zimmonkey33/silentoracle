"use client";

import { ReactNode } from "react";
import { T } from "@/lib/oracle/theme";

/** Orange-glow card container used throughout the Silent Oracle UI. */
export function OracleCard({
  children,
  highlight = false,
  className = "",
  style = {},
}: {
  children: ReactNode;
  highlight?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-[10px] p-5 mb-3 ${className}`}
      style={{
        background: T.card,
        border: `1px solid ${highlight ? T.orange + "88" : T.border}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Small uppercase letter-spaced label. */
export function OracleLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`block uppercase mb-2 ${className}`}
      style={{ fontSize: "9px", letterSpacing: "3px", color: T.textDim }}
    >
      {children}
    </span>
  );
}

/** Big bold number with optional color glow. */
export function BigNumber({ n, color = T.orange, size = 72 }: { n: number | string; color?: string; size?: number }) {
  return (
    <div
      style={{
        fontSize: `${size}px`,
        fontWeight: 900,
        color,
        lineHeight: 1,
        textShadow: `0 0 50px ${color}55`,
        fontFamily: "Georgia, serif",
      }}
    >
      {n}
    </div>
  );
}

/** Mini info box (used in grids). */
export function MiniBox({
  label,
  color = T.orange,
  children,
}: {
  label: string;
  color?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        background: `${color}0f`,
        border: `1px solid ${color}30`,
        borderRadius: "8px",
        padding: "12px",
        textAlign: "center",
      }}
    >
      {children}
      <div
        className="uppercase"
        style={{ fontSize: "9px", letterSpacing: "3px", color: T.textDim, marginTop: "6px" }}
      >
        {label}
      </div>
    </div>
  );
}

/** Pill-style trait badge. */
export function Trait({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 9px",
        background: "#1a0d00",
        border: `1px solid ${T.border}`,
        borderRadius: "20px",
        fontSize: "10px",
        margin: "2px",
        color: T.textMid,
      }}
    >
      {children}
    </span>
  );
}

/** Orange-gradient solid button. */
export function OracleButton({
  children,
  onClick,
  disabled = false,
  color = T.orange,
  textColor = "#000",
  fullWidth = true,
  style = {},
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  color?: string;
  textColor?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="transition-opacity hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
        border: "none",
        borderRadius: "7px",
        padding: "12px 20px",
        color: textColor,
        fontSize: "10px",
        letterSpacing: "3px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 900,
        width: fullWidth ? "100%" : "auto",
        marginTop: "10px",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/** Outline button (transparent background, orange border). */
export function OracleOutlineButton({
  children,
  onClick,
  disabled = false,
  color = T.orange,
  fullWidth = true,
  style = {},
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  color?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="transition-opacity hover:opacity-85 disabled:opacity-50"
      style={{
        background: "transparent",
        border: `1px solid ${color}`,
        borderRadius: "7px",
        padding: "12px 20px",
        color,
        fontSize: "10px",
        letterSpacing: "3px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 900,
        width: fullWidth ? "100%" : "auto",
        marginTop: "10px",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/** Standard text input. */
export function OracleInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { style, ...rest } = props;
  return (
    <input
      {...rest}
      style={{
        width: "100%",
        background: "#0a0600",
        border: `1px solid ${T.border}`,
        borderRadius: "7px",
        padding: "11px 14px",
        color: T.text,
        fontSize: "15px",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
        ...style,
      }}
    />
  );
}

/** Standard textarea. */
export function OracleTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { style, ...rest } = props;
  return (
    <textarea
      {...rest}
      style={{
        width: "100%",
        background: "#0a0600",
        border: `1px solid ${T.border}`,
        borderRadius: "7px",
        padding: "11px 14px",
        color: T.text,
        fontSize: "15px",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
        fontFamily: "inherit",
        ...style,
      }}
    />
  );
}

/** Hairline divider. */
export function OracleHr() {
  return <hr style={{ border: "none", borderTop: `1px solid ${T.border}`, margin: "14px 0" }} />;
}

/** Entity icon — uses logo.dev for known domains, falls back to colored initials avatar. */
export function EntityIcon({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <img
      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
        name.split(" ").slice(0, 2).map((w) => w[0] || "").join("").toUpperCase() || "?"
      )}&background=FF7A00&color=fff&size=${size}&bold=true&font-size=0.45`}
      alt={name}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        objectFit: "cover",
        flexShrink: 0,
        background: "#1a0d00",
      }}
      loading="lazy"
    />
  );
}

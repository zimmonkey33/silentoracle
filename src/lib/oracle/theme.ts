// Auto-extracted from silent-oracle.jsx — orange/dark "Silent Oracle" theme tokens.
// These are plain CSS color strings; import as `import { T } from "@/lib/oracle/theme"`.
export const T = {
  bg:        "#080500",
  bg2:       "#0f0a00",
  bg3:       "#160e00",
  card:      "#120c00",
  border:    "#2a1800",
  borderHi:  "#FF7A00",
  orange:    "#FF7A00",
  orangeHi:  "#FFB340",
  orangeDim: "#7a3a00",
  text:      "#FFFFFF",
  textDim:   "#888888",
  textMid:   "#CCCCCC",
  white:     "#FFFFFF",
  red:       "#FF4444",
  green:     "#44FF88",
  purple:    "#C084FC",
  blue:      "#60A5FA",
} as const;

export type ThemeColor = typeof T[keyof typeof T];

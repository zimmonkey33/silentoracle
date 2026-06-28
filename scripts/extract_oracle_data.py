#!/usr/bin/env python3
"""Extract data tables and helper functions from silent-oracle.jsx into TypeScript modules."""
import re
from pathlib import Path

SRC = Path("/home/z/my-project/upload/silent-oracle (4).jsx")
OUT_DIR = Path("/home/z/my-project/src/lib/oracle")
OUT_DIR.mkdir(parents=True, exist_ok=True)

text = SRC.read_text()
lines = text.splitlines(keepends=True)


def slice_by_line_markers(start_pattern, end_pattern, start_offset=0):
    """Return text between first line matching start_pattern (the literal start of an object/array)
    and the matching closing brace/bracket (inclusive). The start line is replaced with just the
    opening `{` or `[` so the result is a clean object/array literal suitable for TS expression context."""
    start_re = re.compile(start_pattern)
    end_re = re.compile(end_pattern)
    start_idx = None
    for i, line in enumerate(lines):
        if start_re.search(line):
            start_idx = i + start_offset
            break
    if start_idx is None:
        raise ValueError(f"start not found: {start_pattern}")
    end_idx = None
    for j in range(start_idx + 1, len(lines)):
        if end_re.search(lines[j]):
            end_idx = j + 1
            break
    if end_idx is None:
        raise ValueError(f"end not found: {end_pattern}")
    # Replace the start line with just the opening brace/bracket to drop the "const X = " prefix
    first_line = lines[start_idx]
    open_char = "{" if "{" in first_line and "[" not in first_line else ("[" if "[" in first_line else "{")
    body = "".join(lines[start_idx + 1:end_idx])
    return open_char + "\n" + body


# 1. LP (Life Path data)
lp_block = slice_by_line_markers(r"^const LP = \{", r"^\};", 0)
# 2. CZ (Chinese Zodiac)
cz_block = slice_by_line_markers(r"^const CZ = \[", r"^\];", 0)
# 3. CNY (Chinese New Year dates)
cny_block = slice_by_line_markers(r"^const CNY = \{", r"^};", 0)
# 4. WZ (Western Zodiac)
wz_block = slice_by_line_markers(r"^const WZ = \[", r"^\];", 0)
# 5. ENTITIES
entities_block = slice_by_line_markers(r"^const ENTITIES = \[", r"^\];", 0)
# 6. DOMAIN_MAP
domain_map_block = slice_by_line_markers(r"^const DOMAIN_MAP = \{", r"^};", 0)
# 7. TYPE_EMOJI
type_emoji_block = slice_by_line_markers(r"^const TYPE_EMOJI = \{", r"^};", 0)
# 8. DAILY_DESC
daily_desc_block = slice_by_line_markers(r"^const DAILY_DESC = \{", r"^};", 0)
# 9. ENTITY_IMAGES
entity_images_block = slice_by_line_markers(r"^const ENTITY_IMAGES = \{", r"^};", 0)
# 10. PM_DATA
pm_data_block = slice_by_line_markers(r"^const PM_DATA = \{", r"^};", 0)

# Write theme.ts
(OUT_DIR / "theme.ts").write_text("""// Auto-extracted from silent-oracle.jsx — orange/dark "Silent Oracle" theme tokens.
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
""")

# Write data.ts — combined data tables with `as const` and typed exports
data_ts = f"""// Auto-extracted from silent-oracle.jsx.
// Static data tables for the Silent Oracle feature set.

export interface LifePathInfo {{
  title: string; emoji: string; color: string;
  traits: string[];
  desc: string;
  shadow: string;
  strengths: string;
  wealth: string;
  love: string;
  career: string;
  famous: string;
}}

export const LP: Record<number, LifePathInfo> = {lp_block.rstrip()};

export interface ChineseZodiacInfo {{
  name: string; emoji: string; year1: number;
  traits: string[]; desc: string;
  friends: string[]; enemy: string; soulmate: string | null;
}}

export const CZ: ChineseZodiacInfo[] = {cz_block.rstrip()};

export const CNY: Record<number, [number, number]> = {cny_block.rstrip()};

export interface WesternZodiacInfo {{
  name: string; symbol: string; dates: string;
  element: string; modality: string; planet: string;
  color: string; emoji: string;
  traits: string[]; desc: string;
  compatible: string[]; shadow: string;
}}

export const WZ: WesternZodiacInfo[] = {wz_block.rstrip()};

export interface EntityEntry {{
  name: string; date: string; type: string; notes: string;
}}

export const ENTITIES: EntityEntry[] = {entities_block.rstrip()};

export const DOMAIN_MAP: Record<string, string> = {domain_map_block.rstrip()};

export const TYPE_EMOJI: Record<string, string> = {type_emoji_block.rstrip()};

export interface DailyEnergyInfo {{
  energy: string; desc: string; action: string; avoid: string;
}}

export const DAILY_DESC: Record<number, DailyEnergyInfo> = {daily_desc_block.rstrip()};

export const ENTITY_IMAGES: Record<string, string> = {entity_images_block.rstrip()};

export interface PersonalMonthInfo {{
  label: string; color: string; advice: string; action: string;
}}

export const PM_DATA: Record<number, PersonalMonthInfo> = {pm_data_block.rstrip()};
"""
(OUT_DIR / "data.ts").write_text(data_ts)

# Write calc.ts — calculation helpers, typed
calc_ts = '''// Auto-extracted & typed from silent-oracle.jsx.
import { CZ, CNY, LP, PM_DATA, ENTITY_IMAGES, TYPE_EMOJI, WZ, type ChineseZodiacInfo, type LifePathInfo, type PersonalMonthInfo, type WesternZodiacInfo } from "./data";
import { T } from "./theme";

/** Reduce a number to 1-9, preserving master numbers 11/22/33. */
export function reduceLP(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split("").reduce((a, b) => a + Number(b), 0);
  }
  return n;
}

/** Life Path: concatenate all digits of full birth date, then reduce. */
export function calcLP(m: number, d: number, y: number): number {
  const sum = `${m}${d}${y}`.split("").map(Number).reduce((a, b) => a + b, 0);
  return reduceLP(sum);
}

/** Personal Year — birthday-aware (changes on birthday, not Jan 1). */
export function calcPersonalYear(m: number, d: number, today: Date): number {
  const currentYear = today.getFullYear();
  const birthdayThisYear = new Date(currentYear, m - 1, d);
  const yearToUse = today < birthdayThisYear ? currentYear - 1 : currentYear;
  return reduceLP(m + d + yearToUse);
}

/** Day Life Path: today's universal energy number. */
export function calcDayLP(date: Date): number {
  const m = date.getMonth() + 1, d = date.getDate(), y = date.getFullYear();
  return reduceLP(m + d + y);
}

/** Secondary energy: digits of the day reduced (master numbers preserved). */
export function calcSecondaryEnergy(date: Date): number {
  const d = date.getDate();
  return reduceLP(d);
}

/** Lucky Number = first digit of birth MONTH + last digit of birth YEAR. */
export function luckyNums(month: number, year: number): { first: number; last: number; lucky: number; month: number; year: number } {
  const first = Number(String(month)[0]);
  const last  = Number(String(year).slice(-1));
  const lucky = first * 10 + last;
  return { first, last, lucky, month, year };
}

/** Chinese zodiac sign for a Gregorian date (CNY-aware). */
export function getZodiac(m: number, d: number, y: number): ChineseZodiacInfo {
  const cny = CNY[y];
  let zy = y;
  if (cny && (m < cny[0] || (m === cny[0] && d < cny[1]))) zy = y - 1;
  return CZ[((zy - 1924) % 12 + 12) % 12];
}

export interface YearStatus {
  label: string; color: string; type: "own" | "friend" | "enemy" | "neutral"; advice: string;
}

export function yearStatus(lp: number, py: number, bz: ChineseZodiacInfo | undefined, yz: ChineseZodiacInfo | undefined): YearStatus {
  if (py === lp)                          return { label: "OWN YEAR",    color: T.orange,  type: "own",     advice: "GO HARD. Start the business. Make the moves. Sleep less, live more. This is YOUR year." };
  if (bz?.friends?.includes(yz?.name ?? ""))   return { label: "FRIEND YEAR",  color: T.green,   type: "friend",  advice: "Strong energy. Go big. Start what you've been planning. Hesitate less, do more." };
  if (bz?.enemy === yz?.name)            return { label: "ENEMY YEAR",   color: T.red,     type: "enemy",   advice: "LAY LOW. Avoid risky moves, new ventures, flexing. Save money. Build for next cycle." };
  return                                         { label: "NEUTRAL YEAR", color: T.purple,  type: "neutral", advice: "Moderate energy. Plan, consolidate, and wait for a friend year for major moves." };
}

export interface ZodiacRelation {
  rel: "friend" | "enemy" | "neutral"; label: string; color: string;
}

export function zodiacRelation(userZodiac: ChineseZodiacInfo | undefined, entityZodiac: ChineseZodiacInfo | undefined): ZodiacRelation | null {
  if (!userZodiac || !entityZodiac) return null;
  if (userZodiac.friends?.includes(entityZodiac.name)) return { rel: "friend",  label: "FRIEND",  color: T.green };
  if (userZodiac.enemy === entityZodiac.name)          return { rel: "enemy",   label: "ENEMY",   color: T.red   };
  return                                                      { rel: "neutral",  label: "NEUTRAL", color: T.purple };
}

export function getWesternZodiac(month: number, day: number): WesternZodiacInfo {
  const m = month, d = day;
  if ((m===3&&d>=21)||(m===4&&d<=19)) return WZ[0];
  if ((m===4&&d>=20)||(m===5&&d<=20)) return WZ[1];
  if ((m===5&&d>=21)||(m===6&&d<=20)) return WZ[2];
  if ((m===6&&d>=21)||(m===7&&d<=22)) return WZ[3];
  if ((m===7&&d>=23)||(m===8&&d<=22)) return WZ[4];
  if ((m===8&&d>=23)||(m===9&&d<=22)) return WZ[5];
  if ((m===9&&d>=23)&&(m===10&&d<=22)) return WZ[6];
  if ((m===10&&d>=23)||(m===11&&d<=21)) return WZ[7];
  if ((m===11&&d>=22)||(m===12&&d<=21)) return WZ[8];
  if ((m===12&&d>=22)||(m===1&&d<=19)) return WZ[9];
  if ((m===1&&d>=20)||(m===2&&d<=18)) return WZ[10];
  return WZ[11];
}

export function parseEntityDate(ds: string): { y: number; m: number; d: number; lp: number; zodiac: ChineseZodiacInfo; lucky: { first: number; last: number; lucky: number; month: number; year: number } } {
  const [y, m, d] = ds.split("-").map(Number);
  return { y, m, d, lp: calcLP(m, d, y), zodiac: getZodiac(m, d, y), lucky: luckyNums(m, y) };
}

export function calcPersonalMonth(py: number, currentMonth: number): number {
  return reduceLP(py + currentMonth);
}

export function getLifePathInfo(lp: number): LifePathInfo | undefined {
  return LP[lp] ?? LP[reduceLP(lp)];
}

export function getPersonalMonthInfo(pm: number): PersonalMonthInfo | undefined {
  return PM_DATA[pm];
}

/** Returns a logo image URL (logo.dev) for a known entity name, or an avatar URL for unknown names. */
export function getEntityImage(name: string, type?: string): string {
  const domain = ENTITY_IMAGES[name];
  if (domain) {
    return "https://img.logo.dev/" + domain + "?token=pk_X6E3lMVNShqMVUu04xBsGA&size=128&format=png";
  }
  const emoji = type ? (TYPE_EMOJI[type] || TYPE_EMOJI[type.split("/")[0] + "/Person"]) : undefined;
  if (emoji) {
    // Return a data URL style fallback — but for simplicity, return avatar URL
  }
  const initials = name.split(" ").slice(0, 2).map(w => w[0] || "").join("").toUpperCase() || "?";
  const colors = ["FF7A00", "FF5500", "FFB340", "CC6600", "FF9500"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return "https://ui-avatars.com/api/?name=" + encodeURIComponent(initials) + "&background=" + color + "&color=fff&size=128&bold=true&font-size=0.45";
}
'''
(OUT_DIR / "calc.ts").write_text(calc_ts)

print("Wrote files:")
for p in sorted(OUT_DIR.iterdir()):
    print(f"  {p} ({p.stat().st_size} bytes)")

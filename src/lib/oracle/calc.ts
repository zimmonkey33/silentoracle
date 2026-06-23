// Auto-extracted & typed from silent-oracle.jsx.
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
  if ((m===9&&d>=23)||(m===10&&d<=22)) return WZ[6];
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

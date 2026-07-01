/**
 * Numerology Engine — Strict Methodology
 * ----------------------------------------------------------------------
 * Per the the reference spec:
 *   - Pythagorean chart (1-9) used for ALL name calculations by default
 *   - Master Numbers: ONLY 11, 22, 33 (44→8, 55→1, 66→3, 77→5, 88→7, 99→9)
 *   - Karmic Debt: 13/4, 14/5, 16/7, 19/1 — flagged BEFORE reducing
 *   - Personal Year is BIRTHDAY-AWARE (changes on birthday, not Jan 1)
 *   - Life Path = sum ALL digits of MMDDYYYY straight-across
 *   - Soul Urge = vowels only (Y is vowel when no adjacent vowel)
 *   - Lucky Number = single name component (one name, not full)
 *   - Expression = FULL birth name (First + Middle + Last)
 *   - Pinnacles: for Master LP, use base digit (33→6) for duration calc
 */

import {
  MASTER_NUMBERS,
  KARMIC_DEBT,
  isKarmicDebt,
  reduceNumberStrict,
  reduceWithCompoundStrict,
  getCompoundMeaning,
  isMasterNumber,
  getKarmicDebtInfo,
  isWealthCompound,
  getMoneyCategory,
} from "./compound";

export {
  MASTER_NUMBERS,
  KARMIC_DEBT,
  isKarmicDebt,
  reduceNumberStrict,
  reduceWithCompoundStrict,
  getCompoundMeaning,
  isMasterNumber,
  getKarmicDebtInfo,
  isWealthCompound,
  getMoneyCategory,
};

// ─── Pythagorean chart (the default) ────────────────────────────────
// 1 = A J S
// 2 = B K T
// 3 = C L U
// 4 = D M V
// 5 = E N W
// 6 = F O X
// 7 = G P Y
// 8 = H Q Z
// 9 = I R
export const PYTHAGOREAN: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

export const VOWELS = new Set(["A", "E", "I", "O", "U"]);

// Y is a vowel ONLY when there is no other vowel in the syllable/word.
// Example: "Lynn" → Y is vowel. "Kyle" → Y is vowel. "Smith" → Y is consonant.
export function isVowel(ch: string, wordHasOtherVowel: boolean): boolean {
  const U = ch.toUpperCase();
  if (VOWELS.has(U)) return true;
  if (U === "Y") return !wordHasOtherVowel;
  return false;
}

// ─── Reduction helpers ──────────────────────────────────────────────
export function reduceNumber(n: number): number {
  return reduceNumberStrict(n);
}

export function reduceWithCompound(n: number): { root: number; compound: number } {
  const r = reduceWithCompoundStrict(n);
  return { root: r.root, compound: r.compound };
}

// ─── Letter math helpers ─────────────────────────────────────────────
function cleanName(name: string): string {
  return (name || "")
    .toUpperCase()
    .replace(/[^A-Z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function letterValue(ch: string): number {
  return PYTHAGOREAN[ch.toUpperCase()] ?? 0;
}

/**
 * Silent Oracle name math (Pythagorean default).
 * Sums all letter values in the given name string.
 */
export function nameToNumber(name: string): number {
  const clean = cleanName(name);
  if (!clean) return 0;
  let sum = 0;
  for (const ch of clean) if (ch !== " ") sum += letterValue(ch);
  return sum;
}

/** Sum of vowels only (Soul Urge). Pythagorean. */
export function vowelsToNumber(name: string): number {
  const clean = cleanName(name);
  if (!clean) return 0;
  const words = clean.split(" ");
  let sum = 0;
  for (const w of words) {
    const hasOther = /[AEIOU]/.test(w);
    for (const ch of w) {
      if (isVowel(ch, hasOther)) sum += letterValue(ch);
    }
  }
  return sum;
}

/** Sum of consonants only (Personality). Pythagorean. */
export function consonantsToNumber(name: string): number {
  const clean = cleanName(name);
  if (!clean) return 0;
  const words = clean.split(" ");
  let sum = 0;
  for (const w of words) {
    const hasOther = /[AEIOU]/.test(w);
    for (const ch of w) {
      if (!isVowel(ch, hasOther)) sum += letterValue(ch);
    }
  }
  return sum;
}

// ─── Calculation-string helpers (for transparent UI display) ────────
// Each returns { sum, calculation } where calculation is a human-readable
// string showing the step-by-step derivation.

export interface NameCalc { sum: number; calculation: string }

export function nameToNumberWithCalc(name: string): NameCalc {
  const clean = cleanName(name);
  if (!clean) return { sum: 0, calculation: "" };
  let sum = 0;
  const letters: string[] = [];
  const values: number[] = [];
  for (const ch of clean) {
    if (ch === " ") continue;
    const v = letterValue(ch);
    sum += v;
    letters.push(ch);
    values.push(v);
  }
  return { sum, calculation: `${letters.join("+")} = ${values.join("+")} = ${sum}` };
}

export function vowelsToNumberWithCalc(name: string): NameCalc {
  const clean = cleanName(name);
  if (!clean) return { sum: 0, calculation: "" };
  const words = clean.split(" ");
  let sum = 0;
  const letters: string[] = [];
  const values: number[] = [];
  for (const w of words) {
    const hasOther = /[AEIOU]/.test(w);
    for (const ch of w) {
      if (isVowel(ch, hasOther)) {
        const v = letterValue(ch);
        sum += v;
        letters.push(ch);
        values.push(v);
      }
    }
  }
  if (letters.length === 0) return { sum: 0, calculation: "no vowels found" };
  return { sum, calculation: `vowels: ${letters.join("+")} = ${values.join("+")} = ${sum}` };
}

export function consonantsToNumberWithCalc(name: string): NameCalc {
  const clean = cleanName(name);
  if (!clean) return { sum: 0, calculation: "" };
  const words = clean.split(" ");
  let sum = 0;
  const letters: string[] = [];
  const values: number[] = [];
  for (const w of words) {
    const hasOther = /[AEIOU]/.test(w);
    for (const ch of w) {
      if (!isVowel(ch, hasOther)) {
        const v = letterValue(ch);
        sum += v;
        letters.push(ch);
        values.push(v);
      }
    }
  }
  if (letters.length === 0) return { sum: 0, calculation: "no consonants found" };
  return { sum, calculation: `consonants: ${letters.join("+")} = ${values.join("+")} = ${sum}` };
}

// ─── Date math ──────────────────────────────────────────────────────
export interface BirthDate {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
}

/**
 * Silent Oracle LIFE PATH — STRICT STRAIGHT-ACROSS METHOD
 * Sum ALL digits of MMDDYYYY, then reduce with master preservation.
 *   Example: 12/18/1992 → 1+2+1+8+1+9+9+2 = 33  (Master 33, preserved)
 *   Example: 07/04/1996 → 0+7+0+4+1+9+9+6 = 36 → 9
 */
export function lifePathNumber(d: BirthDate): { root: number; compound: number; steps: string } {
  const allDigits = `${d.month}${d.day}${d.year}`.split("").map(Number);
  const raw = allDigits.reduce((s, n) => s + n, 0);
  const final = reduceWithCompoundStrict(raw);
  const digitsStr = `${d.month}${d.day}${d.year}`.split("").join("+");
  const steps = `Straight-across: ${digitsStr} = ${raw}${final.root === raw ? "" : ` → ${final.root}`}${MASTER_NUMBERS.has(final.root) ? " (MASTER)" : ""}${final.isKarmicDebt ? ` (KARMIC ${final.karmicDebtAs})` : ""}`;
  return { root: final.root, compound: final.compound, steps };
}

/**
 * Birthday Number (Partial Energy) — day of month reduced.
 * Per spec: Day 11, 22, 29 → do not reduce (11/22 are masters; 29→11 is master).
 * Day 18 → 1+8 = 9.
 */
export function birthDayNumber(d: BirthDate): number {
  return reduceNumberStrict(d.day);
}

/**
 * Personal Year — BIRTHDAY-AWARE + STRAIGHT-ACROSS.
 * ----------------------------------------------------------------------
 * Per The spec: sum ALL digits of (Birth Month + Birth Day + Effective Year)
 * written as a single string, then reduce with master-number preservation.
 *
 * Effective year = current year if birthday has passed (or is today),
 *                  else current year - 1.
 *
 * Example (Dec 18 1992 birthday, turning age 34 on Dec 18 2026):
 *   After Dec 18 2026, effective year = 2026
 *   12 + 18 + 2026 → digits: 1+2+1+8+2+0+2+6 = 22  (Master Number, preserved!)
 *
 * Example (same birthday, June 2026 — before Dec 18 birthday):
 *   Effective year = 2025
 *   12 + 18 + 2025 → digits: 1+2+1+8+2+0+2+5 = 21 → 3  (Personal Year 3)
 */
export function personalYear(d: BirthDate, now: Date = new Date()): { number: number; effectiveYear: number; birthdayPassed: boolean } {
  const cy = now.getFullYear();
  const today = now;
  const birthdayThisYear = new Date(cy, d.month - 1, d.day);
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const birthdayPassed = todayMidnight >= birthdayThisYear;
  const effectiveYear = birthdayPassed ? cy : cy - 1;

  // STRICT STRAIGHT-ACROSS: concatenate MM DD YYYY and sum all digits.
  const digitStr = `${d.month}${d.day}${effectiveYear}`;
  const raw = digitStr.split("").map(Number).reduce((s, n) => s + n, 0);
  const num = reduceNumberStrict(raw);
  return { number: num, effectiveYear, birthdayPassed };
}

/**
 * Personal Year for a SPECIFIC effective year — used for roadmap projections.
 * Same straight-across formula but with an explicit year instead of `now`.
 */
export function personalYearForEffectiveYear(d: BirthDate, effectiveYear: number): number {
  const digitStr = `${d.month}${d.day}${effectiveYear}`;
  const raw = digitStr.split("").map(Number).reduce((s, n) => s + n, 0);
  return reduceNumberStrict(raw);
}

/**
 * Personal Month = Personal Year + current calendar month (reduced).
 * Per spec example: "PY 8 + June (month 6) = 14 → 5 = Personal Month 5"
 * — additive reduction, NOT straight-across.
 */
export function personalMonth(d: BirthDate, now: Date = new Date()): number {
  const py = personalYear(d, now).number;
  const birthDay = d.day;
  const monthIndex = now.getDate() >= birthDay ? now.getMonth() + 1 : now.getMonth();
  return reduceNumberStrict(py + reduceNumberStrict(monthIndex || 12));
}

/**
 * Personal Day = Personal Month + current day of month (reduced).
 */
export function personalDay(d: BirthDate, now: Date = new Date()): number {
  const pm = personalMonth(d, now);
  return reduceNumberStrict(pm + reduceNumberStrict(now.getDate()));
}

/**
 * Attitude Number = Birth Month + Birth Day (reduced).
 */
export function attitudeNumber(d: BirthDate): number {
  return reduceNumberStrict(reduceNumberStrict(d.month) + reduceNumberStrict(d.day));
}

// ─── Pinnacles & Challenges ─────────────────────────────────────────
// For Master Number Life Paths (11, 22, 33), use the BASE digit for
// duration calculations: 11→2, 22→4, 33→6.
function baseDigit(n: number): number {
  if (n === 11) return 2;
  if (n === 22) return 4;
  if (n === 33) return 6;
  return n;
}

export interface Pinnacle {
  index: 1 | 2 | 3 | 4;
  number: number;
  ageStart: number;
  ageEnd: number;
}
export interface Challenge {
  index: 1 | 2 | 3 | 4;
  number: number;
}

export function pinnacles(d: BirthDate): Pinnacle[] {
  const m = reduceNumberStrict(d.month);
  const day = reduceNumberStrict(d.day);
  const y = reduceNumberStrict(d.year);
  const p1 = reduceNumberStrict(m + day);
  const p2 = reduceNumberStrict(day + y);
  const p3 = reduceNumberStrict(p1 + p2);
  const p4 = reduceNumberStrict(m + y);

  const lp = lifePathNumber(d).root;
  const lpBase = baseDigit(lp);
  const start1 = 36 - lpBase;
  return [
    { index: 1, number: p1, ageStart: 0, ageEnd: start1 - 1 },
    { index: 2, number: p2, ageStart: start1, ageEnd: start1 + 8 },
    { index: 3, number: p3, ageStart: start1 + 9, ageEnd: start1 + 17 },
    { index: 4, number: p4, ageStart: start1 + 18, ageEnd: 99 },
  ];
}

export function challenges(d: BirthDate): Challenge[] {
  const m = reduceNumberStrict(d.month);
  const day = reduceNumberStrict(d.day);
  const y = reduceNumberStrict(d.year);
  const c1 = reduceNumberStrict(Math.abs(m - day));
  const c2 = reduceNumberStrict(Math.abs(day - y));
  const c3 = reduceNumberStrict(Math.abs(reduceNumberStrict(m + day) - reduceNumberStrict(day + y)));
  const c4 = reduceNumberStrict(Math.abs(m - y));
  return [
    { index: 1, number: c1 },
    { index: 2, number: c2 },
    { index: 3, number: c3 },
    { index: 4, number: c4 },
  ];
}

// ─── Bridge Numbers ─────────────────────────────────────────────────
export function bridge(a: number, b: number): number {
  return reduceNumberStrict(Math.abs(reduceNumberStrict(a) - reduceNumberStrict(b)));
}

// ─── Karmic Lessons (missing numbers in birth name) ─────────────────
// Numbers 1-9 that do NOT appear in the birth name (Pythagorean values)
// represent Karmic Lessons the soul must develop in this lifetime.
export function missingNumbers(fullName: string): number[] {
  const clean = cleanName(fullName);
  const present = new Set<number>();
  for (const ch of clean) {
    if (ch === " ") continue;
    const v = letterValue(ch);
    if (v > 0) present.add(v);
  }
  const lessons: number[] = [];
  for (let n = 1; n <= 9; n++) {
    if (!present.has(n)) lessons.push(n);
  }
  return lessons;
}

// ─── NumerologyNumber (strict, with karmic awareness) ─────────────────────
export interface NumerologyNumber {
  root: number;
  compound: number;
  isMaster: boolean;
  isKarmicDebt: boolean;
  karmicDebtAs?: string;
  isWealth: boolean;          // compound 28 (ONLY)
  moneyCategory: "wealth" | "money" | "money-lesser" | null;
  calculation: string;        // step-by-step derivation string
  meaning?: ReturnType<typeof getCompoundMeaning>;
}

function makeNumerologyNumber(compound: number, calculation: string = ""): NumerologyNumber {
  const r = reduceWithCompoundStrict(compound);
  const moneyCat = getMoneyCategory(r.compound, r.root);
  return {
    root: r.root,
    compound: r.compound,
    isMaster: r.isMaster,
    isKarmicDebt: r.isKarmicDebt,
    karmicDebtAs: r.karmicDebtAs,
    isWealth: isWealthCompound(r.compound),
    moneyCategory: moneyCat,
    calculation,
    meaning: getCompoundMeaning(r.root),
  };
}

// ─── Full numerology chart ────────────────────────────────────────────────
export interface NumerologyChart {
  lifePath: NumerologyNumber & { steps: string };
  birthDay: NumerologyNumber;          // Partial Energy
  attitude: NumerologyNumber;
  expression: NumerologyNumber;        // Destiny — FULL birth name
  soulUrge: NumerologyNumber;          // Heart's desire — vowels only
  personality: NumerologyNumber;       // Outer self — consonants only
  maturity: NumerologyNumber;          // LP + Expression, later life
  pinnacles: Pinnacle[];
  challenges: Challenge[];
  periodCycles: PeriodCycle[];
  personalYear: { number: number; effectiveYear: number; birthdayPassed: boolean };
  personalMonth: number;
  personalDay: number;
  missingNumbers: number[];
  bridges: {
    lifePath_expression: number;
    soulUrge_personality: number;
  };
}

export interface PeriodCycle {
  index: 1 | 2 | 3;
  number: number;
  ageStart: number;
  ageEnd: number;
}

export function periodCycles(d: BirthDate): PeriodCycle[] {
  const m = reduceNumberStrict(d.month);
  const day = reduceNumberStrict(d.day);
  const y = reduceNumberStrict(d.year);
  const lp = lifePathNumber(d).root;
  const lpBase = baseDigit(lp);
  const start1 = 36 - lpBase;
  return [
    { index: 1, number: m, ageStart: 0, ageEnd: start1 - 1 },
    { index: 2, number: day, ageStart: start1, ageEnd: start1 + 27 - 1 },
    { index: 3, number: y, ageStart: start1 + 27, ageEnd: 99 },
  ];
}

export interface BuildChartInput {
  fullName: string;
  birth: BirthDate;
  now?: Date;
}

export function buildNumerologyChart(input: BuildChartInput): NumerologyChart {
  const { fullName, birth } = input;
  const now = input.now ?? new Date();

  const lp = lifePathNumber(birth);
  const bd = birthDayNumber(birth);
  const att = attitudeNumber(birth);

  // All name calcs use Pythagorean (the default) — with calculation strings.
  const expCalc = nameToNumberWithCalc(fullName);
  const soulCalc = vowelsToNumberWithCalc(fullName);
  const persCalc = consonantsToNumberWithCalc(fullName);

  // Calculation strings for date-derived numbers.
  const bdCalc = `${String(birth.day).split("").join("+")} = ${bd}`;
  const attCalc = `${String(birth.month).split("").join("+")} + ${String(birth.day).split("").join("+")} = ${att}`;
  const py = personalYear(birth, now);
  const pyDigits = `${birth.month}${birth.day}${py.effectiveYear}`.split("");
  const pyCalc = `${pyDigits.join("+")} = ${pyDigits.reduce((s, n) => s + Number(n), 0)}${py.number !== pyDigits.reduce((s, n) => s + Number(n), 0) ? ` → ${py.number}` : ""}`;
  const matCalc = `LP(${lp.root}) + Expression(${expCalc.sum}) = ${lp.root + expCalc.sum}${reduceNumberStrict(lp.root + expCalc.sum) !== lp.root + expCalc.sum ? ` → ${reduceNumberStrict(lp.root + expCalc.sum)}` : ""}`;

  const lpN = makeNumerologyNumber(lp.compound, lp.steps);
  const bdN = makeNumerologyNumber(bd, bdCalc);
  const attN = makeNumerologyNumber(att, attCalc);
  const expN = makeNumerologyNumber(expCalc.sum, expCalc.calculation);
  const soulN = makeNumerologyNumber(soulCalc.sum, soulCalc.calculation);
  const persN = makeNumerologyNumber(persCalc.sum, persCalc.calculation);
  const matN = makeNumerologyNumber(lpN.root + expN.root, matCalc);

  const pm = personalMonth(birth, now);
  const pd = personalDay(birth, now);

  return {
    lifePath: { ...lpN, steps: lp.steps },
    birthDay: bdN,
    attitude: attN,
    expression: expN,
    soulUrge: soulN,
    personality: persN,
    maturity: matN,
    pinnacles: pinnacles(birth),
    challenges: challenges(birth),
    periodCycles: periodCycles(birth),
    personalYear: py,
    personalMonth: pm,
    personalDay: pd,
    missingNumbers: missingNumbers(fullName),
    bridges: {
      lifePath_expression: bridge(lpN.root, expN.root),
      soulUrge_personality: bridge(soulN.root, persN.root),
    },
  };
}

// ─── Lucky Number (single name component) ──────────────────────────
// Per spec: "Lucky Number governs: lucky days, lucky partners, best
// timing windows." Computed from a SINGLE name component (typically
// first name or whichever the user picks).
export function luckyNumber(singleName: string): NumerologyNumber {
  return makeNumerologyNumber(nameToNumber(singleName));
}

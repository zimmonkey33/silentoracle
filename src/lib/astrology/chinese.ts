/**
 * Chinese Astrology Engine
 * ----------------------------------------------------------------------
 * Implements:
 *   - 12 Zodiac Animals (生肖)
 *   - 5 Elements (五行: Wood, Fire, Earth, Metal, Water)
 *   - Yin / Yang (阴阳)
 *   - 60-year Sexagenary cycle (天干地支)
 *   - Bazi / Four Pillars of Destiny (四柱: Year, Month, Day, Hour)
 *   - Zodiac compatibility (合、冲、害、刑)
 *   - Element generation / destruction cycles (相生相克)
 *
 * Sources: classical Chinese astrological corpus (《三命通会》,《渊海子平》)
 * plus contemporary English references (Theodora Lau, Raymond Lo,
 * Joey Yap public teachings).
 *
 * All functions pure & deterministic.
 */

export type Element = "Wood" | "Fire" | "Earth" | "Metal" | "Water";
export type Polarity = "Yang" | "Yin";
export type AnimalName =
  | "Rat" | "Ox" | "Tiger" | "Cat"
  | "Dragon" | "Snake" | "Horse" | "Goat"
  | "Monkey" | "Rooster" | "Dog" | "Pig";

export interface HeavenlyStem {
  index: number; // 0..9
  name: string;
  element: Element;
  polarity: Polarity;
}

export interface EarthlyBranch {
  index: number; // 0..11
  name: AnimalName;
  element: Element;
  polarity: Polarity;
  hourStart: number; // double-hour start (24h)
  hourEnd: number;
}

// ─── Heavenly Stems (天干) ──────────────────────────────────────────────
export const HEAVENLY_STEMS: HeavenlyStem[] = [
  { index: 0, name: "Jia",  element: "Wood",  polarity: "Yang" },
  { index: 1, name: "Yi",   element: "Wood",  polarity: "Yin"  },
  { index: 2, name: "Bing", element: "Fire",  polarity: "Yang" },
  { index: 3, name: "Ding", element: "Fire",  polarity: "Yin"  },
  { index: 4, name: "Wu",   element: "Earth", polarity: "Yang" },
  { index: 5, name: "Ji",   element: "Earth", polarity: "Yin"  },
  { index: 6, name: "Geng", element: "Metal", polarity: "Yang" },
  { index: 7, name: "Xin",  element: "Metal", polarity: "Yin"  },
  { index: 8, name: "Ren",  element: "Water", polarity: "Yang" },
  { index: 9, name: "Gui",  element: "Water", polarity: "Yin"  },
];

// ─── Earthly Branches (地支) with zodiac animals ───────────────────────
export const EARTHLY_BRANCHES: EarthlyBranch[] = [
  { index: 0,  name: "Rat",     element: "Water", polarity: "Yang", hourStart: 23, hourEnd: 1  },
  { index: 1,  name: "Ox",      element: "Earth", polarity: "Yin",  hourStart: 1,  hourEnd: 3  },
  { index: 2,  name: "Tiger",   element: "Wood",  polarity: "Yang", hourStart: 3,  hourEnd: 5  },
  { index: 3,  name: "Cat",  element: "Wood",  polarity: "Yin",  hourStart: 5,  hourEnd: 7  },
  { index: 4,  name: "Dragon",  element: "Earth", polarity: "Yang", hourStart: 7,  hourEnd: 9  },
  { index: 5,  name: "Snake",   element: "Fire",  polarity: "Yin",  hourStart: 9,  hourEnd: 11 },
  { index: 6,  name: "Horse",   element: "Fire",  polarity: "Yang", hourStart: 11, hourEnd: 13 },
  { index: 7,  name: "Goat",    element: "Earth", polarity: "Yin",  hourStart: 13, hourEnd: 15 },
  { index: 8,  name: "Monkey",  element: "Metal", polarity: "Yang", hourStart: 15, hourEnd: 17 },
  { index: 9,  name: "Rooster", element: "Metal", polarity: "Yin",  hourStart: 17, hourEnd: 19 },
  { index: 10, name: "Dog",     element: "Earth", polarity: "Yang", hourStart: 19, hourEnd: 21 },
  { index: 11, name: "Pig",     element: "Water", polarity: "Yin",  hourStart: 21, hourEnd: 23 },
];

// ─── Year → Branch & Stem ──────────────────────────────────────────────
// Gregorian year 4 CE = 甲子 (Jia Zi) — year 1 of cycle 1.
// Branch index = (year - 4) % 12
// Stem index   = (year - 4) % 10

export interface Sexagenary {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  combined: string; // e.g. "Jia Zi"
  cyclePosition: number; // 1..60
}

export function sexagenaryYear(year: number): Sexagenary {
  const offset = (year - 4) % 60;
  const stemIdx = ((year - 4) % 10 + 10) % 10;
  const branchIdx = ((year - 4) % 12 + 12) % 12;
  const stem = HEAVENLY_STEMS[stemIdx];
  const branch = EARTHLY_BRANCHES[branchIdx];
  return {
    stem,
    branch,
    combined: `${stem.name} ${branch.name}`,
    cyclePosition: offset + 1,
  };
}

// ─── Year animal & element (popular "Chinese zodiac year") ────────────
export function yearAnimal(year: number): AnimalName {
  return EARTHLY_BRANCHES[((year - 4) % 12 + 12) % 12].name;
}
export function yearElement(year: number): Element {
  // Element cycles every 2 years (one stem pair). 4-5 Wood, 6-7 Fire,
  // 8-9 Earth, 10-11 Metal, 12-13 Water — using (year-4) % 10 / 2.
  const stemIdx = ((year - 4) % 10 + 10) % 10;
  return HEAVENLY_STEMS[stemIdx].element;
}
export function yearPolarity(year: number): Polarity {
  // Odd Gregorian year = Yin, Even = Yang (after the 4-CE anchor).
  return (year - 4) % 2 === 0 ? "Yang" : "Yin";
}

// ─── Solar-term-based month pillar ──────────────────────────────────────
// In Chinese astrology, the year turns at 立春 (Li Chun ≈ Feb 4) and
// months are bounded by solar terms, NOT lunar months. The branch
// sequence for months begins with Tiger (寅) for month 1.
//
// Approximate solar-term start dates:
//   Month 1 (Tiger/寅):      Feb 4
//   Month 2 (Cat/卯):     Mar 6
//   Month 3 (Dragon/辰):     Apr 5
//   Month 4 (Snake/巳):      May 6
//   Month 5 (Horse/午):      Jun 6
//   Month 6 (Goat/未):       Jul 7
//   Month 7 (Monkey/申):     Aug 8
//   Month 8 (Rooster/酉):    Sep 8
//   Month 9 (Dog/戌):        Oct 8
//   Month 10 (Pig/亥):       Nov 7
//   Month 11 (Rat/子):       Dec 7
//   Month 12 (Ox/丑):        Jan 6 (of next Gregorian year)

const SOLAR_TERM_START: { month: number; day: number; branchIndex: number }[] = [
  { month: 2,  day: 4,  branchIndex: 2  }, // 寅 Tiger (month 1)
  { month: 3,  day: 6,  branchIndex: 3  }, // 卯 Cat
  { month: 4,  day: 5,  branchIndex: 4  }, // 辰 Dragon
  { month: 5,  day: 6,  branchIndex: 5  }, // 巳 Snake
  { month: 6,  day: 6,  branchIndex: 6  }, // 午 Horse
  { month: 7,  day: 7,  branchIndex: 7  }, // 未 Goat
  { month: 8,  day: 8,  branchIndex: 8  }, // 申 Monkey
  { month: 9,  day: 8,  branchIndex: 9  }, // 酉 Rooster
  { month: 10, day: 8,  branchIndex: 10 }, // 戌 Dog
  { month: 11, day: 7,  branchIndex: 11 }, // 亥 Pig
  { month: 12, day: 7,  branchIndex: 0  }, // 子 Rat
  { month: 1,  day: 6,  branchIndex: 1  }, // 丑 Ox (next year's jan)
];

export function monthBranchIndex(date: Date): number {
  const m = date.getMonth() + 1; // 1..12
  const d = date.getDate();
  // Convert (m, d) to a day-of-year comparable number. We treat January as
  // month 13 of the previous year so that Jan 6 (Ox) correctly comes AFTER
  // Dec 7 (Rat) in chronological order.
  const cmpMonth = m === 1 ? 13 : m;
  const cmpKey = cmpMonth * 100 + d;
  let branchIdx = 1; // Ox — default for early Jan / late Dec (month 12 of prior cycle)
  for (const t of SOLAR_TERM_START) {
    const tMonth = t.month === 1 ? 13 : t.month;
    const tKey = tMonth * 100 + t.day;
    if (cmpKey >= tKey) branchIdx = t.branchIndex;
  }
  return branchIdx;
}

export function monthStemIndex(yearStemIndex: number, monthBranchIndex: number): number {
  // 5-tiger rule (五虎遁):
  // Year stem starts the sequence for month 1 (Tiger).
  //   甲/己 year → 丙寅 (start stem 2)
  //   乙/庚 year → 戊寅 (start stem 4)
  //   丙/辛 year → 庚寅 (start stem 6)
  //   丁/壬 year → 壬寅 (start stem 8)
  //   戊/癸 year → 甲寅 (start stem 0)
  const rule: Record<number, number> = { 0: 2, 5: 2, 1: 4, 6: 4, 2: 6, 7: 6, 3: 8, 8: 8, 4: 0, 9: 0 };
  const startStem = rule[yearStemIndex];
  const offset = (monthBranchIndex - 2 + 12) % 12;
  return (startStem + offset) % 10;
}

export function sexagenaryMonth(year: number, date: Date): Sexagenary {
  const yearStemIdx = ((year - 4) % 10 + 10) % 10;
  const mb = monthBranchIndex(date);
  const ms = monthStemIndex(yearStemIdx, mb);
  return {
    stem: HEAVENLY_STEMS[ms],
    branch: EARTHLY_BRANCHES[mb],
    combined: `${HEAVENLY_STEMS[ms].name} ${EARTHLY_BRANCHES[mb].name}`,
    cyclePosition: 0, // not meaningful for month pillar
  };
}

// ─── Day pillar ────────────────────────────────────────────────────────
// Use a known reference day and step in 60-day cycles.
// Reference: 1900-01-31 was 甲戌 day (stem 0, branch 10). We use a
// simpler reference: 2000-01-07 was 甲子 day (stem 0, branch 0) which
// is widely cited and easy to verify. (Cycle position 1.)
export function sexagenaryDay(date: Date): Sexagenary {
  const REF = new Date(Date.UTC(2000, 0, 7)); // 2000-01-07 = 甲子
  const MS_PER_DAY = 86400000;
  const diff = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
                           REF.getTime()) / MS_PER_DAY);
  const stemIdx = ((diff % 10) + 10) % 10;
  const branchIdx = ((diff % 12) + 12) % 12;
  return {
    stem: HEAVENLY_STEMS[stemIdx],
    branch: EARTHLY_BRANCHES[branchIdx],
    combined: `${HEAVENLY_STEMS[stemIdx].name} ${EARTHLY_BRANCHES[branchIdx].name}`,
    cyclePosition: ((diff % 60) + 60) % 60 + 1,
  };
}

// ─── Hour pillar ────────────────────────────────────────────────────────
// Chinese double-hour branches. The day's stem governs the hour's stem
// via the 5-rat rule (五鼠遁).
//   甲/己 day → 甲子 hour (start stem 0)
//   乙/庚 day → 丙子 hour (start stem 2)
//   丙/辛 day → 戊子 hour (start stem 4)
//   丁/壬 day → 庚子 hour (start stem 6)
//   戊/癸 day → 壬子 hour (start stem 8)
export function hourBranchIndex(hour: number): number {
  // 23:00-00:59 = Rat (0); 01:00-02:59 = Ox (1); etc.
  if (hour === 23 || hour === 0) return 0;
  return Math.floor((hour + 1) / 2) % 12;
}

export function sexagenaryHour(date: Date, hour: number): Sexagenary {
  const dayPillar = sexagenaryDay(date);
  const dayStemIdx = dayPillar.stem.index;
  const rule: Record<number, number> = { 0: 0, 5: 0, 1: 2, 6: 2, 2: 4, 7: 4, 3: 6, 8: 6, 4: 8, 9: 8 };
  const startStem = rule[dayStemIdx];
  const hb = hourBranchIndex(hour);
  const hs = (startStem + hb) % 10;
  return {
    stem: HEAVENLY_STEMS[hs],
    branch: EARTHLY_BRANCHES[hb],
    combined: `${HEAVENLY_STEMS[hs].name} ${EARTHLY_BRANCHES[hb].name}`,
    cyclePosition: 0,
  };
}

// ─── Element cycles ───────────────────────────────────────────────────
// Generation (相生): Wood → Fire → Earth → Metal → Water → Wood
// Destruction (相克): Wood → Earth → Water → Fire → Metal → Wood
export const GENERATION_CYCLE: Record<Element, Element> = {
  Wood: "Fire",
  Fire: "Earth",
  Earth: "Metal",
  Metal: "Water",
  Water: "Wood",
};
export const DESTRUCTION_CYCLE: Record<Element, Element> = {
  Wood: "Earth",
  Earth: "Water",
  Water: "Fire",
  Fire: "Metal",
  Metal: "Wood",
};

export type ElementRelation =
  | "generating" // a feeds b
  | "generated-by" // b feeds a
  | "destroying" // a destroys b
  | "destroyed-by" // b destroys a
  | "same";

export function elementRelation(a: Element, b: Element): ElementRelation {
  if (a === b) return "same";
  if (GENERATION_CYCLE[a] === b) return "generating";
  if (GENERATION_CYCLE[b] === a) return "generated-by";
  if (DESTRUCTION_CYCLE[a] === b) return "destroying";
  return "destroyed-by";
}

// ─── Zodiac compatibility ─────────────────────────────────────────────
// Trines (三合 — best match, 4 groups of 3):
//   Rat-Dragon-Monkey     (水局 Water)
//   Ox-Snake-Rooster      (金局 Metal)
//   Tiger-Horse-Dog       (火局 Fire)
//   Cat-Goat-Pig       (木局 Wood)
// Opposites (冲 — clash, often magnetic but volatile):
//   Rat↔Horse, Ox↔Goat, Tiger↔Monkey, Cat↔Rooster, Dragon↔Dog, Snake↔Pig
// Harm (害):
//   Rat↔Goat, Ox↔Horse, Tiger↔Snake, Cat↔Dragon, Monkey↔Pig, Rooster↔Dog

const TRINES: AnimalName[][] = [
  ["Rat", "Dragon", "Monkey"],
  ["Ox", "Snake", "Rooster"],
  ["Tiger", "Horse", "Dog"],
  ["Cat", "Goat", "Pig"],
];

const OPPOSITES: [AnimalName, AnimalName][] = [
  ["Rat", "Horse"], ["Ox", "Goat"], ["Tiger", "Monkey"],
  ["Cat", "Rooster"], ["Dragon", "Dog"], ["Snake", "Pig"],
];

const HARM: [AnimalName, AnimalName][] = [
  ["Rat", "Goat"], ["Ox", "Horse"], ["Tiger", "Snake"],
  ["Cat", "Dragon"], ["Monkey", "Pig"], ["Rooster", "Dog"],
];

export type CompatibilityTier = "trine" | "opposite" | "harm" | "neutral";

export function zodiacCompatibility(a: AnimalName, b: AnimalName): {
  tier: CompatibilityTier;
  score: number; // 0-100
  label: string;
  description: string;
} {
  if (a === b) {
    return {
      tier: "neutral",
      score: 65,
      label: "Same Animal",
      description:
        "Same-animal pairings are mirrors — they understand each other deeply but can amplify each other's blind spots. Best when ages differ.",
    };
  }
  for (const trine of TRINES) {
    if (trine.includes(a) && trine.includes(b)) {
      return {
        tier: "trine",
        score: 90,
        label: "Trine (三合) — Excellent",
        description:
          "These two animals belong to the same trine — a natural harmony of element, temperament, and life direction. One of the most stable matchings in the zodiac.",
      };
    }
  }
  for (const [x, y] of OPPOSITES) {
    if ((x === a && y === b) || (x === b && y === a)) {
      return {
        tier: "opposite",
        score: 70,
        label: "Opposite (冲) — Magnetic",
        description:
          "Opposite animals attract powerfully but clash just as powerfully. The chemistry is real; the work is real too. Often a karmic pairing.",
      };
    }
  }
  for (const [x, y] of HARM) {
    if ((x === a && y === b) || (x === b && y === a)) {
      return {
        tier: "harm",
        score: 40,
        label: "Harm (害) — Caution",
        description:
          "These two animals sit in a harmful relationship — friction, misunderstanding, or hidden resentment. Workable with awareness, but tends to drain both.",
      };
    }
  }
  return {
    tier: "neutral",
    score: 60,
    label: "Neutral",
    description:
      "These two animals have no special harmonious or destructive relationship. Compatibility depends on the rest of the chart, especially the elements.",
  };
}

// ─── Full Chinese astrology chart ─────────────────────────────────────
export interface ChineseChart {
  yearPillar: Sexagenary;
  monthPillar: Sexagenary;
  dayPillar: Sexagenary;
  hourPillar: Sexagenary | null; // null if birth hour unknown
  animal: AnimalName;
  element: Element;
  polarity: Polarity;
  dayMaster: HeavenlyStem; // day stem — the "self" in Bazi
  dayMasterElement: Element;
  dominantElement: Element; // most common element across pillars
  elementCounts: Record<Element, number>;
  chartPolarity: Polarity; // overall yin/yang
}

export interface ChineseInput {
  birth: Date;
  hour?: number | null; // 0..23, null if unknown
}

export function buildChineseChart(input: ChineseInput): ChineseChart {
  const { birth, hour } = input;
  const year = birth.getFullYear();

  const yearPillar = sexagenaryYear(year);
  const monthPillar = sexagenaryMonth(year, birth);
  const dayPillar = sexagenaryDay(birth);
  const hourPillar = hour != null ? sexagenaryHour(birth, hour) : null;

  const animal = yearAnimal(year);
  const element = yearElement(year);
  const polarity = yearPolarity(year);

  const dayMaster = dayPillar.stem;

  // Tally element counts across all 4 pillars (8 chars).
  const counts: Record<Element, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  const pillars = [yearPillar, monthPillar, dayPillar];
  if (hourPillar) pillars.push(hourPillar);
  for (const p of pillars) {
    counts[p.stem.element] += 1;
    counts[p.branch.element] += 1;
  }
  let dominant: Element = "Wood";
  let max = -1;
  for (const k of Object.keys(counts) as Element[]) {
    if (counts[k] > max) {
      max = counts[k];
      dominant = k;
    }
  }

  // Overall polarity: count yang vs yin across the 8 chars.
  let yang = 0, yin = 0;
  for (const p of pillars) {
    if (p.stem.polarity === "Yang") yang++; else yin++;
    if (p.branch.polarity === "Yang") yang++; else yin++;
  }
  const chartPolarity: Polarity = yang >= yin ? "Yang" : "Yin";

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    animal,
    element,
    polarity,
    dayMaster,
    dayMasterElement: dayMaster.element,
    dominantElement: dominant,
    elementCounts: counts,
    chartPolarity,
  };
}

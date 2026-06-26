/**
 * Chinese Zodiac Year Sign — Exact Date Module
 * ----------------------------------------------------------------------
 * Uses actual Chinese New Year dates (not just Gregorian year) to
 * determine the correct zodiac animal. Someone born Jan 3, 2003 is
 * still in the Year of the Horse (2002 CNY), NOT the Goat (2003 CNY).
 *
 * The system uses CAT instead of Rabbit (Vietnamese tradition).
 *
 * Language is practical, grounded, and directly applicable to the
 * subject context — "as above, so below" methodology.
 */

export type AnimalName =
  | "Rat" | "Ox" | "Tiger" | "Cat"
  | "Dragon" | "Snake" | "Horse" | "Goat"
  | "Monkey" | "Rooster" | "Dog" | "Pig";

export type Element = "Wood" | "Fire" | "Earth" | "Metal" | "Water";
export type Polarity = "Yang" | "Yin";

export interface ChineseYearSign {
  animal: AnimalName;
  element: Element;
  polarity: Polarity;
  emoji: string;
  chinese: string;
  title: string;
  archetype: string;
  traits: string[];
  bestMatches: AnimalName[];
  challengingMatches: AnimalName[];
  summary: string;
}

// ─── Chinese New Year dates (Jan 1900 – Feb 2030) ────────────────────
// Each entry: [year, month, day] of Chinese New Year for that year.
// Before this date → previous year's animal. On/after → this year's animal.
// Source: Chinese astronomical calendar.
const CNY_DATES: Record<number, [number, number]> = {
  1900: [1, 31], 1901: [2, 19], 1902: [2, 8], 1903: [1, 29], 1904: [2, 16],
  1905: [2, 4], 1906: [1, 25], 1907: [2, 13], 1908: [2, 2], 1909: [1, 22],
  1910: [2, 10], 1911: [1, 30], 1912: [2, 18], 1913: [2, 6], 1914: [1, 26],
  1915: [2, 14], 1916: [2, 3], 1917: [1, 23], 1918: [2, 11], 1919: [2, 1],
  1920: [2, 20], 1921: [2, 8], 1922: [1, 28], 1923: [2, 16], 1924: [2, 5],
  1925: [1, 24], 1926: [2, 13], 1927: [2, 2], 1928: [1, 23], 1929: [2, 10],
  1930: [1, 30], 1931: [2, 17], 1932: [2, 6], 1933: [1, 26], 1934: [2, 14],
  1935: [2, 4], 1936: [1, 24], 1937: [2, 11], 1938: [1, 31], 1939: [2, 19],
  1940: [2, 8], 1941: [1, 27], 1942: [2, 15], 1943: [2, 5], 1944: [1, 25],
  1945: [2, 13], 1946: [2, 2], 1947: [1, 22], 1948: [2, 10], 1949: [1, 29],
  1950: [2, 17], 1951: [2, 6], 1952: [1, 27], 1953: [2, 14], 1954: [2, 3],
  1955: [1, 24], 1956: [2, 12], 1957: [1, 31], 1958: [2, 18], 1959: [2, 8],
  1960: [1, 28], 1961: [2, 15], 1962: [2, 5], 1963: [1, 25], 1964: [2, 13],
  1965: [2, 2], 1966: [1, 21], 1967: [2, 9], 1968: [1, 30], 1969: [2, 17],
  1970: [2, 6], 1971: [1, 27], 1972: [2, 15], 1973: [2, 3], 1974: [1, 23],
  1975: [2, 11], 1976: [1, 31], 1977: [2, 18], 1978: [2, 7], 1979: [1, 28],
  1980: [2, 16], 1981: [2, 5], 1982: [1, 25], 1983: [2, 13], 1984: [2, 2],
  1985: [2, 20], 1986: [2, 9], 1987: [1, 29], 1988: [2, 17], 1989: [2, 6],
  1990: [1, 27], 1991: [2, 15], 1992: [2, 4], 1993: [1, 23], 1994: [2, 10],
  1995: [1, 31], 1996: [2, 19], 1997: [2, 7], 1998: [1, 28], 1999: [2, 16],
  2000: [2, 5], 2001: [1, 24], 2002: [2, 12], 2003: [2, 1], 2004: [1, 22],
  2005: [2, 9], 2006: [1, 29], 2007: [2, 18], 2008: [2, 7], 2009: [1, 26],
  2010: [2, 14], 2011: [2, 3], 2012: [1, 23], 2013: [2, 10], 2014: [1, 31],
  2015: [2, 19], 2016: [2, 8], 2017: [1, 28], 2018: [2, 16], 2019: [2, 5],
  2020: [1, 25], 2021: [2, 12], 2022: [2, 1], 2023: [1, 22], 2024: [2, 10],
  2025: [1, 29], 2026: [2, 17], 2027: [2, 6], 2028: [1, 26], 2029: [2, 13],
  2030: [2, 3],
};

/**
 * Given a full date (year, month, day), determine the correct Chinese
 * zodiac year. If the date is before CNY of that year, use the previous
 * year's animal.
 *
 * Example: Jan 3, 2003 → before CNY 2003 (Feb 1) → Horse (2002)
 *          Feb 20, 2003 → after CNY 2003 → Goat (2003)
 */
function getZodiacYear(year: number, month: number, day: number): number {
  const cny = CNY_DATES[year];
  if (!cny) {
    // Fallback for years outside the table: use Feb 4 as approximate cutoff
    if (month < 2 || (month === 2 && day < 4)) return year - 1;
    return year;
  }
  const [cnyMonth, cnyDay] = cny;
  if (month < cnyMonth || (month === cnyMonth && day < cnyDay)) {
    return year - 1;
  }
  return year;
}

// ─── Animal data (Cat replaces Rabbit per Silent Oracle) ──────────────────────
const ANIMAL_DATA: Record<AnimalName, Omit<ChineseYearSign, "animal" | "element" | "polarity">> = {
  Rat:     { emoji: "🐀", chinese: "鼠 (Shǔ)",    title: "The Strategist",         archetype: "Quick-witted, resourceful", traits: ["clever", "resourceful", "adaptive", "ambitious"], bestMatches: ["Dragon", "Monkey", "Ox"], challengingMatches: ["Horse", "Goat"], summary: "Strategic mind, quick to spot opportunity. Excels in competitive environments where adaptability and resourcefulness determine outcomes." },
  Ox:      { emoji: "🐂", chinese: "牛 (Niú)",    title: "The Builder",            archetype: "Patient, methodical",       traits: ["disciplined", "reliable", "strong", "methodical"], bestMatches: ["Snake", "Rooster", "Rat"], challengingMatches: ["Goat", "Horse"], summary: "Methodical builder. Sustained effort over time produces results that outlast trends. Best in roles requiring consistency and structural thinking." },
  Tiger:   { emoji: "🐅", chinese: "虎 (Hǔ)",     title: "The Operator",           archetype: "Bold, action-oriented",     traits: ["courageous", "decisive", "competitive", "charismatic"], bestMatches: ["Horse", "Dog", "Pig"], challengingMatches: ["Monkey", "Snake"], summary: "Action-oriented operator. Thrives in high-stakes environments requiring bold decisions. Natural competitive drive produces results under pressure." },
  Cat:     { emoji: "🐈", chinese: "猫 (Māo)",    title: "The Negotiator",         archetype: "Diplomatic, precise",       traits: ["diplomatic", "observant", "strategic", "refined"], bestMatches: ["Goat", "Pig", "Dog"], challengingMatches: ["Rooster", "Rat"], summary: "Diplomatic negotiator. Reads situations precisely, navigates complexity with grace. Excels in roles requiring tact, timing, and relationship management." },
  Dragon:  { emoji: "🐉", chinese: "龙 (Lóng)",   title: "The Scale-Builder",      archetype: "Visionary, ambitious",      traits: ["ambitious", "visionary", "confident", "magnetic"], bestMatches: ["Rat", "Monkey", "Rooster"], challengingMatches: ["Dog", "Goat"], summary: "Scale-builder. Operates at a level others find difficult to match. Best in founding, scaling, and industry-defining roles where ambition is the primary asset." },
  Snake:   { emoji: "🐍", chinese: "蛇 (Shé)",    title: "The Analyst",            archetype: "Strategic, perceptive",     traits: ["analytical", "perceptive", "strategic", "patient"], bestMatches: ["Ox", "Rooster", "Monkey"], challengingMatches: ["Pig", "Tiger"], summary: "Strategic analyst. Sees patterns others miss. Best in research, investment, and advisory roles where depth of analysis creates advantage." },
  Horse:   { emoji: "🐎", chinese: "马 (Mǎ)",     title: "The Closer",             archetype: "Energetic, results-driven", traits: ["energetic", "independent", "competitive", "direct"], bestMatches: ["Tiger", "Dog", "Goat"], challengingMatches: ["Rat", "Ox"], summary: "Results-driven closer. High energy, direct approach. Best in sales, trading, and fast-paced roles where speed and independence produce outcomes." },
  Goat:    { emoji: "🐐", chinese: "羊 (Yáng)",   title: "The Creative",           archetype: "Artistic, collaborative",   traits: ["creative", "collaborative", "detail-oriented", "resilient"], bestMatches: ["Cat", "Pig", "Horse"], challengingMatches: ["Ox", "Rat"], summary: "Creative collaborator. Produces quality through attention to detail and aesthetic sensibility. Best in design, creative direction, and team-based production roles." },
  Monkey:  { emoji: "🐒", chinese: "猴 (Hóu)",    title: "The Innovator",          archetype: "Inventive, versatile",      traits: ["inventive", "versatile", "curious", "adaptable"], bestMatches: ["Rat", "Dragon", "Snake"], challengingMatches: ["Tiger", "Pig"], summary: "Innovator and problem-solver. Finds approaches others don't see. Best in technology, product, and consulting roles where versatility creates competitive edge." },
  Rooster: { emoji: "🐓", chinese: "鸡 (Jī)",     title: "The Quality Controller", archetype: "Precise, accountable",      traits: ["precise", "accountable", "organized", "direct"], bestMatches: ["Ox", "Snake", "Dragon"], challengingMatches: ["Cat", "Dog"], summary: "Quality controller. High standards, direct communication. Best in operations, finance, and compliance roles where precision and accountability are mission-critical." },
  Dog:     { emoji: "🐕", chinese: "狗 (Gǒu)",    title: "The Protector",          archetype: "Loyal, principled",         traits: ["loyal", "principled", "reliable", "fair"], bestMatches: ["Tiger", "Cat", "Horse"], challengingMatches: ["Dragon", "Goat"], summary: "Protector and guardian. Builds trust through consistency and principle. Best in security, legal, HR, and advisory roles where loyalty and fairness are valued." },
  Pig:     { emoji: "🐖", chinese: "猪 (Zhū)",    title: "The Finisher",           archetype: "Thorough, generous",        traits: ["thorough", "generous", "diligent", "grounded"], bestMatches: ["Goat", "Cat", "Tiger"], challengingMatches: ["Snake", "Monkey"], summary: "Thorough finisher. Completes what others start. Best in project completion, quality assurance, and hospitality roles where thoroughness and generosity produce results." },
};

const ANIMALS: AnimalName[] = ["Rat","Ox","Tiger","Cat","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];

// ─── Public API ──────────────────────────────────────────────────────

/**
 * Returns the zodiac year (for animal/element/polarity calculation)
 * accounting for Chinese New Year cutoff.
 */
export function getZodiacYearFromDate(year: number, month: number, day: number): number {
  return getZodiacYear(year, month, day);
}

export function yearAnimal(year: number): AnimalName {
  return ANIMALS[((year - 4) % 12 + 12) % 12];
}

export function yearElement(year: number): Element {
  const stemIdx = ((year - 4) % 10 + 10) % 10;
  return ["Wood","Fire","Earth","Metal","Water"][Math.floor(stemIdx / 2)] as Element;
}

export function yearPolarity(year: number): Polarity {
  return (year - 4) % 2 === 0 ? "Yang" : "Yin";
}

/**
 * Get Chinese year sign from a FULL DATE (year, month, day).
 * Correctly handles Chinese New Year cutoff.
 *
 * Example: Jan 3, 2003 → Horse (2002), because CNY 2003 was Feb 1.
 *          Feb 20, 2003 → Goat (2003).
 */
export function getChineseYearSignFromDate(year: number, month: number, day: number): ChineseYearSign {
  const zodiacYear = getZodiacYearFromDate(year, month, day);
  return getChineseYearSign(zodiacYear);
}

/**
 * Get Chinese year sign from just a year number (assumes after CNY).
 * Use getChineseYearSignFromDate for exact date accuracy.
 */
export function getChineseYearSign(year: number): ChineseYearSign {
  const animal = yearAnimal(year);
  const element = yearElement(year);
  const polarity = yearPolarity(year);
  return { animal, element, polarity, ...ANIMAL_DATA[animal] };
}

// ─── Compatibility ───────────────────────────────────────────────────
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

export function zodiacCompatibility(a: AnimalName, b: AnimalName): {
  tier: "trine" | "opposite" | "harm" | "neutral";
  score: number;
  label: string;
  description: string;
} {
  if (a === b) return { tier: "neutral", score: 65, label: "Same Animal", description: "Same sign — shared strengths and blind spots. Productive when roles differ, redundant when they overlap." };
  for (const trine of TRINES) {
    if (trine.includes(a) && trine.includes(b)) {
      return { tier: "trine", score: 90, label: "Trine (三合) — Aligned", description: "Natural alignment of approach and direction. Productive working relationship with minimal friction." };
    }
  }
  for (const [x, y] of OPPOSITES) {
    if ((x === a && y === b) || (x === b && y === a)) {
      return { tier: "opposite", score: 70, label: "Opposite (冲) — Complementary", description: "Complementary strengths. What one lacks, the other provides. Effective when roles are clearly defined." };
    }
  }
  for (const [x, y] of HARM) {
    if ((x === a && y === b) || (x === b && y === a)) {
      return { tier: "harm", score: 40, label: "Harm (害) — Friction", description: "Structural friction in working style. Manageable with awareness and clear communication protocols." };
    }
  }
  return { tier: "neutral", score: 60, label: "Neutral", description: "No special alignment or friction. Working relationship depends on individual execution." };
}

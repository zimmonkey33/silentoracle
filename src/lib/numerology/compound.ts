/**
 * Strict Numerology Methodology — Number Theory
 * ----------------------------------------------------------------------
 * Per the the reference spec, ONLY 11, 22, 33 are Master Numbers.
 * 44 → 8, 55 → 1, 66 → 3, 77 → 5, 88 → 7, 99 → 9.
 *
 * Karmic Debt Numbers: 13, 14, 16, 19. These must be flagged BEFORE
 * reducing. The reduced form is noted as 13/4, 14/5, 16/7, 19/1.
 *
 * All name calculations use the Pythagorean chart (1-9) by default.
 * The Chaldean chart (1-8, no 9) is NOT used unless explicitly specified.
 *
 * Personal Year is BIRTHDAY-AWARE: it changes on the person's actual
 * birthday, not January 1st.
 */

export interface CompoundMeaning {
  number: number;
  root: number;
  isMaster: boolean;
  isKarmicDebt: boolean;
  karmicDebtAs?: string;
  title: string;
  vibration: string;
  detail: string;
  keyword: string;
}

// ─── Master Numbers — ONLY 11, 22, 33 ────────────────────────────────
export const MASTER_NUMBERS = new Set([11, 22, 33]);

// ─── Karmic Debt Numbers ─────────────────────────────────────────────
export const KARMIC_DEBT: Record<number, { reducesTo: number; lesson: string }> = {
  13: { reducesTo: 4, lesson: "Past-life laziness — embrace hard work and discipline" },
  14: { reducesTo: 5, lesson: "Past-life abuse of freedom — practice moderation and responsibility" },
  16: { reducesTo: 7, lesson: "Past-life ego destroyed relationships — surrender ego, seek spiritual truth" },
  19: { reducesTo: 1, lesson: "Past-life misuse of power — learn to receive help, practice humility" },
};

export function isKarmicDebt(n: number): boolean {
  return n in KARMIC_DEBT;
}

/**
 * STRICT Silent Oracle REDUCTION
 * - Stop at single digit 1-9
 * - Stop at Master Numbers 11, 22, 33
 * - 44→8, 55→1, 66→3, 77→5, 88→7, 99→9 (NOT masters)
 * - 29 → 2+9=11 → STOP (master)
 * - 38 → 3+8=11 → STOP (master)
 * - 47 → 4+7=11 → STOP (master)
 */
export function reduceNumberStrict(n: number): number {
  let x = Math.abs(Math.trunc(n));
  while (x > 9 && !MASTER_NUMBERS.has(x)) {
    x = String(x).split("").reduce((s, d) => s + Number(d), 0);
  }
  return x;
}

export interface ReductionResult {
  root: number;
  compound: number;
  isMaster: boolean;
  isKarmicDebt: boolean;
  karmicDebtAs?: string;
}

export function reduceWithCompoundStrict(n: number): ReductionResult {
  const x = Math.abs(Math.trunc(n));
  const karmic = isKarmicDebt(x);
  const root = reduceNumberStrict(x);
  return {
    root,
    compound: x,
    isMaster: MASTER_NUMBERS.has(root),
    isKarmicDebt: karmic,
    karmicDebtAs: karmic ? `${x}/${root}` : undefined,
  };
}

// ─── Compound meanings (1-99) ───────────────────────────────────────
export const COMPOUND_MEANINGS: Record<number, Omit<CompoundMeaning, "root" | "isMaster" | "isKarmicDebt" | "karmicDebtAs">> = {
  1: { number: 1, title: "The Leader", vibration: "Sun / Independence", keyword: "independence", detail: "Initiating spark — Sun energy, pure Yang. Strong for leaders, founders, and pioneers." },
  2: { number: 2, title: "The Diplomat", vibration: "Moon / Cooperation", keyword: "cooperation", detail: "Lunar, receptive — partnership, listening, diplomacy." },
  3: { number: 3, title: "The Communicator", vibration: "Jupiter / Expression", keyword: "expression", detail: "Jupiter's child — expansive, expressive, magnetic." },
  4: { number: 4, title: "The Builder", vibration: "Uranus / Structure", keyword: "discipline", detail: "Foundation — patient, disciplined, structural. Karmic if from 13." },
  5: { number: 5, title: "The Freedom Seeker", vibration: "Mercury / Change", keyword: "freedom", detail: "Mercury's experimenter — versatile, magnetic, restless. Karmic if from 14." },
  6: { number: 6, title: "The Nurturer", vibration: "Venus / Love", keyword: "love", detail: "Venus's emissary — love, beauty, responsibility." },
  7: { number: 7, title: "The Seeker", vibration: "Ketu / Testing", keyword: "testing", detail: "Ruled by Ketu — testing, mystery, isolation. Favourable for spiritual work only. Karmic if from 16." },
  8: { number: 8, title: "The Powerhouse", vibration: "Saturn / Karma", keyword: "power", detail: "Saturn's apprentice — power, money, karmic justice." },
  9: { number: 9, title: "The Adapter", vibration: "Mars / Adaptability / Completion", keyword: "adaptability", detail: "Number 9 is linked with adaptability in Silent Oracle. Mars-ruled — courage, endings, and the ability to adapt to any situation. 9 completes the 1-9 cycle but does so through versatility and transformation, not through being an 'old soul'. The system does NOT classify 9 as an old soul." },
  10: { number: 10, title: "Wheel of Fortune", vibration: "Sun + Zero / Beginnings", keyword: "fortune", detail: "Perfect new beginning — 1 (Sun) + 0 (void/potential)." },
  11: { number: 11, title: "Master Intuitive", vibration: "Master / The Messenger", keyword: "illumination", detail: "Master Number — illumination, sensitivity, psychic ability. NEVER reduce to 2." },
  12: { number: 12, title: "The Sacrifice", vibration: "Hanged Man", keyword: "sacrifice", detail: "Sacrifice and suspension — work that benefits others more than self." },
  13: { number: 13, title: "Karmic Debt 13/4", vibration: "Transformation / Hard Work", keyword: "karmic-work", detail: "KARMIC DEBT — past-life laziness. Must embrace hard work and discipline. Reduces to 4." },
  14: { number: 14, title: "Karmic Debt 14/5", vibration: "Temptation / Moderation", keyword: "karmic-moderation", detail: "KARMIC DEBT — past-life abuse of freedom. Must practice moderation and responsibility. Reduces to 5." },
  15: { number: 15, title: "The Magician", vibration: "Venus × 6 / Magnetism", keyword: "magic", detail: "Magical, magnetic energy — Venus elevated." },
  16: { number: 16, title: "Karmic Debt 16/7", vibration: "Fallen Tower / Surrender", keyword: "karmic-surrender", detail: "KARMIC DEBT — past-life ego destroyed relationships. Must surrender ego, seek spiritual truth. Reduces to 7." },
  17: { number: 17, title: "The Star", vibration: "Ketu × 8 / Legacy", keyword: "immortality", detail: "Immortality through work — what you build tends to outlive you." },
  18: { number: 18, title: "Materialism Warning", vibration: "Mars × 9 / Moon-dark", keyword: "deception", detail: "Warns of materialism, deception, conflict through money or secrets." },
  19: { number: 19, title: "Karmic Debt 19/1", vibration: "Sun × 10 / Humility", keyword: "karmic-humility", detail: "KARMIC DEBT — past-life misuse of power. Must learn to receive help, practice humility. Reduces to 1." },
  20: { number: 20, title: "The Awakening", vibration: "Moon × 2 / New Dawn", keyword: "awakening", detail: "Emotional or spiritual new beginning." },
  21: { number: 21, title: "The Crown", vibration: "Jupiter × 3 / Victory", keyword: "victory", detail: "Victory — completion of a cycle, recognition." },
  22: { number: 22, title: "Master Builder", vibration: "Master / Architect of the Impossible", keyword: "master-building", detail: "Master Number — large-scale vision, manifesting dreams into reality. NEVER reduce to 4." },
  23: { number: 23, title: "Royal Star of the Lion", vibration: "Mercury × 5 / Royal", keyword: "royal-star", detail: "One of the luckiest numbers — protection, royal favour, advancement." },
  24: { number: 24, title: "Love, Money, Creativity", vibration: "Venus × 6", keyword: "love-money", detail: "Lucky for love, money, and creativity." },
  25: { number: 25, title: "Strength Through Focus", vibration: "Mercury × 7", keyword: "focus", detail: "Strength through spiritual focus and discipline." },
  26: { number: 26, title: "Will and Command", vibration: "Saturn × 8 / Karmic Test", keyword: "command", detail: "Will, command — but karmic testing around power. Tests integrity." },
  27: { number: 27, title: "Good Judgment", vibration: "Mars × 9", keyword: "judgment", detail: "Lucky — good judgment, command, trine of Venus." },
  28: { number: 28, title: "Trust and Contradictions", vibration: "Moon × 10", keyword: "trust", detail: "Trust and its contradictions — relying on others as strength and weakness." },
  29: { number: 29, title: "Grace and Knowledge", vibration: "Moon × 11 / Spiritual", keyword: "grace", detail: "Grace, knowledge, but risk of betrayal. Reduces to 11 (master)." },
  30: { number: 30, title: "The Retreat", vibration: "Jupiter × 3 / Lonely", keyword: "retreat", detail: "Expansion that requires solitude." },
  31: { number: 31, title: "Lonely Pioneer", vibration: "Uranus × 4", keyword: "lonely", detail: "Original but isolated." },
  32: { number: 32, title: "Magical Communication", vibration: "Mercury × 5", keyword: "communication", detail: "Magical communication — power to influence through words." },
  33: { number: 33, title: "Master Teacher", vibration: "Master / Christ Consciousness", keyword: "master-teaching", detail: "Master Number — unconditional love, healing, highest spiritual expression. NEVER reduce to 6." },
  34: { number: 34, title: "Spiritual Lone Wolf", vibration: "Uranus × 7", keyword: "spiritual-loner", detail: "Wisdom through solitude." },
  35: { number: 35, title: "Ambition and Danger", vibration: "Mercury × 8", keyword: "ambition-danger", detail: "Ambition paired with danger — tests ethics." },
  36: { number: 36, title: "Creative Realization", vibration: "Venus × 9", keyword: "realization", detail: "Creative realization — work that bears fruit." },
  37: { number: 37, title: "Good Friendship", vibration: "Ketu × 10", keyword: "friendship", detail: "Lucky — good friendship, partnerships that bear fruit." },
  38: { number: 38, title: "Power and Business", vibration: "Saturn × 11", keyword: "business-power", detail: "Power and business success — reduces to 11 (master)." },
  39: { number: 39, title: "Emotional Conflict", vibration: "Mars × 12", keyword: "conflict", detail: "Emotional conflict — tests emotional intelligence." },
  40: { number: 40, title: "Inner Spiritual", vibration: "Uranus × 4", keyword: "inner-awakening", detail: "Inner spiritual awakening — 40 days in the desert." },
  41: { number: 41, title: "Magical Magnetic", vibration: "Mercury × 5", keyword: "magical", detail: "Magical, magnetic, electric." },
  42: { number: 42, title: "Love and Family", vibration: "Venus × 6", keyword: "family-love", detail: "Lucky — love, family, domestic happiness." },
  43: { number: 43, title: "Innovation and Conflict", vibration: "Mars × 7", keyword: "innovation-conflict", detail: "Innovation that meets resistance." },
  44: { number: 44, title: "Karmic Reset (reduces to 8)", vibration: "Saturn × 8", keyword: "karmic-reset", detail: "NOT a master number in Silent Oracle. Reduces to 8 (4+4=8). Karmic system-rebuilder energy." },
  45: { number: 45, title: "Magnetic Pioneer", vibration: "Mercury × 9", keyword: "pioneer", detail: "Magnetic pioneer — combines discipline with versatility." },
  46: { number: 46, title: "Fidelity and Love", vibration: "Venus × 10", keyword: "fidelity", detail: "Lucky — fidelity, lasting love, enduring partnerships." },
  47: { number: 47, title: "Spiritual Lone Wolf (reduces to 11)", vibration: "Ketu × 11", keyword: "spiritual-loner", detail: "Spiritual lone wolf — reduces to 11 (master)." },
  48: { number: 48, title: "Conditional Relationships", vibration: "Saturn × 12", keyword: "conditional", detail: "Conditional relationships — partnerships with strings attached." },
  49: { number: 49, title: "Restrained Spirit", vibration: "Mars × 13", keyword: "restrained", detail: "Wisdom held back by circumstance. Tests patience." },
  50: { number: 50, title: "Freedom and Communication", vibration: "Mercury × 5", keyword: "freedom", detail: "Freedom through communication." },
  51: { number: 51, title: "Powerful Sudden", vibration: "Moon × 6", keyword: "sudden", detail: "Powerful but sudden — explosive potential." },
  52: { number: 52, title: "Sudden Explosive", vibration: "Mercury × 7", keyword: "explosive", detail: "Sudden, explosive change." },
  53: { number: 53, title: "Knowledge and Ambition", vibration: "Jupiter × 8", keyword: "ambition", detail: "Knowledge in service of ambition — tests ethics." },
  54: { number: 54, title: "Brave and True", vibration: "Uranus × 9", keyword: "brave", detail: "Brave and true — tests courage." },
  55: { number: 55, title: "Quantum Teacher (reduces to 1)", vibration: "Mercury × 10", keyword: "quantum", detail: "NOT a master number in Silent Oracle. Reduces to 1 (5+5=10→1). Quantum-thinking energy." },
  56: { number: 56, title: "Knowledge and Loneliness", vibration: "Venus × 11", keyword: "lonely-knowledge", detail: "Knowledge that isolates." },
  57: { number: 57, title: "Variety and Change", vibration: "Ketu × 12", keyword: "variety", detail: "Variety and change — tests commitment." },
  58: { number: 58, title: "Boredom and Loneliness", vibration: "Saturn × 13", keyword: "boredom", detail: "Boredom, loneliness despite material success." },
  59: { number: 59, title: "Personal Change", vibration: "Mars × 14", keyword: "personal-change", detail: "Personal change and reinvention." },
  60: { number: 60, title: "Harmony and Balance", vibration: "Sun × 6", keyword: "harmony", detail: "Lucky — harmony, balance, family wellbeing." },
  61: { number: 61, title: "Family Responsibility", vibration: "Moon × 7", keyword: "family", detail: "Heavy family responsibility — tests the burden of care." },
  62: { number: 62, title: "Good Growth", vibration: "Mercury × 8", keyword: "growth", detail: "Good but slow growth — tests patience." },
  63: { number: 63, title: "Magical Magnetic", vibration: "Jupiter × 9", keyword: "magnetic", detail: "Magical and magnetic." },
  64: { number: 64, title: "Marriage and Family", vibration: "Uranus × 10", keyword: "marriage-family", detail: "Lucky — marriage, family, domestic happiness." },
  65: { number: 65, title: "Lucky Optimistic", vibration: "Venus × 11", keyword: "optimistic", detail: "Lucky and optimistic." },
  66: { number: 66, title: "Master Love (reduces to 3)", vibration: "Venus × 12", keyword: "master-love", detail: "NOT a master number in Silent Oracle. Reduces to 3 (6+6=12→3). Embodiment of love." },
  67: { number: 67, title: "Focus and Success", vibration: "Ketu × 13", keyword: "focus-success", detail: "Focus that brings success — slowly. Tests long-term commitment." },
  68: { number: 68, title: "Hardworking Balanced", vibration: "Saturn × 14", keyword: "hardworking", detail: "Hardworking, balanced success." },
  69: { number: 69, title: "Magical Success", vibration: "Mars × 15", keyword: "magical-success", detail: "Lucky — magical success through balanced polarity." },
  70: { number: 70, title: "Spiritual Focus", vibration: "Sun × 7", keyword: "spiritual-focus", detail: "Lucky — spiritual focus, inner wisdom." },
  71: { number: 71, title: "Good Optimistic", vibration: "Moon × 8", keyword: "optimistic", detail: "Lucky — good, optimistic, with karmic testing." },
  72: { number: 72, title: "Business Success", vibration: "Mercury × 9", keyword: "business", detail: "Business success through communication." },
  73: { number: 73, title: "Strong Intelligent", vibration: "Jupiter × 10", keyword: "strong-intelligent", detail: "Lucky — strong, intelligent, destined for recognition." },
  74: { number: 74, title: "Spiritual Perfect", vibration: "Uranus × 11", keyword: "spiritual-perfect", detail: "Spiritual perfection sought through solitude." },
  75: { number: 75, title: "Rebel Freedom", vibration: "Venus × 12", keyword: "rebel", detail: "Rebel energy — freedom sought through resistance." },
  76: { number: 76, title: "Conflict Anxiety", vibration: "Ketu × 13", keyword: "anxiety", detail: "Conflict, anxiety, karmic testing." },
  77: { number: 77, title: "Spiritual Mystical (reduces to 5)", vibration: "Ketu × 14", keyword: "mystical", detail: "NOT a master number in Silent Oracle. Reduces to 5 (7+7=14→5). Mystical energy." },
  78: { number: 78, title: "Conflict Financial", vibration: "Saturn × 15", keyword: "financial-conflict", detail: "Conflict through money — tests money ethics." },
  79: { number: 79, title: "Spiritual Political", vibration: "Mars × 16", keyword: "political-spiritual", detail: "Spiritual work that intersects with politics." },
  80: { number: 80, title: "Business Success", vibration: "Sun × 8", keyword: "business-success", detail: "Lucky — business success, financial mastery." },
  81: { number: 81, title: "Magical Success", vibration: "Moon × 9", keyword: "magical-success", detail: "Lucky — magical success through spiritual wisdom." },
  82: { number: 82, title: "Strong Business", vibration: "Mercury × 10", keyword: "strong-business", detail: "Lucky — strong, successful business." },
  83: { number: 83, title: "Storm Spiritual", vibration: "Jupiter × 11", keyword: "storm-spiritual", detail: "Storm before spiritual clarity." },
  84: { number: 84, title: "Love Balance", vibration: "Uranus × 12", keyword: "love-balance", detail: "Lucky — love, balance, financial stability." },
  85: { number: 85, title: "Rebel Change", vibration: "Venus × 13", keyword: "rebel-change", detail: "Rebel change — transformation through resistance." },
  86: { number: 86, title: "Love Family", vibration: "Ketu × 14", keyword: "love-family", detail: "Lucky — love, family, domestic happiness through disciplined effort." },
  87: { number: 87, title: "Magnetic Focus", vibration: "Saturn × 15", keyword: "magnetic-focus", detail: "Magnetic focus — power combined with wisdom." },
  88: { number: 88, title: "Material Abundance (reduces to 7)", vibration: "Saturn × 16", keyword: "abundance", detail: "NOT a master number in Silent Oracle. Reduces to 7 (8+8=16→7). In Chinese culture, 88 is doubly fortunate." },
  89: { number: 89, title: "Conflict Financial", vibration: "Mars × 17", keyword: "financial-conflict", detail: "Conflict through money, especially legal or partnership money." },
  90: { number: 90, title: "Spiritual Awakening", vibration: "Sun × 9", keyword: "spiritual-awakening", detail: "Lucky — spiritual awakening, completion, universal service." },
  91: { number: 91, title: "Spiritual Transformation", vibration: "Moon × 10", keyword: "spiritual-transformation", detail: "Lucky — spiritual transformation through disciplined practice." },
  92: { number: 92, title: "Spiritual Success", vibration: "Mercury × 11", keyword: "spiritual-success", detail: "Lucky — spiritual success through communication." },
  93: { number: 93, title: "Family Magic", vibration: "Jupiter × 12", keyword: "family-magic", detail: "Lucky — family magic, spiritual creativity." },
  94: { number: 94, title: "Magical Completion", vibration: "Uranus × 13", keyword: "magical-completion", detail: "Lucky — magical completion, work that finishes well." },
  95: { number: 95, title: "Magical Success", vibration: "Venus × 14", keyword: "magical-success", detail: "Lucky — magical success through disciplined versatility." },
  96: { number: 96, title: "Magical Perfection", vibration: "Ketu × 15", keyword: "magical-perfection", detail: "Lucky — magical perfection, work that achieves completeness." },
  97: { number: 97, title: "Spiritual Perfect", vibration: "Saturn × 16", keyword: "spiritual-perfect", detail: "Lucky — spiritual perfection through disciplined wisdom." },
  98: { number: 98, title: "Spiritual Success", vibration: "Mars × 17", keyword: "spiritual-success", detail: "Spiritual success through service and courage." },
  99: { number: 99, title: "Universal (reduces to 9)", vibration: "Mars × 18", keyword: "universal", detail: "NOT a master number in Silent Oracle. Reduces to 9 (9+9=18→9). Universal completion energy." },
};

export function getCompoundMeaning(n: number): CompoundMeaning | undefined {
  const entry = COMPOUND_MEANINGS[n];
  if (!entry) return undefined;
  const { root, isMaster, isKarmicDebt, karmicDebtAs } = reduceWithCompoundStrict(n);
  return { ...entry, root, isMaster, isKarmicDebt, karmicDebtAs };
}

export function isMasterNumber(n: number): boolean {
  return MASTER_NUMBERS.has(n);
}

export function getKarmicDebtInfo(n: number): { reducesTo: number; lesson: string } | undefined {
  return KARMIC_DEBT[n];
}

// ─── WEALTH & MONEY Numbers (strict Silent Oracle) ────────────────────────────
// Per The spec:
//   - WEALTH number (compound): ONLY 28. The single "wealth compound"
//     in the the numerology system. Indicates material abundance through trust,
//     negotiation, and partnership.
//   - MONEY number (root): 8. The primary money number — Saturn's
//     material mastery, financial power, karmic accounting.
//   - MONEY numbers (lesser-known): 13 and 22. 13 is karmic debt 13/4
//     but in material context signals "money through hard work";
//     22 is the master builder — money through large-scale execution.
//
// Important: "wealth" and "money" are DISTINCT categories.
//   - WEALTH = 28 (compound) — overriding, indicates abundance
//   - MONEY (primary) = 8 (root) — material/financial power
//   - MONEY (lesser) = 13, 22 (root) — money through specific channels
//
// Only compound 28 gets the "Wealth" tag. Root 8 gets "Money".
// Roots 13 and 22 get "Money (lesser)". Other numbers get neither.
export const WEALTH_COMPOUND = new Set([28]);

export function isWealthCompound(n: number): boolean {
  return WEALTH_COMPOUND.has(n);
}

// Money numbers are checked on the REDUCED ROOT.
export const MONEY_ROOTS = new Set([8]);
export const MONEY_ROOTS_LESSER = new Set([13, 22]);

export function isMoneyRoot(n: number): boolean {
  return MONEY_ROOTS.has(n);
}
export function isMoneyLesserRoot(n: number): boolean {
  return MONEY_ROOTS_LESSER.has(n);
}

export type MoneyCategory = "wealth" | "money" | "money-lesser" | null;

/**
 * Returns the money/wealth category for a number.
 * - "wealth"       → compound 28 (checked on compound, not root)
 * - "money"        → root 8 (Saturn's material mastery)
 * - "money-lesser" → root 13 or 22 (lesser-known money channels)
 * - null           → no money/wealth association
 *
 * Note: 13 is normally a Karmic Debt (13/4) — but in a money context
 * it signals "money through disciplined hard work". 22 is the Master
 * Builder — money through large-scale execution.
 */
export function getMoneyCategory(compound: number, root: number): MoneyCategory {
  if (isWealthCompound(compound)) return "wealth";
  if (isMoneyRoot(root)) return "money";
  if (isMoneyLesserRoot(root)) return "money-lesser";
  return null;
}

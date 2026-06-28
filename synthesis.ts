/**
 * Numerology Synthesis Engine — PURE NUMEROLOGY (no Chinese astrology)
 * ----------------------------------------------------------------------
 * Produces a unified personality analysis, life forecast, and
 * recommendations from the numerology chart alone.
 */

import type { NumerologyChart } from "../numerology/numerology-engine";
import { personalYearForEffectiveYear } from "../numerology/numerology-engine";
import {
  NUMEROLOGY_MEANINGS,
  PERSONAL_YEAR_FORECASTS,
  ATTITUDE_MEANINGS,
  getMeaning,
} from "../numerology/interpretations";
import { getCompoundMeaning } from "../numerology/compound";

export interface PredictionReport {
  // ── Headline ────────────────────────────────────────────────────────
  headline: string;
  oneLineArchetype: string;

  // ── Compound Classifications (master + karmic debt flags) ─────
  numerologyClassification: {
    lifePath: { compound: number; root: number; isMaster: boolean; title: string; vibration: string };
    birthDay: { compound: number; root: number; isMaster: boolean; title: string; vibration: string };
    expression: { compound: number; root: number; isMaster: boolean; title: string; vibration: string };
    soulUrge: { compound: number; root: number; isMaster: boolean; title: string; vibration: string };
    personality: { compound: number; root: number; isMaster: boolean; title: string; vibration: string };
    overallVerdict: "favorable" | "caution" | "challenging" | null;
    overallSummary: string;
    wealthHighlight: string | null;
  };

  // ── Core Profile ────────────────────────────────────────────────────
  coreProfile: {
    lifePath: { number: number; title: string; archetype: string; summary: string; planet: string };
    attitude: { number: number; description: string };
  };

  // ── Personality Synthesis ───────────────────────────────────────────
  personality: {
    strengths: string[];
    challenges: string[];
    hiddenPotential: string;
    shadow: string;
    missingNumbers: number[];  // missing numbers in birth name
  };

  // ── Career & Vocation ───────────────────────────────────────────────
  career: {
    recommended: string[];
    avoid: string[];
    idealEnvironment: string;
    wealthStyle: string;
  };

  // ── Relationships ───────────────────────────────────────────────────
  relationships: {
    style: string;
    bestMatches: string[];
    challengingMatches: string[];
    advice: string;
  };

  // ── Health & Lifestyle ──────────────────────────────────────────────
  health: {
    system: string;
    practices: string[];
  };

  // ── Lucky Resonances ────────────────────────────────────────────────
  lucky: {
    numbers: number[];
    colors: string[];
    days: string[];
  };

  // ── Current Cycle Forecast (this year) ──────────────────────────────
  forecast: {
    personalYear: { number: number; theme: string; guidance: string; focus: string[]; caution: string; effectiveYear: number; birthdayPassed: boolean };
    combinedGuidance: string;
  };

  // ── Multi-year roadmap ──────────────────────────────────────────────
  roadmap: {
    age: number;
    personalYear: number;
    pinnacle?: number;
    theme: string;
  }[];

  // ── Final Synthesis Statement ───────────────────────────────────────
  finalSynthesis: string;
}

export interface SynthesisInput {
  chart: NumerologyChart;
  birth: { year: number; month: number; day: number };
  age: number;
  currentYear: number;
}

// Compatibility table from the numerology spec
const NATURAL_ALLIES: Record<number, number[]> = {
  1: [5], 2: [6], 3: [9], 4: [8], 5: [1],
  6: [2], 7: [7], 8: [4], 9: [3],
  11: [2, 4], 22: [4, 8], 33: [6, 9],
};
const CHALLENGING_PAIRS: Record<number, number[]> = {
  1: [4], 4: [1, 5], 5: [4], 8: [3], 3: [8],
};

export function synthesize(input: SynthesisInput): PredictionReport {
  const { chart, birth, age, currentYear } = input;

  const lpMeaning = getMeaning(chart.lifePath.root) ?? NUMEROLOGY_MEANINGS[1];
  const pyForecast = PERSONAL_YEAR_FORECASTS[chart.personalYear.number] ?? PERSONAL_YEAR_FORECASTS[1];

  // ── Compound classification block ──────────────────────────────────
  const lpC = getCompoundMeaning(chart.lifePath.root);
  const bdC = getCompoundMeaning(chart.birthDay.root);
  const expC = getCompoundMeaning(chart.expression.root);
  const soulC = getCompoundMeaning(chart.soulUrge.root);
  const persC = getCompoundMeaning(chart.personality.root);

  const masterCount = [chart.lifePath, chart.expression, chart.soulUrge, chart.personality].filter(x => x.isMaster).length;

  const overallVerdict = null;

  const overallSummary =
    `Numerology analysis. ${masterCount > 0 ? `${masterCount} Master Number${masterCount === 1 ? "" : "s"} in the core chart. ` : "No master numbers in the core chart — stable, workable energy. "}Life Path ${chart.lifePath.root}, Expression ${chart.expression.root}, Soul Urge ${chart.soulUrge.root}, Personality ${chart.personality.root}.`;

  const wealthHighlight = null;

  // ── Personality synthesis ───────────────────────────────────────────
  const strengths = Array.from(new Set([
    ...lpMeaning.strengths.slice(0, 3),
  ]));
  const challenges = Array.from(new Set([
    ...lpMeaning.challenges.slice(0, 2),
  ]));

  const hiddenPotential =
    masterCount > 0
      ? `You carry a Master Number (${[chart.lifePath, chart.expression, chart.soulUrge, chart.personality].filter(x => x.isMaster).map(x => x.root).join(", ")}). Per chart: a Master is a calling, not a guarantee — must be consciously activated. You will experience higher highs AND lower lows than non-master charts. Shadows include anxiety (11), overwhelm (22), or martyrdom (33).`
      : `Your chart contains no Master Numbers in the core triad — this grants stability. Gifts are accessible, embodied, and consistent. Mastery for you comes through depth of practice, not karmic pressure.`;

  const shadow = challenges[0]
    ? `Your dominant shadow pattern is ${challenges[0].toLowerCase().replace(/\.$/, "")}. When triggered, it amplifies ${challenges[1]?.toLowerCase().replace(/\.$/, "") ?? "secondary patterns"}. The work is to interrupt this pattern in the body — breath, movement, or vocal expression — before it cascades.`
    : "Stay present to your edge.";

  // ── Career ──────────────────────────────────────────────────────────
  const career = lpMeaning.career.slice(0, 6);
  const avoidMap: Record<number, string[]> = {
    1: ["subordinate roles with no autonomy", "bureaucratic hierarchies", "work that demands conformity"],
    2: ["high-pressure sales floors", "confrontational environments", "isolated solo work"],
    3: ["tedious repetitive work", "isolated back-office roles", "occupations with no creative outlet"],
    4: ["constantly-travelling nomadic roles", "high-instability startups", "purely abstract theory"],
    5: ["rigid micro-managed routines", "occupations requiring long-term stillness", "bureaucratic compliance work"],
    6: ["cut-throat competitive environments", "ethically ambiguous fields", "cold transactional work"],
    7: ["loud confrontational environments", "surface-level social roles", "sales-driven pressure cookers"],
    8: ["unstructured creative chaos", "occupations with no growth path", "purely service-without-power roles"],
    9: ["narrowly selfish work", "rigid bureaucratic compliance", "purely commercial work without mission"],
    11: ["soul-crushing routine", "aggressive high-pressure environments", "work that demands conformity"],
    22: ["small-scale work with no vision", "purely theoretical work with no execution", "fragmented scattered roles"],
    33: ["cynical or harmful industries", "purely transactional work", "isolated work without service"],
  };
  const avoid = avoidMap[chart.lifePath.root] ?? ["work that misaligns with your core archetype"];
  const idealEnvironment = `An environment that lets your ${lpMeaning.title} (${lpMeaning.archetype}) energy express fully — aligns with your ruling planet (${lpMeaning.planet}).`;
  const wealthStyle =
    chart.lifePath.root === 8 ? "Wealth comes through disciplined accumulation, long-term assets, and ethical stewardship of power."
    : chart.lifePath.root === 5 ? "Wealth comes through versatility, multiple income streams, and opportunistic pivots — save aggressively during windfall years."
    : chart.lifePath.root === 6 ? "Wealth comes through relationship capital, aesthetic sensibility, and steady service — avoid speculative risk."
    : chart.lifePath.root === 1 ? "Wealth comes through pioneering ventures and being first to market — founding equity matters more than salary."
    : chart.lifePath.root === 3 ? "Wealth comes through communication, brand, and creative IP — monetize your voice."
    : chart.lifePath.root === 9 ? "Wealth comes through completing cycles and closing what others abandon — Mars-ruled courage to finish brings material reward."
    : chart.lifePath.root === 11 ? "Wealth comes through inspired leadership — channel higher vision into a movement or brand."
    : chart.lifePath.root === 22 ? "Wealth comes through building institutions at scale — master-builder equity is the path."
    : chart.lifePath.root === 33 ? "Wealth comes through teaching, healing, and embodying universal love at scale."
    : "Wealth comes through mastery of a specific craft and patient compounding of reputation.";

  // ── Relationships ───────────────────────────────────────────────────
  const allies = NATURAL_ALLIES[chart.lifePath.root] ?? [];
  const challenging = CHALLENGING_PAIRS[chart.lifePath.root] ?? [];
  const bestMatches = allies.map(n => `Life Path ${n}`);
  const challengingMatches = challenging.map(n => `Life Path ${n}`);
  const relationshipStyle = `${lpMeaning.archetype}. In love you are ${lpMeaning.traits.slice(0, 2).join(" and ")}, but you also need ${lpMeaning.traits[0]} from a partner. The right partner honours both.`;
  const relationshipAdvice = lpMeaning.relationships;

  // ── Health ──────────────────────────────────────────────────────────
  const practices: string[] = [lpMeaning.health];
  if (chart.lifePath.root === 11) practices.push("Protect your nervous system — limit stimulants, prioritize sleep, ground in nature");
  if (chart.lifePath.root === 22) practices.push("Manage cortisol through disciplined routine — your scale of vision creates physical stress");
  if (chart.lifePath.root === 33) practices.push("Practice receiving — your caregiver energy can deplete if you don't let others care for you");

  // ── Lucky resonances ────────────────────────────────────────────────
  const luckyNumbers = Array.from(new Set([chart.lifePath.root, ...lpMeaning.luckyNumbers])).slice(0, 6);
  const luckyColors = lpMeaning.luckyColors.slice(0, 5);
  const luckyDays = lpMeaning.luckyDays;

  // ── Personal Year forecast ──────────────────────────────────────────
  const combinedGuidance =
    `Your Personal Year is ${chart.personalYear.number} (${pyForecast.theme}), based on effective year ${chart.personalYear.effectiveYear} (${chart.personalYear.birthdayPassed ? "birthday has passed" : "before birthday — still in prior year's cycle"}). ` +
    (chart.personalYear.number === 1 ? "Launch new ventures. Plant seeds for the next 9-year cycle. Hesitation now costs 9 years of momentum."
    : chart.personalYear.number === 9 ? "Your 9-year cycle is closing. Release what is finishing — do not start major new ventures until next personal year 1."
    : chart.personalYear.number === 5 ? "Change is the dominant theme. Say yes to invitations, but protect your sleep and your core relationships."
    : chart.personalYear.number === 8 ? "Harvest year — money, recognition, and power increase. Karmic justice — what you have built ethically returns."
    : chart.personalYear.number === 11 ? "Master illumination year — inspiration flows, others are drawn to your light. Operate at 11, not collapsed into 2."
    : chart.personalYear.number === 22 ? "Master builder year — large-scale projects materialise. Operate at 22, not collapsed into 4."
    : chart.personalYear.number === 33 ? "Master teacher year — embodiment of love in service. Operate at 33, not collapsed into 6."
    : `Align your actions with the Personal Year theme — it is the dominant timing signal this year.`);

  // ── Roadmap: next 9 personal years ──────────────────────────────────
  // CRITICAL: compute each year's Personal Year using the actual
  // straight-across formula for that year (NOT a 1-9 cycle). This is
  // the only way Master Numbers like 22, 33, 11 can appear in the
  // roadmap. Example: a person born Dec 18 1992 turns 34 on Dec 18 2026
  // — for that year, the digits 1+2+1+8+2+0+2+6 = 22 (Master).
  //
  // Year mapping: the personal year that is "in effect" during a given
  // age is determined by whether the birthday has passed in that
  // calendar year. For a roadmap of future ages, we approximate by
  // using the calendar year in which the birthday falls.
  const roadmap: { age: number; personalYear: number; pinnacle?: number; theme: string }[] = [];
  for (let i = 0; i < 9; i++) {
    const ageAt = age + i;
    // Calendar year in which the person turns this age (birthday year).
    const birthYear = currentYear - age; // year person was born
    const yearAtAge = birthYear + ageAt; // calendar year of this birthday
    // The personal year that BEGINS on this birthday uses `yearAtAge`
    // as the effective year.
    const py = personalYearForEffectiveYear(
      { year: birth.year, month: birth.month, day: birth.day },
      yearAtAge,
    );
    const f = PERSONAL_YEAR_FORECASTS[py] ?? PERSONAL_YEAR_FORECASTS[1];
    const pn = chart.pinnacles.find(p => ageAt >= p.ageStart && ageAt <= p.ageEnd);
    roadmap.push({
      age: ageAt,
      personalYear: py,
      pinnacle: pn?.number,
      theme: f.theme,
    });
  }

  // ── Headline & archetype ────────────────────────────────────────────
  const headline = `${lpMeaning.title} — Life Path ${chart.lifePath.root}${chart.lifePath.isMaster ? " (MASTER)" : ""}`;
  const oneLineArchetype =
    `${lpMeaning.archetype} — animated by ${lpMeaning.planet}. Birthday Number (Partial Energy) ${chart.birthDay.root}, Expression ${chart.expression.root}, Soul Urge ${chart.soulUrge.root}, Personality ${chart.personality.root}.`;

  // ── Final synthesis ─────────────────────────────────────────────────
  const finalSynthesis =
    `Your numerology chart reveals Life Path ${chart.lifePath.root}${chart.lifePath.isMaster ? " (Master Number — never reduce)" : ""} — the ${lpMeaning.title}. ` +
    `${lpMeaning.summary} ` +
    (masterCount > 0
      ? `The presence of Master Number${masterCount === 1 ? "" : "s"} raises the stakes — you are wired for higher service and will experience higher highs and lower lows. `
      : `Your numbers are grounded and embodied — gifts are accessible rather than overwhelming. `) +
    `In this current Personal Year ${chart.personalYear.number} cycle, the work is: ${pyForecast.guidance.toLowerCase().split(".")[0]}. ` +
    `Your compatible partners share ${allies.length > 0 ? allies.map(a => `Life Path ${a}`).join(" or ") : "your own Life Path"} energy; your growth edge is ${challenges[0]?.toLowerCase() ?? "self-awareness"}. ` +
    (chart.missingNumbers.length > 0
      ? `Missing numbers in your birth name: ${chart.missingNumbers.join(", ")} — develop these qualities in this lifetime. `
      : ``) +
    `Build your life around ${lpMeaning.archetype} expression and you will fulfill the chart's promise.`;

  return {
    headline,
    oneLineArchetype,
    numerologyClassification: {
      lifePath: { compound: chart.lifePath.compound, root: chart.lifePath.root, isMaster: chart.lifePath.isMaster, title: lpC?.title ?? "—", vibration: lpC?.vibration ?? "—" },
      birthDay: { compound: chart.birthDay.compound, root: chart.birthDay.root, isMaster: chart.birthDay.isMaster, title: bdC?.title ?? "—", vibration: bdC?.vibration ?? "—" },
      expression: { compound: chart.expression.compound, root: chart.expression.root, isMaster: chart.expression.isMaster, title: expC?.title ?? "—", vibration: expC?.vibration ?? "—" },
      soulUrge: { compound: chart.soulUrge.compound, root: chart.soulUrge.root, isMaster: chart.soulUrge.isMaster, title: soulC?.title ?? "—", vibration: soulC?.vibration ?? "—" },
      personality: { compound: chart.personality.compound, root: chart.personality.root, isMaster: chart.personality.isMaster, title: persC?.title ?? "—", vibration: persC?.vibration ?? "—" },
      overallVerdict,
      overallSummary,
      wealthHighlight,
    },
    coreProfile: {
      lifePath: {
        number: chart.lifePath.root,
        title: lpMeaning.title,
        archetype: lpMeaning.archetype,
        summary: lpMeaning.summary,
        planet: lpMeaning.planet,
      },
      attitude: {
        number: chart.attitude.root,
        description: ATTITUDE_MEANINGS[chart.attitude.root] ?? "",
      },
    },
    personality: {
      strengths,
      challenges,
      hiddenPotential,
      shadow,
      missingNumbers: chart.missingNumbers,
    },
    career: {
      recommended: career,
      avoid,
      idealEnvironment,
      wealthStyle,
    },
    relationships: {
      style: relationshipStyle,
      bestMatches,
      challengingMatches,
      advice: relationshipAdvice,
    },
    health: {
      system: lpMeaning.health,
      practices,
    },
    lucky: {
      numbers: luckyNumbers,
      colors: luckyColors,
      days: luckyDays,
    },
    forecast: {
      personalYear: {
        number: pyForecast.number,
        theme: pyForecast.theme,
        guidance: pyForecast.guidance,
        focus: pyForecast.focus,
        caution: pyForecast.caution,
        effectiveYear: chart.personalYear.effectiveYear,
        birthdayPassed: chart.personalYear.birthdayPassed,
      },
      combinedGuidance,
    },
    roadmap,
    finalSynthesis,
  };
}

/**
 * Unified Analyzer Dispatcher — GG33 + Chinese Year Sign
 * ----------------------------------------------------------------------
 * Routes a prediction request to the correct analyzer:
 *   - person    → GG33 numerology + Chinese year sign
 *   - company   → GG33 company analyzer (registered name + founding date)
 *   - country   → GG33 entity analyzer (country name + founding/independence date)
 *   - sports    → GG33 sports event predictor
 */

import { buildGg33Chart } from "../numerology/gg33";
import type { BirthDate } from "../numerology/gg33";
import { getMeaning, NUMEROLOGY_MEANINGS } from "../numerology/interpretations";
import { synthesize } from "./synthesis";
import { buildEntityChart, buildCompanyChart } from "../numerology/company";
import { predictSportsEvent } from "../numerology/sports";
import type { TeamInput, SportType, PlayerInput } from "../numerology/sports";
import { getChineseYearSignFromDate, zodiacCompatibility } from "../astrology/zodiac";
import type { ChineseYearSign } from "../astrology/zodiac";

export type EntityType = "person" | "company" | "country" | "sports";

export interface AnalyzeRequest {
  entityType: EntityType;

  // Person
  fullName?: string;
  birthDate?: string;       // yyyy-mm-dd
  gender?: "male" | "female" | "other" | null;
  partnerName?: string | null;
  partnerBirthDate?: string | null;

  // Company / Country
  companyName?: string;     // also used for country name
  countryName?: string;     // alias for clarity
  foundingDate?: string;    // founding / independence date
  industry?: string;        // optional industry (companies) or region tag

  // Sports
  sportType?: SportType;
  eventDate?: string;
  team1Name?: string;
  team1City?: string;
  team1FoundingYear?: number;
  team1Jerseys?: number[];
  team1Players?: PlayerInput[];
  team2Name?: string;
  team2City?: string;
  team2FoundingYear?: number;
  team2Jerseys?: number[];
  team2Players?: PlayerInput[];
}

function parseISODate(s?: string, minYear: number = 1900): { year: number; month: number; day: number; date: Date } | null {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  if (year < minYear || year > 2200) return null;
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return { year, month, day, date };
}

export interface AnalysisResult {
  entityType: EntityType;
  // Person
  gg33Chart?: ReturnType<typeof buildGg33Chart>;
  report?: ReturnType<typeof synthesize>;
  companions?: {
    lifePathMeaning: ReturnType<typeof getMeaning>;
    numerologyMeanings: typeof NUMEROLOGY_MEANINGS;
  };
  // Chinese year sign (person, company, country)
  chineseYearSign?: ChineseYearSign;
  // Partner (person compatibility)
  partnerChart?: ReturnType<typeof buildGg33Chart>;
  partnerChineseYearSign?: ChineseYearSign;
  compatibility?: {
    lpTier: "aligned" | "complementary" | "challenging" | "neutral";
    lpScore: number;
    lp1: number;
    lp2: number;
    lp1Title: string;
    lp2Title: string;
    zodiacTier: string;
    zodiacScore: number;
    zodiacLabel: string;
    zodiacDescription: string;
    zodiac1: string;
    zodiac2: string;
    py1: number;
    py2: number;
    pyAlignment: "powerful" | "aligned" | "friction" | "neutral";
    partnerName: string;
    partnerBirthDate: string;
  } | null;
  // Company / Country
  entityChart?: ReturnType<typeof buildEntityChart>;
  companyChart?: ReturnType<typeof buildCompanyChart>; // alias for backward compat
  // Sports
  sportsPrediction?: ReturnType<typeof predictSportsEvent>;
  inputs: Record<string, unknown>;
}

export async function analyze(req: AnalyzeRequest): Promise<AnalysisResult> {
  if (req.entityType === "person") {
    if (!req.fullName || !req.birthDate) {
      throw new Error("Person analysis requires fullName and birthDate.");
    }
    const parsed = parseISODate(req.birthDate);
    if (!parsed) throw new Error("birthDate must be ISO yyyy-mm-dd between 1900 and 2200");

    const gg33 = buildGg33Chart({
      fullName: req.fullName,
      birth: { year: parsed.year, month: parsed.month, day: parsed.day },
    });

    const now = new Date();
    const age = now.getFullYear() - parsed.year;
    const report = synthesize({
      gg33,
      birth: { year: parsed.year, month: parsed.month, day: parsed.day },
      age,
      currentYear: now.getFullYear(),
    });

    const lpMeaning = getMeaning(gg33.lifePath.root);

    const chineseYearSign = getChineseYearSignFromDate(parsed.year, parsed.month, parsed.day);

    // ── Partner compatibility (optional) ──────────────────────────────
    let partnerChart: ReturnType<typeof buildGg33Chart> | undefined;
    let partnerChineseYearSign: ChineseYearSign | undefined;
    let compatibility: AnalysisResult["compatibility"] = null;

    if (req.partnerName && req.partnerBirthDate) {
      const partnerParsed = parseISODate(req.partnerBirthDate);
      if (partnerParsed) {
        partnerChart = buildGg33Chart({
          fullName: req.partnerName,
          birth: { year: partnerParsed.year, month: partnerParsed.month, day: partnerParsed.day },
        });
        partnerChineseYearSign = getChineseYearSignFromDate(partnerParsed.year, partnerParsed.month, partnerParsed.day);

        // Life Path compatibility
        const lp1 = gg33.lifePath.root;
        const lp2 = partnerChart.lifePath.root;
        const NATURAL_ALLIES: Record<number, number[]> = {
          1: [5], 2: [6], 3: [9], 4: [8], 5: [1], 6: [2], 7: [7], 8: [4], 9: [3],
          11: [2, 4], 22: [4, 8], 33: [6, 9],
        };
        const CHALLENGING_PAIRS: Record<number, number[]> = {
          1: [4], 4: [1, 5], 5: [4], 8: [3], 3: [8],
        };
        let lpTier: "aligned" | "complementary" | "challenging" | "neutral" = "neutral";
        let lpScore = 60;
        if (NATURAL_ALLIES[lp1]?.includes(lp2) || NATURAL_ALLIES[lp2]?.includes(lp1)) {
          lpTier = "aligned"; lpScore = 90;
        } else if (lp1 === lp2) {
          lpTier = "complementary"; lpScore = 75;
        } else if (CHALLENGING_PAIRS[lp1]?.includes(lp2) || CHALLENGING_PAIRS[lp2]?.includes(lp1)) {
          lpTier = "challenging"; lpScore = 40;
        }

        // Chinese zodiac compatibility
        const zodiacCompat = zodiacCompatibility(chineseYearSign.animal, partnerChineseYearSign.animal);

        // Personal Year alignment
        const py1 = gg33.personalYear.number;
        const py2 = partnerChart.personalYear.number;
        let pyAlignment: "powerful" | "aligned" | "friction" | "neutral" = "neutral";
        if (py1 === py2) pyAlignment = "powerful";
        else if (Math.abs(py1 - py2) <= 2) pyAlignment = "aligned";
        else if (Math.abs(py1 - py2) >= 5) pyAlignment = "friction";

        compatibility = {
          lpTier,
          lpScore,
          lp1,
          lp2,
          lp1Title: lpMeaning?.title ?? "—",
          lp2Title: getMeaning(lp2)?.title ?? "—",
          zodiacTier: zodiacCompat.tier,
          zodiacScore: zodiacCompat.score,
          zodiacLabel: zodiacCompat.label,
          zodiacDescription: zodiacCompat.description,
          zodiac1: chineseYearSign.animal,
          zodiac2: partnerChineseYearSign.animal,
          py1,
          py2,
          pyAlignment,
          partnerName: req.partnerName,
          partnerBirthDate: req.partnerBirthDate,
        };
      }
    }

    return {
      entityType: "person",
      gg33Chart: gg33,
      report,
      companions: {
        lifePathMeaning: lpMeaning,
        numerologyMeanings: NUMEROLOGY_MEANINGS,
      },
      chineseYearSign,
      partnerChart,
      partnerChineseYearSign,
      compatibility,
      inputs: {
        fullName: req.fullName,
        birthDate: req.birthDate,
        gender: req.gender ?? null,
        partnerName: req.partnerName ?? null,
        partnerBirthDate: req.partnerBirthDate ?? null,
      },
    };
  }

  if (req.entityType === "company" || req.entityType === "country") {
    const name = req.entityType === "country" ? (req.countryName ?? req.companyName) : req.companyName;
    if (!name || !req.foundingDate) {
      throw new Error(`${req.entityType === "country" ? "Country" : "Company"} analysis requires ${req.entityType === "country" ? "countryName" : "companyName"} and foundingDate.`);
    }
    const minYear = req.entityType === "country" ? 1500 : 1900;
    const parsed = parseISODate(req.foundingDate, minYear);
    if (!parsed) throw new Error(`foundingDate must be ISO yyyy-mm-dd between ${minYear} and 2200`);

    const entityChart = buildEntityChart({
      entityType: req.entityType === "country" ? "country" : "company",
      name,
      foundingDate: { year: parsed.year, month: parsed.month, day: parsed.day },
      industry: req.industry,
    });

    // Chinese year sign for the founding/independence year
    const chineseYearSign = getChineseYearSignFromDate(parsed.year, parsed.month, parsed.day);

    return {
      entityType: req.entityType,
      entityChart,
      companyChart: entityChart, // backward-compat alias
      chineseYearSign,
      inputs: {
        name,
        foundingDate: req.foundingDate,
        industry: req.industry ?? null,
      },
    };
  }

  if (req.entityType === "sports") {
    if (!req.eventDate || !req.team1Name || !req.team2Name) {
      throw new Error("Sports analysis requires eventDate, team1Name, and team2Name.");
    }
    const parsed = parseISODate(req.eventDate);
    if (!parsed) throw new Error("eventDate must be ISO yyyy-mm-dd between 1900 and 2200");

    // Parse player birthDate strings into BirthDate objects
    const parsePlayers = (players?: PlayerInput[]): PlayerInput[] | undefined => {
      if (!players || players.length === 0) return undefined;
      return players.map(p => {
        if (typeof p.birthDate === "string") {
          const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(p.birthDate as string);
          if (m) {
            return { ...p, birthDate: { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) } };
          }
          const { ...rest } = p;
          return rest as PlayerInput;
        }
        return p;
      });
    };

    const team1: TeamInput = {
      name: req.team1Name,
      city: req.team1City,
      foundingYear: req.team1FoundingYear,
      keyJerseyNumbers: req.team1Jerseys,
      players: parsePlayers(req.team1Players),
    };
    const team2: TeamInput = {
      name: req.team2Name,
      city: req.team2City,
      foundingYear: req.team2FoundingYear,
      keyJerseyNumbers: req.team2Jerseys,
      players: parsePlayers(req.team2Players),
    };

    const sportsPrediction = predictSportsEvent(
      { year: parsed.year, month: parsed.month, day: parsed.day },
      team1,
      team2,
      req.sportType ?? "Soccer (Football)",
    );

    const chineseYearSign = getChineseYearSignFromDate(parsed.year, parsed.month, parsed.day);

    return {
      entityType: "sports",
      sportsPrediction,
      chineseYearSign,
      inputs: {
        sportType: req.sportType ?? "Soccer (Football)",
        eventDate: req.eventDate,
        team1Name: req.team1Name,
        team1City: req.team1City ?? null,
        team1FoundingYear: req.team1FoundingYear ?? null,
        team1Jerseys: req.team1Jerseys ?? [],
        team1Players: req.team1Players ?? [],
        team2Name: req.team2Name,
        team2City: req.team2City ?? null,
        team2FoundingYear: req.team2FoundingYear ?? null,
        team2Jerseys: req.team2Jerseys ?? [],
        team2Players: req.team2Players ?? [],
      },
    };
  }

  throw new Error(`Unknown entity type: ${req.entityType as string}`);
}

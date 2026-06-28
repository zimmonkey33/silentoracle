/**
 * Silent Oracle Sports Event Predictor — All-Sport Edition
 * ----------------------------------------------------------------------
 * Supports any sport (soccer, basketball, NFL, baseball, hockey, tennis,
 * cricket, rugby, F1, golf, boxing, MMA, etc.).
 *
 * Per team:
 *   - Name (Pythagorean) → name number with master/karmic/wealth/money tags
 *   - Optional city
 *   - Optional founding year → team Chinese zodiac year sign
 *   - Optional key jersey numbers
 *   - Optional player birthdays → each player's Silent Oracle Life Path + Chinese zodiac
 *
 * Per event:
 *   - Event date → Universal Day (straight-across sum)
 *   - Event year → Chinese zodiac year sign
 */

import type { BirthDate } from "./numerology-engine";
import { nameToNumber, reduceNumberStrict, lifePathNumber } from "./numerology-engine";
import {
  getCompoundMeaning,
  getMoneyCategory,
  isKarmicDebt,
  isMasterNumber,
  isWealthCompound,
} from "./compound";
import type { CompoundMeaning, MoneyCategory } from "./compound";
import { getChineseYearSign, getChineseYearSignFromDate, zodiacCompatibility } from "../astrology/zodiac";
import type { ChineseYearSign } from "../astrology/zodiac";

// ─── Supported sport types ───────────────────────────────────────────
export const SPORT_TYPES = [
  "Soccer (Football)",
  "Basketball (NBA)",
  "American Football (NFL)",
  "Baseball (MLB)",
  "Ice Hockey (NHL)",
  "Tennis",
  "Cricket",
  "Rugby",
  "Formula 1",
  "Golf",
  "Boxing",
  "MMA / UFC",
  "Volleyball",
  "Handball",
  "Table Tennis",
  "Badminton",
  "Other",
] as const;
export type SportType = typeof SPORT_TYPES[number];

// ─── Sport categories: team vs individual ────────────────────────────
// Team sports: two teams compete (with optional players, jerseys, founding year)
// Individual sports: two competitors compete (no team, no jerseys — just names + birthdays)
export const INDIVIDUAL_SPORTS: SportType[] = [
  "Tennis",
  "Formula 1",
  "Golf",
  "Boxing",
  "MMA / UFC",
  "Table Tennis",
  "Badminton",
];

export function isIndividualSport(sport: SportType): boolean {
  return INDIVIDUAL_SPORTS.includes(sport);
}

export interface PlayerInput {
  name: string;
  birthDate?: BirthDate | string;  // accept ISO string from JSON, or structured
  jersey?: number;
}

export interface TeamInput {
  name: string;
  city?: string;
  foundingYear?: number;     // founding year → year number (sum of digits) + Chinese zodiac
  keyJerseyNumbers?: number[];
  players?: PlayerInput[];
}

interface NumberBreakdown {
  root: number;
  compound: number;
  isMaster: boolean;
  isKarmicDebt: boolean;
  karmicDebtAs?: string;
  isWealth: boolean;
  moneyCategory: MoneyCategory;
  meaning?: CompoundMeaning;
}

interface JerseyBreakdown extends NumberBreakdown {
  jersey: number;
}

export interface PlayerAnalysis {
  name: string;
  jersey?: number;
  lifePath?: NumberBreakdown & { steps: string };
  chineseYearSign?: ChineseYearSign;
  eventYearCompatibility?: { tier: string; score: number; label: string; description: string };
}

export interface TeamAnalysis {
  name: string;
  city?: string;
  foundingYear?: number;
  foundingYearNumber?: NumberBreakdown & { steps: string };  // computed from year digits
  chineseYearSign?: ChineseYearSign;
  eventYearCompatibility?: { tier: string; score: number; label: string; description: string };
  nameNumber: NumberBreakdown;
  cityNumber?: NumberBreakdown;
  jerseyNumbers?: JerseyBreakdown[];
  players?: PlayerAnalysis[];
  teamScore: number;
}

export interface SportsPrediction {
  sportType: SportType;
  eventDate: BirthDate;
  universalDay: NumberBreakdown;
  eventChineseYearSign: ChineseYearSign;
  team1: TeamAnalysis;
  team2: TeamAnalysis;
  predictedWinner: string;
  confidence: number;
  edge: number;
  reasoning: string[];
  prediction: string;
}

function numerologyResult(compound: number): NumberBreakdown {
  const root = reduceNumberStrict(compound);
  const karmic = isKarmicDebt(compound);
  return {
    root,
    compound,
    isMaster: isMasterNumber(root),
    isKarmicDebt: karmic,
    karmicDebtAs: karmic ? `${compound}/${root}` : undefined,
    isWealth: isWealthCompound(compound),
    moneyCategory: getMoneyCategory(compound, root),
    meaning: getCompoundMeaning(root),
  };
}

function universalDayCompound(d: BirthDate): number {
  return `${d.month}${d.day}${d.year}`.split("").map(Number).reduce((s, n) => s + n, 0);
}

function scoreTeam(team: TeamInput, eventDayRoot: number, eventYearAnimal: string): TeamAnalysis {
  const nameRaw = nameToNumber(team.name);
  const nameN = numerologyResult(nameRaw);

  let cityN: NumberBreakdown | undefined;
  if (team.city && team.city.trim()) {
    cityN = numerologyResult(nameToNumber(team.city));
  }

  let jerseys: JerseyBreakdown[] | undefined;
  if (team.keyJerseyNumbers && team.keyJerseyNumbers.length > 0) {
    jerseys = team.keyJerseyNumbers.map(j => {
      const r = numerologyResult(j);
      return { jersey: j, root: r.root, compound: r.compound, isMaster: r.isMaster, isKarmicDebt: r.isKarmicDebt, karmicDebtAs: r.karmicDebtAs, isWealth: r.isWealth, moneyCategory: r.moneyCategory, meaning: r.meaning };
    });
  }

  // Team zodiac (from founding year) + event-year compatibility
  let chineseYearSign: ChineseYearSign | undefined;
  let eventYearCompatibility: TeamAnalysis["eventYearCompatibility"];
  let foundingYearNumber: TeamAnalysis["foundingYearNumber"];

  if (team.foundingYear) {
    chineseYearSign = getChineseYearSign(team.foundingYear);
    const compat = zodiacCompatibility(chineseYearSign.animal, eventYearAnimal as any);
    eventYearCompatibility = { tier: compat.tier, score: compat.score, label: compat.label, description: compat.description };

    // Founding year number — sum the year's digits (straight-across, master preserved)
    // Example: 1947 → 1+9+4+7 = 21 → 3
    const yearDigits = String(team.foundingYear).split("").map(Number);
    const yearSum = yearDigits.reduce((s, n) => s + n, 0);
    const yn = numerologyResult(yearSum);
    const digitsStr = String(team.foundingYear).split("").join("+");
    const steps = `${digitsStr} = ${yearSum}${yn.root !== yearSum ? ` → ${yn.root}` : ""}${yn.isMaster ? " (MASTER)" : ""}`;
    foundingYearNumber = { ...yn, steps };
  }

  // Players
  let players: PlayerAnalysis[] | undefined;
  if (team.players && team.players.length > 0) {
    players = team.players.map(p => {
      const analysis: PlayerAnalysis = { name: p.name, jersey: p.jersey };
      // Normalize birthDate: accept BirthDate object or ISO string
      let bd: BirthDate | undefined;
      if (p.birthDate) {
        if (typeof p.birthDate === "string") {
          const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(p.birthDate);
          if (m) bd = { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
        } else {
          bd = p.birthDate;
        }
      }
      if (bd) {
        const lp = lifePathNumber(bd);
        const lpBreakdown = numerologyResult(lp.compound);
        analysis.lifePath = { ...lpBreakdown, steps: lp.steps };
        analysis.chineseYearSign = getChineseYearSignFromDate(bd.year, bd.month, bd.day);
        // Player's event-year zodiac compatibility
        const pCompat = zodiacCompatibility(analysis.chineseYearSign.animal, eventYearAnimal as any);
        analysis.eventYearCompatibility = { tier: pCompat.tier, score: pCompat.score, label: pCompat.label, description: pCompat.description };
      }
      return analysis;
    });
  }

  // Team score — base 50, adjusted by multiple factors
  let score = 50;
  if (nameN.isMaster) score += 15;
  if (nameN.isKarmicDebt) score -= 15;
  if (nameN.isWealth) score += 10;
  if (nameN.moneyCategory === "money") score += 5;
  // Founding year number adjustments
  if (foundingYearNumber) {
    if (foundingYearNumber.isMaster) score += 10;
    if (foundingYearNumber.isKarmicDebt) score -= 10;
    if (foundingYearNumber.isWealth) score += 8;
    if (foundingYearNumber.moneyCategory === "money") score += 4;
  }
  if (cityN) {
    if (cityN.isMaster) score += 5;
    if (cityN.isKarmicDebt) score -= 5;
  }
  if (jerseys && jerseys.length > 0) {
    const masterJ = jerseys.filter(j => j.isMaster).length;
    const karmicJ = jerseys.filter(j => j.isKarmicDebt).length;
    score += (masterJ - karmicJ) * 5;
  }
  if (players && players.length > 0) {
    const masterPlayers = players.filter(p => p.lifePath?.isMaster).length;
    const karmicPlayers = players.filter(p => p.lifePath?.isKarmicDebt).length;
    score += Math.min(9, masterPlayers * 3) - Math.min(9, karmicPlayers * 3);
  }
  // Event-year zodiac compatibility boost/penalty
  if (eventYearCompatibility) {
    if (eventYearCompatibility.tier === "trine") score += 8;
    else if (eventYearCompatibility.tier === "opposite") score += 3;
    else if (eventYearCompatibility.tier === "harm") score -= 5;
  }
  // Player event-year zodiac compatibility (average effect)
  if (players && players.length > 0) {
    const playerCompatScores = players
      .filter(p => p.eventYearCompatibility)
      .map(p => p.eventYearCompatibility!.score);
    if (playerCompatScores.length > 0) {
      const avg = playerCompatScores.reduce((s, n) => s + n, 0) / playerCompatScores.length;
      // avg 60 = neutral, 90 = +5, 40 = -5
      score += Math.round((avg - 60) / 6);
    }
  }
  if (nameN.root === eventDayRoot) score += 10;
  score = Math.max(0, Math.min(100, score));

  return {
    name: team.name,
    city: team.city,
    foundingYear: team.foundingYear,
    foundingYearNumber,
    chineseYearSign,
    eventYearCompatibility,
    nameNumber: nameN,
    cityNumber: cityN,
    jerseyNumbers: jerseys,
    players,
    teamScore: score,
  };
}

export function predictSportsEvent(
  eventDate: BirthDate,
  team1Input: TeamInput,
  team2Input: TeamInput,
  sportType: SportType = "Soccer (Football)",
): SportsPrediction {
  const udCompound = universalDayCompound(eventDate);
  const ud = numerologyResult(udCompound);
  const eventChineseYearSign = getChineseYearSignFromDate(eventDate.year, eventDate.month, eventDate.day);
  const eventYearAnimal = eventChineseYearSign.animal;

  const team1 = scoreTeam(team1Input, ud.root, eventYearAnimal);
  const team2 = scoreTeam(team2Input, ud.root, eventYearAnimal);

  const edge = team1.teamScore - team2.teamScore;
  let predictedWinner = team1.name;
  if (edge < 0) predictedWinner = team2.name;
  else if (edge === 0) predictedWinner = "Toss-up — too close to call";

  const confidence = Math.round(50 + (Math.abs(edge) / 100) * 45);

  const reasoning: string[] = [];
  reasoning.push(`Sport: ${sportType}`);
  reasoning.push(
    `Universal Day on the event date: compound ${ud.compound} → root ${ud.root}${ud.isMaster ? " (MASTER)" : ""}${ud.isKarmicDebt ? ` (KARMIC ${ud.karmicDebtAs})` : ""}${ud.isWealth ? " (WEALTH 28)" : ""}${ud.moneyCategory === "money" ? " (MONEY 8)" : ""}${ud.moneyCategory === "money-lesser" ? " (MONEY lesser)" : ""}. Teams whose name root harmonizes with this number get a +10 boost.`
  );
  reasoning.push(
    `Event year ${eventDate.year} → Chinese zodiac: ${eventChineseYearSign.animal} (${eventChineseYearSign.element} ${eventChineseYearSign.polarity}). Team and player zodiac signs are compared against this event-year animal for compatibility.`
  );
  reasoning.push(
    `${team1.name} → name ${team1.nameNumber.root}${team1.nameNumber.isMaster ? " (Master)" : ""}${team1.nameNumber.isKarmicDebt ? ` (KARMIC ${team1.nameNumber.karmicDebtAs})` : ""}${team1.nameNumber.isWealth ? " (Wealth 28)" : ""}${team1.nameNumber.moneyCategory === "money" ? " (Money 8)" : ""} (${team1.nameNumber.meaning?.title ?? "—"}). Team score: ${team1.teamScore}/100.`
  );
  reasoning.push(
    `${team2.name} → name ${team2.nameNumber.root}${team2.nameNumber.isMaster ? " (Master)" : ""}${team2.nameNumber.isKarmicDebt ? ` (KARMIC ${team2.nameNumber.karmicDebtAs})` : ""}${team2.nameNumber.isWealth ? " (Wealth 28)" : ""}${team2.nameNumber.moneyCategory === "money" ? " (Money 8)" : ""} (${team2.nameNumber.meaning?.title ?? "—"}). Team score: ${team2.teamScore}/100.`
  );

  // Team zodiac comparison (team vs team)
  if (team1.chineseYearSign && team2.chineseYearSign) {
    reasoning.push(`${team1.name} founded in ${team1.foundingYear} → ${team1.chineseYearSign.animal} (${team1.chineseYearSign.element} ${team1.chineseYearSign.polarity}). ${team2.name} founded in ${team2.foundingYear} → ${team2.chineseYearSign.animal} (${team2.chineseYearSign.element} ${team2.chineseYearSign.polarity}).`);
    const compat = zodiacCompatibility(team1.chineseYearSign.animal, team2.chineseYearSign.animal);
    reasoning.push(`Team-vs-team zodiac compatibility: ${compat.label} (score ${compat.score}/100) — ${compat.description}`);
  }

  // Team founding year number comparison
  if (team1.foundingYearNumber && team2.foundingYearNumber) {
    reasoning.push(`${team1.name} founding year number: ${team1.foundingYearNumber.root}${team1.foundingYearNumber.isMaster ? " (Master)" : ""}${team1.foundingYearNumber.isWealth ? " (Wealth 28)" : ""}${team1.foundingYearNumber.moneyCategory === "money" ? " (Money 8)" : ""} (${team1.foundingYearNumber.steps}). ${team2.name} founding year number: ${team2.foundingYearNumber.root}${team2.foundingYearNumber.isMaster ? " (Master)" : ""}${team2.foundingYearNumber.isWealth ? " (Wealth 28)" : ""}${team2.foundingYearNumber.moneyCategory === "money" ? " (Money 8)" : ""} (${team2.foundingYearNumber.steps}).`);
    if (team1.foundingYearNumber.isMaster && !team2.foundingYearNumber.isMaster) {
      reasoning.push(`FOUNDING YEAR EDGE: ${team1.name} carries a Master Number in its founding year.`);
    } else if (team2.foundingYearNumber.isMaster && !team1.foundingYearNumber.isMaster) {
      reasoning.push(`FOUNDING YEAR EDGE: ${team2.name} carries a Master Number in its founding year.`);
    }
    if (team1.foundingYearNumber.isWealth && !team2.foundingYearNumber.isWealth) {
      reasoning.push(`FOUNDING WEALTH EDGE: ${team1.name} founding year sums to compound 28 (wealth).`);
    } else if (team2.foundingYearNumber.isWealth && !team1.foundingYearNumber.isWealth) {
      reasoning.push(`FOUNDING WEALTH EDGE: ${team2.name} founding year sums to compound 28 (wealth).`);
    }
  }

  // Team vs event year zodiac
  if (team1.eventYearCompatibility) {
    reasoning.push(`${team1.name} vs event year (${eventYearAnimal}): ${team1.eventYearCompatibility.label} (score ${team1.eventYearCompatibility.score}/100).`);
  }
  if (team2.eventYearCompatibility) {
    reasoning.push(`${team2.name} vs event year (${eventYearAnimal}): ${team2.eventYearCompatibility.label} (score ${team2.eventYearCompatibility.score}/100).`);
  }

  // Master / karmic / wealth / money edges
  if (team1.nameNumber.isMaster && !team2.nameNumber.isMaster) {
    reasoning.push(`STRONG EDGE: ${team1.name} carries a Master Number in its name — higher mission, higher visibility.`);
  } else if (team2.nameNumber.isMaster && !team1.nameNumber.isMaster) {
    reasoning.push(`STRONG EDGE: ${team2.name} carries a Master Number in its name — higher mission, higher visibility.`);
  }
  if (team1.nameNumber.isKarmicDebt && !team2.nameNumber.isKarmicDebt) {
    reasoning.push(`PENALTY: ${team1.name} carries Karmic Debt in its name — recurring tests, potential self-sabotage.`);
  } else if (team2.nameNumber.isKarmicDebt && !team1.nameNumber.isKarmicDebt) {
    reasoning.push(`PENALTY: ${team2.name} carries Karmic Debt in its name — recurring tests, potential self-sabotage.`);
  }

  if (team1.nameNumber.root === ud.root) {
    reasoning.push(`${team1.name}'s name root (${team1.nameNumber.root}) matches the Universal Day (${ud.root}) — harmony boost.`);
  }
  if (team2.nameNumber.root === ud.root) {
    reasoning.push(`${team2.name}'s name root (${team2.nameNumber.root}) matches the Universal Day (${ud.root}) — harmony boost.`);
  }

  if (team1.nameNumber.isWealth && !team2.nameNumber.isWealth) {
    reasoning.push(`WEALTH EDGE: ${team1.name} carries wealth compound 28 — material/momentum advantage.`);
  } else if (team2.nameNumber.isWealth && !team1.nameNumber.isWealth) {
    reasoning.push(`WEALTH EDGE: ${team2.name} carries wealth compound 28 — material/momentum advantage.`);
  }
  if (team1.nameNumber.moneyCategory === "money" && team2.nameNumber.moneyCategory !== "money") {
    reasoning.push(`MONEY EDGE: ${team1.name} carries money number 8 (Saturn) — karmic weight in their favour.`);
  } else if (team2.nameNumber.moneyCategory === "money" && team1.nameNumber.moneyCategory !== "money") {
    reasoning.push(`MONEY EDGE: ${team2.name} carries money number 8 (Saturn) — karmic weight in their favour.`);
  }

  // Jersey highlights
  if (team1.jerseyNumbers && team1.jerseyNumbers.length > 0) {
    const master = team1.jerseyNumbers.filter(j => j.isMaster).map(j => j.jersey);
    const karmic = team1.jerseyNumbers.filter(j => j.isKarmicDebt).map(j => j.jersey);
    const wealth = team1.jerseyNumbers.filter(j => j.isWealth).map(j => j.jersey);
    if (master.length) reasoning.push(`${team1.name} key jerseys carrying Master Number energy: ${master.join(", ")}.`);
    if (karmic.length) reasoning.push(`${team1.name} key jerseys carrying Karmic Debt: ${karmic.join(", ")}.`);
    if (wealth.length) reasoning.push(`${team1.name} key jerseys carrying Wealth compound 28: ${wealth.join(", ")}.`);
  }
  if (team2.jerseyNumbers && team2.jerseyNumbers.length > 0) {
    const master = team2.jerseyNumbers.filter(j => j.isMaster).map(j => j.jersey);
    const karmic = team2.jerseyNumbers.filter(j => j.isKarmicDebt).map(j => j.jersey);
    const wealth = team2.jerseyNumbers.filter(j => j.isWealth).map(j => j.jersey);
    if (master.length) reasoning.push(`${team2.name} key jerseys carrying Master Number energy: ${master.join(", ")}.`);
    if (karmic.length) reasoning.push(`${team2.name} key jerseys carrying Karmic Debt: ${karmic.join(", ")}.`);
    if (wealth.length) reasoning.push(`${team2.name} key jerseys carrying Wealth compound 28: ${wealth.join(", ")}.`);
  }

  // Player highlights — master numbers + event-year zodiac
  for (const team of [team1, team2]) {
    if (team.players && team.players.length > 0) {
      const masterPlayers = team.players.filter(p => p.lifePath?.isMaster);
      if (masterPlayers.length > 0) {
        reasoning.push(`${team.name} players with Master Number Life Path: ${masterPlayers.map(p => `${p.name} (LP ${p.lifePath?.root})`).join(", ")}.`);
      }
      // Event-year zodiac per player
      const trinePlayers = team.players.filter(p => p.eventYearCompatibility?.tier === "trine");
      const harmPlayers = team.players.filter(p => p.eventYearCompatibility?.tier === "harm");
      if (trinePlayers.length > 0) {
        reasoning.push(`${team.name} players in trine (三合) with event year ${eventYearAnimal}: ${trinePlayers.map(p => `${p.name} (${p.chineseYearSign?.animal})`).join(", ")} — strong harmony boost.`);
      }
      if (harmPlayers.length > 0) {
        reasoning.push(`${team.name} players in harm (害) with event year ${eventYearAnimal}: ${harmPlayers.map(p => `${p.name} (${p.chineseYearSign?.animal})`).join(", ")} — friction penalty.`);
      }
    }
  }

  const prediction =
    edge === 0
      ? `Toss-up. Both teams carry nearly identical Silent Oracle frequencies on this date. Consider intangibles (form, injuries, home advantage, sport-specific factors).`
      : edge > 0
      ? `Silent Oracle edge: ${team1.name} (+${edge}). Predicted winner: ${team1.name} with ${confidence}% confidence.`
      : `Silent Oracle edge: ${team2.name} (+${Math.abs(edge)}). Predicted winner: ${team2.name} with ${confidence}% confidence.`;

  return {
    sportType,
    eventDate,
    universalDay: ud,
    eventChineseYearSign,
    team1,
    team2,
    predictedWinner,
    confidence,
    edge,
    reasoning,
    prediction,
  };
}

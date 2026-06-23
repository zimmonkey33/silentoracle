/**
 * GG33 Company / Business / Country Analyzer
 * ----------------------------------------------------------------------
 * Per spec: uses the REGISTERED LEGAL NAME + founding date as Life Path.
 * All name calcs use Pythagorean (GG33 default).
 *
 * Wealth-compound override: if the founding date's COMPOUND number is on
 * the GG33 wealth list (24, 28, 32, 41, 42, 46, 50, 51, 60, 64, 69, 80,
 * 81, 82, 86, 88, 96, 99), the  is boosted. This explains why
 * Apple Inc (name = 4, founding date compound = 28) succeeds despite
 * the neutral name root — 28 is a wealth compound.
 *
 * Same engine works for COUNTRIES — use the country's official name +
 * declaration of independence / founding date.
 */

import type { BirthDate } from "./gg33";
import { nameToNumber, personalYear, reduceNumberStrict } from "./gg33";
import {
  getCompoundMeaning,
  getMoneyCategory,
  isMasterNumber,
  isWealthCompound,
} from "./compound";
import type { CompoundMeaning, MoneyCategory } from "./compound";

export interface EntityNumber {
  root: number;
  compound: number;
  isMaster: boolean;
  isWealth: boolean;          // compound 28 (ONLY)
  moneyCategory: MoneyCategory;
  meaning?: CompoundMeaning;
}

export interface EntityChart {
  entityType: "company" | "country";
  nameNumber: EntityNumber;
  foundingLifePath: EntityNumber;
  industryNumber?: EntityNumber;
  currentPersonalYear: number;
  currentPersonalYearTheme: string;
  roadmap: { year: number; personalYear: number; theme: string }[];
  summary: string;
  observations: string[];
  wealthHighlight: string | null;
}

// Keep CompanyChart as alias for backward compatibility
export type CompanyChart = EntityChart;

export interface EntityInput {
  entityType?: "company" | "country";
  name: string;            // company OR country name
  foundingDate: BirthDate; // founding / independence date
  industry?: string;       // optional industry (companies) or region tag
  currentYear?: number;
}

// Keep CompanyInput as alias
export type CompanyInput = EntityInput;

function buildGg33Result(compound: number): EntityNumber {
  const root = reduceNumberStrict(compound);
  return {
    root,
    compound,
    isMaster: isMasterNumber(root),
    // Wealth = compound 28 ONLY. Money = root 8. Money-lesser = root 13 or 22.
    isWealth: isWealthCompound(compound),
    moneyCategory: getMoneyCategory(compound, root),
    meaning: getCompoundMeaning(root),
  };
}

/**
 * Entity Life Path — strict GG33 straight-across method.
 * Sum ALL digits of MMDDYYYY, then reduce.
 */
function entityLifePath(b: BirthDate): number {
  return `${b.month}${b.day}${b.year}`.split("").map(Number).reduce((s, n) => s + n, 0);
}

const PY_THEMES: Record<number, string> = {
  1: "Launch / New Cycle — fresh starts, founding energy",
  2: "Partnership / Slow Growth — refine, ally, listen",
  3: "Expansion / Brand — express, market, scale visibility",
  4: "Foundation / Systemize — build load-bearing walls",
  5: "Pivot / Reinvention — change product, market, or model",
  6: "Service / Responsibility — focus on customers & team",
  7: "Introspect / R&D — quiet year for research and depth",
  8: "Power / Money — harvest year, recognition and revenue",
  9: "Completion / Release — finish or sunset what is done",
  11: "Inspiration / Vision Year — channel a new direction",
  22: "Master Build Year — materialize a major vision",
  33: "Master Teach Year — lead by culture and embodiment",
};

export function buildCompanyChart(input: EntityInput): EntityChart {
  return buildEntityChart(input);
}

export function buildEntityChart(input: EntityInput): EntityChart {
  const entityType = input.entityType ?? "company";
  const { name, foundingDate, industry } = input;
  const currentYear = input.currentYear ?? new Date().getFullYear();

  const nameRaw = nameToNumber(name);
  const nameN = buildGg33Result(nameRaw);

  const lpRaw = entityLifePath(foundingDate);
  const lpN = buildGg33Result(lpRaw);

  let industryN: EntityNumber | undefined;
  if (industry && industry.trim()) {
    industryN = buildGg33Result(nameToNumber(industry));
  }

  const py = personalYear(foundingDate, new Date(currentYear, 5, 15)).number;
  const pyTheme = PY_THEMES[py] ?? `Personal Year ${py}`;

  // ── Personal Year roadmap (next 9 years, straight-across per year) ──
  const roadmap: { year: number; personalYear: number; theme: string }[] = [];
  for (let i = 0; i < 9; i++) {
    const yr = currentYear + i;
    const digitStr = `${foundingDate.month}${foundingDate.day}${yr}`;
    const raw = digitStr.split("").map(Number).reduce((s, n) => s + n, 0);
    const pyNum = reduceNumberStrict(raw);
    roadmap.push({ year: yr, personalYear: pyNum, theme: PY_THEMES[pyNum] ?? `Personal Year ${pyNum}` });
  }

  // ── Pure analysis (no verdicts) ────────────────────────────────────
  // Per spec:
  //   - WEALTH compound = 28 ONLY (the single wealth compound in GG33)
  //   - MONEY root = 8 (Saturn, primary money number)
  //   - MONEY (lesser-known) roots = 13 and 22
  //
  // Wealth compound 28 (anywhere in chart) → FAVORABLE boost.
  // Money root 8 on founding LP → FAVORABLE boost (the entity is
  //   "born to handle money").
  // Money-lesser (13 or 22) → mild positive lean.
  // Master Numbers (11/22/33) on name or LP → FAVORABLE.
  // Karmic Debt (13/14/16/19) on multiple positions → CHALLENGING.
  //
  // Note: 22 is BOTH a Master Number AND a lesser money number. 13 is
  // BOTH a Karmic Debt AND a lesser money number. Context determines
  // interpretation — for entity , the master-number status
  // takes precedence over the money-lesser tag.
  const scores = [nameN, lpN, ...(industryN ? [industryN] : [])];
  const masterCount = scores.filter(s => s.isMaster).length;
  const wealthCount = scores.filter(s => s.isWealth).length;             // compound 28
  const moneyCount = scores.filter(s => s.moneyCategory === "money").length;          // root 8
  const moneyLesserCount = scores.filter(s => s.moneyCategory === "money-lesser").length; // root 13 or 22

  // No verdict — pure analysis only

  // Wealth highlight (compound 28 ONLY)
  const wealthItems: { label: string; root: number; compound: number; title: string }[] = [];
  if (nameN.isWealth) wealthItems.push({ label: `${entityType === "country" ? "country" : "company"} name`, root: nameN.root, compound: nameN.compound, title: nameN.meaning?.title ?? "" });
  if (lpN.isWealth) wealthItems.push({ label: "founding life path", root: lpN.root, compound: lpN.compound, title: lpN.meaning?.title ?? "" });
  if (industryN?.isWealth) wealthItems.push({ label: "industry", root: industryN.root, compound: industryN.compound, title: industryN.meaning?.title ?? "" });
  const wealthHighlight = wealthItems.length > 0
    ? `WEALTH COMPOUND DETECTED: ${wealthItems.map(w => `${w.label} = ${w.root} (compound ${w.compound}, "${w.title}")`).join("; ")}. Compound 28 is the ONLY wealth compound in the GG33 system — it indicates material abundance through trust, negotiation, and partnership. This is why ${name} succeeds materially.`
    : null;

  // Money highlight (root 8 = money, roots 13 & 22 = lesser money)
  const moneyItems: { label: string; root: number; title: string; category: string }[] = [];
  const labelPairs: Array<[string, EntityNumber]> = [
    ["name", nameN],
    ["founding life path", lpN],
    ...(industryN ? [["industry", industryN] as [string, EntityNumber]] : []),
  ];
  for (const [label, n] of labelPairs) {
    if (n.moneyCategory === "money") moneyItems.push({ label, root: n.root, title: n.meaning?.title ?? "", category: "money" });
    else if (n.moneyCategory === "money-lesser") moneyItems.push({ label, root: n.root, title: n.meaning?.title ?? "", category: "money-lesser" });
  }
  const moneyHighlight = moneyItems.length > 0
    ? `MONEY NUMBER${moneyItems.length === 1 ? "" : "S"}: ${moneyItems.map(m => `${m.label} = ${m.root}${m.category === "money-lesser" ? " (lesser-known money)" : ""}`).join(", ")}. Root 8 is Saturn's money number (material mastery). Roots 13 and 22 are lesser-known money channels — 13 = money through disciplined hard work, 22 = money through master-builder execution.`
    : null;

  const entityLabel = entityType === "country" ? "country" : "company";

  const summary = `${name} — GG33 numerology analysis. Name root: ${nameN.root} (${nameN.meaning?.title}). Founding Life Path: ${lpN.root} (${lpN.meaning?.title}). Personal Year ${py} (${pyTheme}).${masterCount > 0 ? ` ${masterCount} Master Number${masterCount === 1 ? "" : "s"} present.` : ""}${wealthCount > 0 ? " Wealth compound 28 detected." : ""}${moneyCount > 0 ? ` Money number 8 present.` : ""}`;

  const observations: string[] = [];
  observations.push(
    nameN.isMaster
      ? `${entityLabel} name ${name} (${nameN.root} — Master Number, ${nameN.meaning?.title}). Higher visibility and higher volatility.`
      : nameN.isWealth
      ? `${entityLabel} name ${name} (${nameN.root}, compound ${nameN.compound} — WEALTH compound 28, ${nameN.meaning?.title}). Material abundance supported.`
      : nameN.moneyCategory === "money"
      ? `${entityLabel} name ${name} (${nameN.root} — MONEY number 8, ${nameN.meaning?.title}). Saturn's material-mastery vibration.`
      : nameN.moneyCategory === "money-lesser"
      ? `${entityLabel} name ${name} (${nameN.root} — lesser money number, ${nameN.meaning?.title}). ${nameN.root === 13 ? "Money through disciplined hard work." : "Money through master-builder execution (22)."}`
      : `${entityLabel} name ${name} (${nameN.root} — ${nameN.meaning?.title}). ${nameN.meaning?.detail}`
  );
  observations.push(
    lpN.isWealth
      ? `The founding date (${foundingDate.month}/${foundingDate.day}/${foundingDate.year}) sums to compound ${lpN.compound} → root ${lpN.root} (WEALTH compound 28, "${lpN.meaning?.title}"). This is the strongest financial indicator in GG33 — abundance through trust and negotiation.`
      : lpN.moneyCategory === "money"
      ? `The founding date (${foundingDate.month}/${foundingDate.day}/${foundingDate.year}) sums to root ${lpN.root} (MONEY number 8, "${lpN.meaning?.title}"). The entity is born to handle money .`
      : lpN.moneyCategory === "money-lesser"
      ? `The founding date (${foundingDate.month}/${foundingDate.day}/${foundingDate.year}) sums to root ${lpN.root} (lesser money number, "${lpN.meaning?.title}"). ${lpN.root === 13 ? "Money through hard work ()." : "Money through master-builder execution (22)."}`
      : `The founding date (${foundingDate.month}/${foundingDate.day}/${foundingDate.year}) sums to compound ${lpN.compound} → root ${lpN.root} (${lpN.meaning?.title}). ${lpN.meaning?.detail}`
  );
  observations.push(
    `Current Personal Year ${py} for the ${entityLabel}: ${pyTheme}. Align launches, expansions, and structural changes with this energy.`
  );
  if (industryN) {
    observations.push(
      industryN.isWealth
        ? `Industry/region "${industry}" (${industryN.root}, compound ${industryN.compound} — WEALTH compound 28) — strongest financial alignment.`
        : industryN.moneyCategory === "money"
        ? `Industry/region "${industry}" (${industryN.root} — MONEY number 8) — strong financial alignment.`
        : industryN.moneyCategory === "money-lesser"
        ? `Industry/region "${industry}" (${industryN.root} — lesser money number) — moderate financial alignment.`
        : industryN.isMaster
        ? `Industry/region "${industry}" (${industryN.root} — Master Number) — master-vibration.`
        : `Industry/region "${industry}" (${industryN.root} — ${industryN.meaning?.title}).`
    );
  }
  if (masterCount > 0) {
    observations.push(`Master Number${masterCount === 1 ? "" : "s"} detected — this raises the stakes. Master-number entities either define their field or collapse under the weight of their vision.`);
  }
  if (wealthCount > 0) {
    observations.push(`WEALTH COMPOUND 28 detected — the ${entityLabel} carries GG33's ONLY wealth compound. Material abundance through trust, negotiation, and partnership is materially supported.`);
  }
  if (moneyCount > 0) {
    observations.push(`MONEY NUMBER 8 (root) detected — the ${entityLabel} carries Saturn's money vibration. Financial power is supported.`);
  }
  if (moneyLesserCount > 0) {
    observations.push(`LESSER MONEY NUMBER${moneyLesserCount === 1 ? "" : "S"} (13/22) detected — money flows through specific channels (hard work for 13, large-scale execution for 22).`);
  }

  return {
    entityType,
    nameNumber: nameN,
    foundingLifePath: lpN,
    industryNumber: industryN,
    currentPersonalYear: py,
    currentPersonalYearTheme: pyTheme,
    roadmap,
    summary,
    observations,
    wealthHighlight,
  };
}

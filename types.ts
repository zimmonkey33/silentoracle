/**
 * Type definitions for the unified multi-entity analyzer.
 */
import type { NumerologyChart } from "@/lib/numerology/numerology-engine";
import type { NumberMeaning } from "@/lib/numerology/interpretations";
import type { PredictionReport } from "@/lib/prediction/synthesis";
import type { EntityChart, CompanyChart } from "@/lib/numerology/company";
import type { SportsPrediction } from "@/lib/numerology/sports";
import type { CompoundMeaning } from "@/lib/numerology/compound";
import type { ChineseYearSign } from "@/lib/astrology/zodiac";

export type EntityType = "person" | "company" | "country" | "sports";

export interface AnalyzeResponse {
  ok: boolean;
  entityType: EntityType;

  // Person
  numerologyChart?: NumerologyChart;
  report?: PredictionReport;
  companions?: {
    lifePathMeaning: NumberMeaning | undefined;
    numerologyMeanings: Record<number, NumberMeaning>;
  };

  // Chinese year sign (person, company, country)
  chineseYearSign?: ChineseYearSign;

  // Partner (person compatibility)
  partnerChart?: NumerologyChart;
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
  entityChart?: EntityChart;
  companyChart?: CompanyChart; // backward-compat alias

  // Sports
  sportsPrediction?: SportsPrediction;

  inputs: Record<string, unknown>;
}

export type { NumerologyChart, NumberMeaning, PredictionReport, EntityChart, CompanyChart, SportsPrediction, CompoundMeaning, ChineseYearSign };

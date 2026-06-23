"use client";

import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, User2, Sparkles } from "lucide-react";
import type { AnalyzeResponse } from "@/lib/types";

export function CompatibilitySection({ data }: { data: AnalyzeResponse }) {
  if (!data.compatibility) return null;
  const c = data.compatibility;
  const myChart = data.gg33Chart;
  const partnerChart = data.partnerChart;
  if (!myChart || !partnerChart) return null;

  const lpColor: Record<string, string> = {
    aligned: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    complementary: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
    challenging: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
    neutral: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  };
  const lpLabel: Record<string, string> = {
    aligned: "Natural Allies",
    complementary: "Complementary",
    challenging: "Challenging",
    neutral: "Neutral",
  };

  const zodiacColor: Record<string, string> = {
    trine: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    opposite: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    harm: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
    neutral: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  };

  const pyColor: Record<string, string> = {
    powerful: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    aligned: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
    friction: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
    neutral: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  };
  const pyLabel: Record<string, string> = {
    powerful: "Same Personal Year — powerful joint energy",
    aligned: "Close Personal Years — supportive timing",
    friction: "Opposing Personal Years — timing friction",
    neutral: "Personal Years are offset — neutral timing",
  };

  return (
    <Card className="border-2 border-rose-300/60 dark:border-rose-700/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="size-5 text-rose-500" /> Compatibility Analysis
        </CardTitle>
        <CardDescription>
          {(data.inputs as { fullName?: string }).fullName} × {c.partnerName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Side-by-side comparison */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Person 1 */}
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">You</p>
            <p className="mt-1 text-sm font-bold">{(data.inputs as { fullName?: string }).fullName}</p>
            <div className="mt-2 space-y-1 text-xs">
              <p>Life Path: <strong>{c.lp1}</strong> ({c.lp1Title})</p>
              <p>Expression: <strong>{myChart.expression.root}</strong> ({myChart.expression.meaning?.title})</p>
              <p>Soul Urge: <strong>{myChart.soulUrge.root}</strong></p>
              <p>Personality: <strong>{myChart.personality.root}</strong></p>
              <p>Personal Year: <strong>{c.py1}</strong></p>
              {data.chineseYearSign && (
                <p>Zodiac: <strong>{data.chineseYearSign.animal} {data.chineseYearSign.emoji}</strong> ({data.chineseYearSign.element})</p>
              )}
            </div>
          </div>
          {/* Person 2 */}
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Partner</p>
            <p className="mt-1 text-sm font-bold">{c.partnerName}</p>
            <div className="mt-2 space-y-1 text-xs">
              <p>Life Path: <strong>{c.lp2}</strong> ({c.lp2Title})</p>
              <p>Expression: <strong>{partnerChart.expression.root}</strong> ({partnerChart.expression.meaning?.title})</p>
              <p>Soul Urge: <strong>{partnerChart.soulUrge.root}</strong></p>
              <p>Personality: <strong>{partnerChart.personality.root}</strong></p>
              <p>Personal Year: <strong>{c.py2}</strong></p>
              {data.partnerChineseYearSign && (
                <p>Zodiac: <strong>{data.partnerChineseYearSign.animal} {data.partnerChineseYearSign.emoji}</strong> ({data.partnerChineseYearSign.element})</p>
              )}
            </div>
          </div>
        </div>

        {/* Life Path compatibility */}
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" /> Life Path Compatibility
            </p>
            <Badge className={lpColor[c.lpTier]}>{lpLabel[c.lpTier]}</Badge>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-2xl font-bold tabular-nums">{c.lp1}</span>
            <Heart className="size-4 text-rose-400" />
            <span className="text-2xl font-bold tabular-nums">{c.lp2}</span>
            <span className="ml-auto text-sm tabular-nums text-muted-foreground">{c.lpScore}/100</span>
          </div>
          <Progress value={c.lpScore} className="mt-1" />
          <p className="mt-2 text-xs text-muted-foreground">
            {c.lpTier === "aligned" && "Natural allies — shared direction and complementary strengths. Productive partnership with minimal friction."}
            {c.lpTier === "complementary" && "Same Life Path — deep mutual understanding but potential blind spots. Best when roles differ."}
            {c.lpTier === "challenging" && "Structural tension in approach and priorities. Workable with awareness and clear communication."}
            {c.lpTier === "neutral" && "No special alignment or friction. Relationship quality depends on individual execution."}
          </p>
        </div>

        {/* Chinese zodiac compatibility */}
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="size-4 text-rose-500" /> Chinese Zodiac Compatibility
            </p>
            <Badge className={zodiacColor[c.zodiacTier] || zodiacColor.neutral}>{c.zodiacLabel}</Badge>
          </div>
          <div className="mt-2 flex items-center gap-3">
            {data.chineseYearSign && (
              <span className="text-3xl">{data.chineseYearSign.emoji}</span>
            )}
            <Heart className="size-4 text-rose-400" />
            {data.partnerChineseYearSign && (
              <span className="text-3xl">{data.partnerChineseYearSign.emoji}</span>
            )}
            <span className="ml-auto text-sm tabular-nums text-muted-foreground">{c.zodiacScore}/100</span>
          </div>
          <Progress value={c.zodiacScore} className="mt-1" />
          <p className="mt-2 text-xs text-muted-foreground">{c.zodiacDescription}</p>
        </div>

        {/* Personal Year alignment */}
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="size-4 text-purple-500" /> Personal Year Alignment
            </p>
            <Badge className={pyColor[c.pyAlignment]}>{c.pyAlignment}</Badge>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-lg">PY {c.py1}</span>
            <Heart className="size-4 text-rose-400" />
            <span className="text-lg">PY {c.py2}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{pyLabel[c.pyAlignment]}</p>
        </div>

        {/* Expression + Soul Urge comparison */}
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-semibold mb-2">Core Number Comparison</p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded bg-muted/30 p-2">
              <p className="text-muted-foreground">Number</p>
              <p className="font-bold">You / Partner</p>
            </div>
            <div className="rounded bg-muted/30 p-2">
              <p className="text-muted-foreground">Expression</p>
              <p className="font-bold">{myChart.expression.root} / {partnerChart.expression.root}</p>
            </div>
            <div className="rounded bg-muted/30 p-2">
              <p className="text-muted-foreground">Soul Urge</p>
              <p className="font-bold">{myChart.soulUrge.root} / {partnerChart.soulUrge.root}</p>
            </div>
            <div className="rounded bg-muted/30 p-2">
              <p className="text-muted-foreground">Personality</p>
              <p className="font-bold">{myChart.personality.root} / {partnerChart.personality.root}</p>
            </div>
            <div className="rounded bg-muted/30 p-2">
              <p className="text-muted-foreground">Birthday</p>
              <p className="font-bold">{myChart.birthDay.root} / {partnerChart.birthDay.root}</p>
            </div>
            <div className="rounded bg-muted/30 p-2">
              <p className="text-muted-foreground">Attitude</p>
              <p className="font-bold">{myChart.attitude.root} / {partnerChart.attitude.root}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

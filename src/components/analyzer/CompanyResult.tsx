"use client";

import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Calendar, Sparkles, Star, Gem, Coins } from "lucide-react";
import type { AnalyzeResponse } from "@/lib/types";

interface NumberValue {
  root: number;
  compound: number;
  isMaster: boolean;
  isWealth: boolean;
  moneyCategory: "wealth" | "money" | "money-lesser" | null;
  meaning?: { title: string; vibration: string; detail: string; keyword: string };
}

function NumberCard({ title, value, hint }: { title: string; value: NumberValue; hint: string }) {
  return (
    <Card className={`${value.isMaster ? "border-amber-300/60 dark:border-amber-700/40" : value.isWealth ? "border-yellow-300/60 dark:border-yellow-700/40" : value.moneyCategory === "money" ? "border-emerald-300/60 dark:border-emerald-700/40" : value.moneyCategory === "money-lesser" ? "border-teal-300/60 dark:border-teal-700/40" : ""}`}>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="flex items-baseline gap-2 flex-wrap">
          <span className="text-4xl font-extrabold tabular-nums text-amber-600 dark:text-amber-400">{value.root}</span>
          {value.isMaster && (
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
              <Star className="mr-1 size-3" /> Master
            </Badge>
          )}
          {value.isWealth && (
            <Badge className="bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200 border-yellow-300">
              <Gem className="mr-1 size-3" /> Wealth (28)
            </Badge>
          )}
          {value.moneyCategory === "money" && (
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
              <Coins className="mr-1 size-3" /> Money (8)
            </Badge>
          )}
          {value.moneyCategory === "money-lesser" && (
            <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200">
              <Coins className="mr-1 size-3" /> Money (lesser)
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">Compound: <strong>{value.compound}</strong> · {hint}</p>
        {value.meaning && (
          <>
            <p className="mt-2 text-sm font-medium">{value.meaning.title}</p>
            <p className="text-xs text-muted-foreground">{value.meaning.vibration}</p>
            <p className="mt-2 text-xs leading-relaxed">{value.meaning.detail}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function CompanyResult({ data }: { data: AnalyzeResponse }) {
  const c = data.entityChart ?? data.companyChart;
  if (!c) return null;
  const inputs = data.inputs as { name?: string; foundingDate: string; industry?: string };
  const name = inputs.name ?? (data.inputs as { companyName?: string }).companyName ?? "Entity";
  const isCountry = data.entityType === "country";

  const TitleIcon = isCountry ? Globe : Building2;
  const entityLabel = isCountry ? "Country" : "Company";

  return (
    <div className="grid gap-5">
      {/* Headline */}
      <Card className="border-2 border-amber-200/60 dark:border-amber-900/40 bg-gradient-to-br from-amber-50/40 via-card to-emerald-50/30 dark:from-amber-950/10 dark:to-emerald-950/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 text-white shadow-lg">
              <TitleIcon className="size-7" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-300 font-semibold">
                Numerology Analysis
              </p>
              <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">{name}</h2>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" /> {isCountry ? "Founding/Independence" : "Founding"} date: <strong>{inputs.foundingDate}</strong>
                </span>
                {inputs.industry && <span className="text-xs text-muted-foreground">· {isCountry ? "Region" : "Industry"}: {inputs.industry}</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-2 border-amber-200/60 dark:border-amber-900/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="size-5 text-amber-600" /> Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[15px] leading-relaxed">{c.summary}</p>

          {c.wealthHighlight && (
            <div className="mt-3 rounded-md border border-yellow-300/60 dark:border-yellow-700/40 bg-yellow-50/60 dark:bg-yellow-950/20 p-3 text-sm text-yellow-900 dark:text-yellow-200">
              <Gem className="mr-1 inline size-4" />
              <span className="font-semibold">{c.wealthHighlight}</span>
            </div>
          )}

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Observations</p>
            <ul className="mt-2 space-y-2">
              {c.observations.map((r: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Number cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <NumberCard title={`${entityLabel} Name (Pythagorean)`} value={c.nameNumber} hint="Sum of registered name" />
        <NumberCard title="Founding Life Path (straight-across)" value={c.foundingLifePath} hint="Sum of all date digits" />
        {c.industryNumber && (
          <NumberCard title={isCountry ? "Region (Pythagorean)" : "Industry (Pythagorean)"} value={c.industryNumber} hint="Optional label sum" />
        )}
      </div>

      {/* Founding date breakdown */}
      <Card className="border-2 border-amber-200/40 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-950/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="size-4 text-amber-600" /> {isCountry ? "Founding / Independence Date" : "Founding Date"} Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md bg-card p-3">
              <p className="text-xs uppercase text-muted-foreground">Date</p>
              <p className="mt-1 text-lg font-bold">{inputs.foundingDate}</p>
            </div>
            <div className="rounded-md bg-card p-3">
              <p className="text-xs uppercase text-muted-foreground">Digit Sum (Compound)</p>
              <p className="mt-1 text-lg font-bold tabular-nums">
                {c.foundingLifePath.compound}
                {c.foundingLifePath.isWealth && <Badge className="ml-2 bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200"><Gem className="mr-1 size-3" />Wealth (28)</Badge>}
              </p>
            </div>
            <div className="rounded-md bg-card p-3">
              <p className="text-xs uppercase text-muted-foreground">Reduced Root</p>
              <p className="mt-1 text-lg font-bold tabular-nums">
                {c.foundingLifePath.root}
                {c.foundingLifePath.isMaster && <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"><Star className="mr-1 size-3" />Master</Badge>}
                {c.foundingLifePath.moneyCategory === "money" && <Badge className="ml-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"><Coins className="mr-1 size-3" />Money (8)</Badge>}
                {c.foundingLifePath.moneyCategory === "money-lesser" && <Badge className="ml-2 bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200"><Coins className="mr-1 size-3" />Money (lesser)</Badge>}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Year */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="size-4 text-amber-600" /> {entityLabel}'s Personal Year (Current)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold tabular-nums text-amber-600 dark:text-amber-400">{c.currentPersonalYear}</span>
            <div>
              <p className="font-medium">{c.currentPersonalYearTheme}</p>
              <p className="text-xs text-muted-foreground">The {entityLabel.toLowerCase()} is in Personal Year {c.currentPersonalYear} this year.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap */}
      {c.roadmap && c.roadmap.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="size-4 text-purple-600" /> {entityLabel} Personal Year Roadmap (9 Years)
            </CardTitle>
            <CardDescription>
              Each year computed via straight-across method (sum founding month + day + year digits). Master Numbers 11/22/33 preserved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-9">
              {c.roadmap.map((r: { year: number; personalYear: number; theme: string }, i: number) => {
                const isMaster = r.personalYear === 11 || r.personalYear === 22 || r.personalYear === 33;
                const colorIdx = ((r.personalYear - 1) % 9) + 1;
                const colorClass = isMaster
                  ? "from-amber-400 via-yellow-500 to-amber-600"
                  : colorIdx === 1 ? "from-emerald-500 to-emerald-600" :
                  colorIdx === 2 ? "from-sky-500 to-sky-600" :
                  colorIdx === 3 ? "from-amber-500 to-amber-600" :
                  colorIdx === 4 ? "from-stone-500 to-stone-600" :
                  colorIdx === 5 ? "from-rose-500 to-rose-600" :
                  colorIdx === 6 ? "from-pink-500 to-pink-600" :
                  colorIdx === 7 ? "from-violet-500 to-violet-600" :
                  colorIdx === 8 ? "from-indigo-500 to-indigo-600" :
                  "from-orange-500 to-orange-600";
                return (
                  <div key={i} className={`rounded-lg border bg-card p-3 ${isMaster ? "border-amber-400 dark:border-amber-600 ring-2 ring-amber-300/40" : ""}`}>
                    <p className="text-xs text-muted-foreground">{r.year}</p>
                    <div className={`mt-1 grid size-9 place-items-center rounded-md bg-gradient-to-br ${colorClass} text-sm font-bold text-white ${isMaster ? "shadow-md shadow-amber-500/30" : ""}`}>
                      {r.personalYear}
                    </div>
                    {isMaster && (
                      <Badge className="mt-1 w-full justify-center text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                        Master
                      </Badge>
                    )}
                    <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{r.theme}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

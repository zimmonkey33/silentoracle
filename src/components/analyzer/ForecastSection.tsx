"use client";

import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, TrendingUp } from "lucide-react";
import type { AnalyzeResponse } from "@/lib/types";

export function ForecastSection({ data }: { data: AnalyzeResponse }) {
  if (!data.report) return null;
  const f = data.report.forecast;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarDays className="size-5 text-amber-600" /> Current Personal Year Forecast
        </CardTitle>
        <CardDescription>Birthday-aware: your PY changes on your actual birthday, not January 1st.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-extrabold tabular-nums text-amber-600 dark:text-amber-400">{f.personalYear.number}</span>
          <div>
            <p className="font-medium">{f.personalYear.theme}</p>
            <p className="text-xs text-muted-foreground">
              Effective year {f.personalYear.effectiveYear} · {f.personalYear.birthdayPassed ? "Birthday has passed — in new PY" : "Before birthday — still in prior PY"}
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed">{f.personalYear.guidance}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Focus this year</p>
            <ul className="mt-1 list-disc pl-5 text-xs">
              {f.personalYear.focus.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Caution</p>
            <p className="mt-1 text-xs">{f.personalYear.caution}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Combined Guidance</p>
          <p className="mt-1 text-sm leading-relaxed">{f.combinedGuidance}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function RoadmapSection({ data }: { data: AnalyzeResponse }) {
  if (!data.report) return null;
  const rm = data.report.roadmap;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="size-5 text-purple-600" /> 9-Year Personal Year Roadmap
        </CardTitle>
        <CardDescription>
          Each year&apos;s Personal Year is computed using the strict straight-across formula (sum all digits of MMDDYYYY for that year). Master Numbers 11/22/33 are preserved — they can appear in any year, breaking the standard 1–9 cycle.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-9">
          {rm.map((r, i) => {
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
                <p className="text-xs text-muted-foreground">Age {r.age}</p>
                <div className={`mt-1 grid size-9 place-items-center rounded-md bg-gradient-to-br ${colorClass} text-sm font-bold text-white ${isMaster ? "shadow-md shadow-amber-500/30" : ""}`}>
                  {r.personalYear}
                </div>
                {isMaster && (
                  <Badge className="mt-1 w-full justify-center text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                    ⭐ Master
                  </Badge>
                )}
                {r.pinnacle !== undefined && !isMaster && (
                  <Badge variant="outline" className="mt-2 w-full justify-center text-[10px]">P{r.pinnacle}</Badge>
                )}
                <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{r.theme}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

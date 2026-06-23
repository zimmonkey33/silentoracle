"use client";

import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import type { AnalyzeResponse } from "@/lib/types";

export function OverviewSection({ data }: { data: AnalyzeResponse }) {
  if (!data.report) return null;
  const r = data.report;

  return (
    <div className="grid gap-5">
      {/* Headline */}
      <Card className="overflow-hidden border-2 border-amber-200/60 dark:border-amber-900/40 bg-gradient-to-br from-amber-50 via-card to-rose-50 dark:from-amber-950/20 dark:to-rose-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 text-white shadow-lg">
              <Sparkles className="size-7" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-300 font-semibold">
                GG33 Numerology Analysis
              </p>
              <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
                {r.headline}
              </h2>
              <p className="mt-2 text-muted-foreground italic">{r.oneLineArchetype}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GG33 Classification */}
      <Card className="border-2 border-amber-300/60 dark:border-amber-700/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="size-5 text-amber-600" />
            GG33 Compound Classification
          </CardTitle>
          <CardDescription>
            Each core number is checked for Master Number (11/22/33) and wealth/money status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {([
              { key: "lifePath", label: "Life Path" },
              { key: "birthDay", label: "Birthday" },
              { key: "expression", label: "Expression" },
              { key: "soulUrge", label: "Soul Urge" },
              { key: "personality", label: "Personality" },
            ] as const).map(({ key, label }) => {
              const item = r.gg33Classification[key];
              return (
                <div key={key} className={`rounded-lg border p-3 ${
                  item.isMaster ? "border-amber-400/60 bg-amber-50/40 dark:bg-amber-950/20" : "bg-card"
                }`}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="text-2xl font-extrabold tabular-nums">
                    {item.root}
                    {item.isMaster && <span className="ml-1 text-xs text-amber-600">M</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.title}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {item.isMaster && (
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">Master</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">{item.vibration}</p>
                </div>
              );
            })}
          </div>
          <p className="text-sm leading-relaxed">{r.gg33Classification.overallSummary}</p>
          {r.gg33Classification.wealthHighlight && (
            <div className="rounded-md border border-yellow-300/60 dark:border-yellow-700/40 bg-yellow-50/60 dark:bg-yellow-950/20 p-3 text-sm text-yellow-900 dark:text-yellow-200">
              <span className="font-semibold">{r.gg33Classification.wealthHighlight}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Final synthesis */}
      <Card className="border-2 border-amber-200/60 dark:border-amber-900/40">
        <CardHeader>
          <CardTitle className="text-lg">Final Synthesis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[15px] leading-relaxed">{r.finalSynthesis}</p>
        </CardContent>
      </Card>
    </div>
  );
}

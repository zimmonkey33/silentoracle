"use client";

import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import type { ChineseYearSign as ChineseYearSignType } from "@/lib/types";

interface Props {
  sign: ChineseYearSignType;
  contextLabel?: string; // e.g. "Your birth year" or "Founding year"
}

export function ChineseYearSignCard({ sign, contextLabel }: Props) {
  return (
    <Card className="border-2 border-rose-300/40 dark:border-rose-700/30 bg-gradient-to-br from-rose-50/30 via-card to-amber-50/20 dark:from-rose-950/10 dark:to-amber-950/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="size-5 text-rose-600" /> Chinese Zodiac Year Sign
        </CardTitle>
        <CardDescription>
          {contextLabel ? `${contextLabel} — ` : ""}Complementary system to GG33 numerology.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-4xl shadow-md">
            {sign.emoji}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-bold">{sign.animal}</h3>
              <span className="text-sm text-muted-foreground">{sign.chinese}</span>
            </div>
            <p className="text-sm font-medium">{sign.title} · {sign.element} {sign.polarity}</p>
            <p className="text-xs text-muted-foreground italic">{sign.archetype}</p>
            <div className="flex flex-wrap gap-1">
              {sign.traits.map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{sign.summary}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Best Matches</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {sign.bestMatches.map(m => <Badge key={m} className="bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200">{m}</Badge>)}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Challenging Matches</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {sign.challengingMatches.map(m => <Badge key={m} variant="outline">{m}</Badge>)}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Element:</strong> {sign.element} ·
          <strong className="ml-2 text-foreground">Polarity:</strong> {sign.polarity} ·
          <span className="ml-2">Year-sign only (no Bazi four pillars — kept lightweight for clarity)</span>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Hash, Star, Crown, GitBranch, Layers, Calendar, AlertTriangle, Gem, Coins } from "lucide-react";
import type { AnalyzeResponse } from "@/lib/types";

interface CellProps {
  label: string;
  root: number;
  compound?: number;
  isMaster?: boolean;
  isKarmicDebt?: boolean;
  karmicDebtAs?: string;
  isWealth?: boolean;
  moneyCategory?: "wealth" | "money" | "money-lesser" | null;
  hint?: string;
  title?: string;
  calculation?: string;
}

function NumberCell({ label, root, compound, isMaster, isKarmicDebt, karmicDebtAs, isWealth, moneyCategory, hint, title, calculation }: CellProps) {
  return (
    <div className={`rounded-lg border bg-card p-4 ${
      isMaster ? "border-amber-300/60 dark:border-amber-700/40" :
      isWealth ? "border-yellow-300/60 dark:border-yellow-700/40" :
      moneyCategory === "money" ? "border-emerald-300/60 dark:border-emerald-700/40" :
      moneyCategory === "money-lesser" ? "border-teal-300/60 dark:border-teal-700/40" :
      isKarmicDebt ? "border-rose-300/60 dark:border-rose-700/40" : ""
    }`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="flex flex-wrap gap-1">
          {isMaster && (
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
              <Star className="mr-1 size-3" /> Master
            </Badge>
          )}
          {isWealth && (
            <Badge className="bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200 border-yellow-300">
              <Gem className="mr-1 size-3" /> Wealth (28)
            </Badge>
          )}
          {moneyCategory === "money" && (
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
              <Coins className="mr-1 size-3" /> Money (8)
            </Badge>
          )}
          {moneyCategory === "money-lesser" && (
            <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200">
              <Coins className="mr-1 size-3" /> Money (lesser)
            </Badge>
          )}
          {isKarmicDebt && (
            <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200">
              <AlertTriangle className="mr-1 size-3" /> Karmic {karmicDebtAs}
            </Badge>
          )}
        </div>
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">{root}</span>
        {compound !== undefined && compound !== root && (
          <span className="text-xs text-muted-foreground">from {compound}</span>
        )}
      </div>
      {title && <p className="mt-0.5 text-xs text-muted-foreground">{title}</p>}
      {calculation && (
        <p className="mt-1 rounded bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] leading-tight text-muted-foreground break-all">
          {calculation}
        </p>
      )}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function NumerologySection({ data }: { data: AnalyzeResponse }) {
  if (!data.gg33Chart || !data.companions) return null;
  const c = data.gg33Chart;
  const meanings = data.companions.numerologyMeanings;
  const lpMeaning = data.companions.lifePathMeaning;

  return (
    <div className="grid gap-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Hash className="size-5 text-amber-600" /> Core Numerology Numbers
          </CardTitle>
          <CardDescription>
            Strict GG33: Pythagorean chart (1-9) for all name calcs. Life Path = straight-across sum of all date digits. Master Numbers 11/22/33 preserved. Karmic Debt 13/14/16/19 flagged before reducing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <NumberCell label="Life Path" root={c.lifePath.root} compound={c.lifePath.compound} isMaster={c.lifePath.isMaster} isKarmicDebt={c.lifePath.isKarmicDebt} karmicDebtAs={c.lifePath.karmicDebtAs} isWealth={c.lifePath.isWealth} moneyCategory={c.lifePath.moneyCategory} calculation={c.lifePath.calculation} title={lpMeaning?.title} hint={lpMeaning?.archetype} />
            <NumberCell label="Birthday (Partial Energy)" root={c.birthDay.root} compound={c.birthDay.compound} isMaster={c.birthDay.isMaster} isKarmicDebt={c.birthDay.isKarmicDebt} karmicDebtAs={c.birthDay.karmicDebtAs} isWealth={c.birthDay.isWealth} moneyCategory={c.birthDay.moneyCategory} calculation={c.birthDay.calculation} title={c.birthDay.meaning?.title} />
            <NumberCell label="Attitude" root={c.attitude.root} compound={c.attitude.compound} isMaster={c.attitude.isMaster} isKarmicDebt={c.attitude.isKarmicDebt} karmicDebtAs={c.attitude.karmicDebtAs} isWealth={c.attitude.isWealth} moneyCategory={c.attitude.moneyCategory} calculation={c.attitude.calculation} title={c.attitude.meaning?.title} />
            <NumberCell label="Expression (Destiny)" root={c.expression.root} compound={c.expression.compound} isMaster={c.expression.isMaster} isKarmicDebt={c.expression.isKarmicDebt} karmicDebtAs={c.expression.karmicDebtAs} isWealth={c.expression.isWealth} moneyCategory={c.expression.moneyCategory} calculation={c.expression.calculation} title={c.expression.meaning?.title} />
            <NumberCell label="Soul Urge" root={c.soulUrge.root} compound={c.soulUrge.compound} isMaster={c.soulUrge.isMaster} isKarmicDebt={c.soulUrge.isKarmicDebt} karmicDebtAs={c.soulUrge.karmicDebtAs} isWealth={c.soulUrge.isWealth} moneyCategory={c.soulUrge.moneyCategory} calculation={c.soulUrge.calculation} title={c.soulUrge.meaning?.title} />
            <NumberCell label="Personality" root={c.personality.root} compound={c.personality.compound} isMaster={c.personality.isMaster} isKarmicDebt={c.personality.isKarmicDebt} karmicDebtAs={c.personality.karmicDebtAs} isWealth={c.personality.isWealth} moneyCategory={c.personality.moneyCategory} calculation={c.personality.calculation} title={c.personality.meaning?.title} />
            <NumberCell label="Maturity" root={c.maturity.root} compound={c.maturity.compound} isMaster={c.maturity.isMaster} isKarmicDebt={c.maturity.isKarmicDebt} karmicDebtAs={c.maturity.karmicDebtAs} isWealth={c.maturity.isWealth} moneyCategory={c.maturity.moneyCategory} calculation={c.maturity.calculation} title={c.maturity.meaning?.title} />
            <NumberCell label="Personal Year" root={c.personalYear.number} calculation={`Effective year ${c.personalYear.effectiveYear} · ${c.personalYear.birthdayPassed ? "after birthday" : "before birthday"}`} hint={`PM: ${c.personalMonth} · PD: ${c.personalDay}`} />
            <NumberCell label="Personal Month" root={c.personalMonth} />
          </div>

          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">{c.lifePath.steps}</p>

          {c.missingNumbers.length > 0 && (
            <div className="mt-3 rounded-md border border-amber-300/60 dark:border-amber-700/40 bg-amber-50/40 dark:bg-amber-950/10 p-3">
              <p className="text-xs font-semibold uppercase text-amber-700 dark:text-amber-300">Missing Numbers (missing numbers in birth name)</p>
              <p className="mt-1 text-xs">
                {c.missingNumbers.map(n => (
                  <Badge key={n} className="mr-1 mb-1 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">{n}</Badge>
                ))}
                — develop these qualities in this lifetime.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pinnacles & Challenges */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Crown className="size-4 text-amber-600" /> Pinnacles
            </CardTitle>
            <CardDescription>
              Four long-term peaks. Pinnacle 1 ends at age 36 − (base Life Path digit). For Master LPs: 11→2, 22→4, 33→6.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {c.pinnacles.map((p) => (
              <div key={p.index} className="flex items-center gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-md bg-amber-100 text-sm font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                  {p.index}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-medium">Pinnacle {p.number}{meanings[p.number] ? ` — ${meanings[p.number].title}` : ""}</p>
                    <p className="text-xs text-muted-foreground">ages {p.ageStart}–{p.ageEnd === 99 ? "∞" : p.ageEnd}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GitBranch className="size-4 text-rose-600" /> Challenges
            </CardTitle>
            <CardDescription>Challenge 0 = "zero challenge" — must master ALL numbers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {c.challenges.map((ch) => (
              <div key={ch.index} className="flex items-center gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-md bg-rose-100 text-sm font-bold text-rose-800 dark:bg-rose-900/40 dark:text-rose-200">
                  {ch.index}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Challenge {ch.number}
                    {ch.number === 0 && " (zero challenge — master all numbers)"}
                    {meanings[ch.number] ? ` — ${meanings[ch.number].title}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Period Cycles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Layers className="size-4 text-purple-600" /> Period Cycles
          </CardTitle>
          <CardDescription>Three long-term environmental influences spanning the whole life.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {c.periodCycles.map((pc) => (
              <div key={pc.index} className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Cycle {pc.index} · ages {pc.ageStart}–{pc.ageEnd === 99 ? "∞" : pc.ageEnd}</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-purple-600 dark:text-purple-400">{pc.number}</p>
                <p className="text-xs">{meanings[pc.number]?.title ?? ""}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personal Year focus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="size-4 text-emerald-600" /> Current Personal Year
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400">{c.personalYear.number}</span>
            <div>
              <p className="text-xs text-muted-foreground">
                Effective year {c.personalYear.effectiveYear} · {c.personalYear.birthdayPassed ? "Birthday has passed — in new PY" : "Before birthday — still in prior PY"}
              </p>
              <p className="text-xs text-muted-foreground">Personal Month: {c.personalMonth} · Personal Day: {c.personalDay}</p>
            </div>
          </div>
          {data.report && (
            <>
              <p className="mt-3 text-sm font-medium">{data.report.forecast.personalYear.theme}</p>
              <p className="mt-1 text-sm leading-relaxed">{data.report.forecast.personalYear.guidance}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

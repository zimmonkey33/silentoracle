"use client";

import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Sparkles, Moon, Briefcase, Heart, HeartPulse, Gem } from "lucide-react";
import type { AnalyzeResponse } from "@/lib/types";

export function PersonalitySection({ data }: { data: AnalyzeResponse }) {
  if (!data.report) return null;
  const p = data.report.personality;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="size-5 text-amber-600" /> Personality Synthesis
        </CardTitle>
        <CardDescription>
          Strengths, growth edges, and shadow pattern from the numerology chart.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="size-4" /> Strengths
            </p>
            <ul className="space-y-2">
              {p.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-300">
              <AlertTriangle className="size-4" /> Growth Edges
            </p>
            <ul className="space-y-2">
              {p.challenges.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-rose-500" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/10 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-200">
              <Sparkles className="size-4" /> Hidden Potential
            </p>
            <p className="mt-2 text-sm leading-relaxed">{p.hiddenPotential}</p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Moon className="size-4" /> Shadow Pattern
            </p>
            <p className="mt-2 text-sm leading-relaxed">{p.shadow}</p>
          </div>
        </div>

        {p.missingNumbers.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Missing Numbers (missing numbers in birth name)</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {p.missingNumbers.map((n) => <Badge key={n} className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">{n}</Badge>)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CareerSection({ data }: { data: AnalyzeResponse }) {
  if (!data.report) return null;
  const c = data.report.career;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Briefcase className="size-4 text-amber-600" /> Career Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Aligned Paths</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {c.recommended.map((r) => <Badge key={r} className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">{r}</Badge>)}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Avoid</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {c.avoid.map((r) => <Badge key={r} variant="outline">{r}</Badge>)}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Ideal Environment</p>
            <p className="mt-1 text-sm leading-relaxed">{c.idealEnvironment}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gem className="size-4 text-emerald-600" /> Wealth Style
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{c.wealthStyle}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function RelationshipSection({ data }: { data: AnalyzeResponse }) {
  if (!data.report) return null;
  const r = data.report.relationships;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="size-5 text-rose-600" /> Relationships & Compatibility
        </CardTitle>
        <CardDescription>
          Per spec: natural allies (1-5, 2-6, 3-9, 4-8, 5-1, 6-2, 7-7, 8-4, 9-3) and challenging pairs (1-4, 5-4, 8-3).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">Your Relationship Style</p>
          <p className="mt-1 text-sm leading-relaxed">{r.style}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Natural Allies</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {r.bestMatches.map((m) => <Badge key={m} className="bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200">{m}</Badge>)}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Challenging Combinations</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {r.challengingMatches.map((m) => <Badge key={m} variant="outline">{m}</Badge>)}
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">Guidance</p>
          <p className="mt-1 text-sm leading-relaxed">{r.advice}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function HealthSection({ data }: { data: AnalyzeResponse }) {
  if (!data.report) return null;
  const h = data.report.health;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <HeartPulse className="size-5 text-emerald-600" /> Health & Lifestyle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">Ruling Planet Region</p>
          <p className="mt-1 text-sm leading-relaxed">{h.system}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">Recommended Practices</p>
          <ul className="mt-1 space-y-1.5">
            {h.practices.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export function LuckySection({ data }: { data: AnalyzeResponse }) {
  if (!data.report) return null;
  const l = data.report.lucky;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gem className="size-5 text-amber-600" /> Lucky Resonances
        </CardTitle>
        <CardDescription>Numbers, colors, and days aligned with your Life Path.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Numbers</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {l.numbers.map((n) => (
                <span key={n} className="grid size-8 place-items-center rounded-md bg-amber-100 text-sm font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">{n}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Colors</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {l.colors.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Days</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {l.days.map((d) => <Badge key={d} variant="outline">{d}</Badge>)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Calendar, Shirt, MapPin, Sparkles, Star, AlertTriangle, Gem, Coins, User2 } from "lucide-react";
import type { AnalyzeResponse } from "@/lib/types";
import { ChineseYearSignCard } from "@/components/analyzer/ChineseYearSignCard";

interface PlayerAnalysis {
  name: string;
  jersey?: number;
  lifePath?: NumberBreakdown & { steps: string };
  chineseYearSign?: {
    animal: string;
    emoji: string;
    chinese: string;
    element: string;
    polarity: string;
    title: string;
    archetype: string;
  };
  eventYearCompatibility?: { tier: string; score: number; label: string; description: string };
}

interface NumberBreakdown {
  root: number;
  compound: number;
  isMaster: boolean;
  isKarmicDebt: boolean;
  karmicDebtAs?: string;
  isWealth: boolean;
  moneyCategory: "wealth" | "money" | "money-lesser" | null;
  meaning?: { title: string; vibration: string; detail: string; keyword: string };
}

function NumberBadges({ n }: { n: NumberBreakdown }) {
  return (
    <>
      {n.isMaster && (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
          <Star className="mr-1 size-3" /> Master
        </Badge>
      )}
      {n.isWealth && (
        <Badge className="bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200 border-yellow-300">
          <Gem className="mr-1 size-3" /> Wealth (28)
        </Badge>
      )}
      {n.moneyCategory === "money" && (
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
          <Coins className="mr-1 size-3" /> Money (8)
        </Badge>
      )}
      {n.moneyCategory === "money-lesser" && (
        <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200">
          <Coins className="mr-1 size-3" /> Money (lesser)
        </Badge>
      )}
      {n.isKarmicDebt && (
        <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200">
          <AlertTriangle className="mr-1 size-3" /> Karmic {n.karmicDebtAs}
        </Badge>
      )}
    </>
  );
}

function NumberBreakdownCard({ label, n, hint }: { label: string; n: NumberBreakdown; hint: string }) {
  return (
    <div className={`rounded-md border bg-card p-3 ${
      n.isMaster ? "border-amber-300/60 dark:border-amber-700/40" :
      n.isWealth ? "border-yellow-300/60 dark:border-yellow-700/40" :
      n.moneyCategory === "money" ? "border-emerald-300/60 dark:border-emerald-700/40" :
      n.moneyCategory === "money-lesser" ? "border-teal-300/60 dark:border-teal-700/40" :
      n.isKarmicDebt ? "border-rose-300/60 dark:border-rose-700/40" : ""
    }`}>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold tabular-nums text-amber-600 dark:text-amber-400">{n.root}</span>
        <span className="text-xs text-muted-foreground">compound {n.compound}</span>
      </div>
      <div className="mt-1 flex flex-wrap gap-1">
        <NumberBadges n={n} />
      </div>
      {n.meaning && (
        <>
          <p className="mt-1 text-xs font-medium">{n.meaning.title}</p>
          <p className="text-[10px] text-muted-foreground">{n.meaning.vibration}</p>
        </>
      )}
      <p className="mt-1 text-[10px] text-muted-foreground">{hint}</p>
    </div>
  );
}

interface JerseyBreakdown extends NumberBreakdown {
  jersey: number;
}

function TeamCard({ team, isWinner, eventYearAnimal }: {
  team: {
    name: string;
    city?: string;
    foundingYear?: number;
    foundingYearNumber?: NumberBreakdown & { steps: string };
    chineseYearSign?: PlayerAnalysis["chineseYearSign"];
    eventYearCompatibility?: { tier: string; score: number; label: string; description: string };
    nameNumber: NumberBreakdown;
    cityNumber?: NumberBreakdown;
    jerseyNumbers?: JerseyBreakdown[];
    players?: PlayerAnalysis[];
    teamScore: number;
  };
  isWinner: boolean;
  eventYearAnimal?: string;
}) {
  return (
    <Card className={`${isWinner ? "border-2 border-emerald-400 dark:border-emerald-600 shadow-md" : "border-2"}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardDescription>{isWinner ? "PREDICTED WINNER" : "Opponent"}</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              {isWinner && <Trophy className="size-5 text-amber-500" />}
              {team.name}
            </CardTitle>
            {team.city && <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="size-3" /> {team.city}</p>}
            {team.foundingYear && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3" /> Founded {team.foundingYear}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold tabular-nums">{team.teamScore}<span className="text-xs text-muted-foreground">/100</span></p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Team Chinese zodiac + founding year number */}
        {(team.chineseYearSign || team.foundingYearNumber) && (
          <div className="rounded-md border border-rose-300/40 dark:border-rose-700/30 bg-rose-50/30 dark:bg-rose-950/10 p-3 space-y-2">
            {team.chineseYearSign && (
              <>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Team Chinese Zodiac (founding year {team.foundingYear})</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{team.chineseYearSign.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{team.chineseYearSign.animal} <span className="text-xs font-normal text-muted-foreground">({team.chineseYearSign.chinese})</span></p>
                    <p className="text-xs text-muted-foreground">{team.chineseYearSign.element} {team.chineseYearSign.polarity} · {team.chineseYearSign.title}</p>
                    <p className="text-[10px] text-muted-foreground italic">{team.chineseYearSign.archetype}</p>
                  </div>
                </div>
                {team.eventYearCompatibility && eventYearAnimal && (
                  <div className="rounded bg-background/60 p-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">vs Event Year ({eventYearAnimal})</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <Badge className={`text-[10px] ${
                        team.eventYearCompatibility.tier === "trine" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200" :
                        team.eventYearCompatibility.tier === "opposite" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200" :
                        team.eventYearCompatibility.tier === "harm" ? "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200" :
                        "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                      }`}>{team.eventYearCompatibility.label}</Badge>
                      <span className="text-[10px] tabular-nums text-muted-foreground">{team.eventYearCompatibility.score}/100</span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{team.eventYearCompatibility.description}</p>
                  </div>
                )}
              </>
            )}
            {team.foundingYearNumber && (
              <div className={`rounded bg-background/60 p-2 ${team.foundingYearNumber.isMaster ? "border border-amber-300/40" : team.foundingYearNumber.isWealth ? "border border-yellow-300/40" : ""}`}>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Team Founding Year Number ({team.foundingYear})
                </p>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="text-xl font-extrabold tabular-nums text-amber-600 dark:text-amber-400">{team.foundingYearNumber.root}</span>
                  <span className="text-[10px] text-muted-foreground">compound {team.foundingYearNumber.compound}</span>
                  <NumberBadges n={team.foundingYearNumber} />
                </div>
                <p className="mt-0.5 rounded bg-muted/30 px-1.5 py-0.5 font-mono text-[9px] leading-tight text-muted-foreground break-all">
                  {team.foundingYearNumber.steps}
                </p>
                {team.foundingYearNumber.meaning && (
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{team.foundingYearNumber.meaning.title} — {team.foundingYearNumber.meaning.vibration}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Full name number breakdown */}
        <NumberBreakdownCard label="Team Name Number (Pythagorean)" n={team.nameNumber} hint="Sum of registered name" />

        {/* City number */}
        {team.cityNumber && (
          <NumberBreakdownCard label="City Number (Pythagorean)" n={team.cityNumber} hint="Sum of city name" />
        )}

        {/* Jersey numbers */}
        {team.jerseyNumbers && team.jerseyNumbers.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
              <Shirt className="size-3" /> Key Jersey Numbers
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {team.jerseyNumbers.map((j) => (
                <div key={j.jersey} className={`rounded-md border p-2 ${
                  j.isMaster ? "border-amber-300/60 bg-amber-50/40 dark:bg-amber-950/20" :
                  j.isWealth ? "border-yellow-300/60 bg-yellow-50/40 dark:bg-yellow-950/20" :
                  j.moneyCategory === "money" ? "border-emerald-300/60 bg-emerald-50/40 dark:bg-emerald-950/20" :
                  j.isKarmicDebt ? "border-rose-300/60 bg-rose-50/40 dark:bg-rose-950/20" : ""
                }`}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-bold tabular-nums">#{j.jersey}</span>
                    <span className="text-sm font-bold tabular-nums text-amber-600 dark:text-amber-400">→ {j.root}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <NumberBadges n={j} />
                  </div>
                  {j.meaning && (
                    <p className="mt-1 text-[10px] text-muted-foreground">{j.meaning.title}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Players */}
        {team.players && team.players.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
              <User2 className="size-3" /> Key Players
            </p>
            <div className="mt-2 space-y-2">
              {team.players.map((p, i) => (
                <div key={i} className="rounded-md border bg-background p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{p.name}</span>
                      {p.jersey !== undefined && (
                        <Badge variant="outline" className="text-[10px]">#{p.jersey}</Badge>
                      )}
                    </div>
                    {p.chineseYearSign && (
                      <span className="text-base" title={p.chineseYearSign.animal}>{p.chineseYearSign.emoji}</span>
                    )}
                  </div>
                  {p.lifePath && (
                    <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">
                        Life Path {p.lifePath.root}
                        {p.lifePath.isMaster && <span className="ml-1">⭐</span>}
                        {p.lifePath.isWealth && <span className="ml-1">💎</span>}
                        {p.lifePath.moneyCategory === "money" && <span className="ml-1">🪙</span>}
                        {p.lifePath.isKarmicDebt && <span className="ml-1">⚠{p.lifePath.karmicDebtAs}</span>}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">compound {p.lifePath.compound}</span>
                      {p.chineseYearSign && (
                        <span className="text-[10px] text-muted-foreground">
                          · {p.chineseYearSign.animal} ({p.chineseYearSign.element} {p.chineseYearSign.polarity})
                        </span>
                      )}
                    </div>
                  )}
                  {p.eventYearCompatibility && eventYearAnimal && (
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground">vs event year {eventYearAnimal}:</span>
                      <Badge className={`text-[9px] ${
                        p.eventYearCompatibility.tier === "trine" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200" :
                        p.eventYearCompatibility.tier === "opposite" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200" :
                        p.eventYearCompatibility.tier === "harm" ? "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200" :
                        "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                      }`}>{p.eventYearCompatibility.label} ({p.eventYearCompatibility.score})</Badge>
                    </div>
                  )}
                  {!p.lifePath && p.chineseYearSign && (
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {p.chineseYearSign.animal} · {p.chineseYearSign.element} {p.chineseYearSign.polarity} · {p.chineseYearSign.title}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SportsResult({ data }: { data: AnalyzeResponse }) {
  if (!data.sportsPrediction) return null;
  const p = data.sportsPrediction;
  const inputs = data.inputs as { eventDate: string; team1Name: string; team2Name: string };

  const team1Wins = p.edge > 0;
  const team2Wins = p.edge < 0;
  const tossUp = p.edge === 0;

  return (
    <div className="grid gap-5">
      {/* Prediction headline */}
      <Card className={`border-2 ${tossUp ? "border-amber-300/60 dark:border-amber-700/40" : "border-emerald-300/60 dark:border-emerald-700/40"} bg-gradient-to-br from-rose-50/40 via-card to-amber-50/30 dark:from-rose-950/10 dark:to-amber-950/10`}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-lg">
              <Trophy className="size-7" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-rose-700 dark:text-rose-300 font-semibold">
                GG33 Sports Prediction · {p.sportType} · Event date {inputs.eventDate}
              </p>
              <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
                Predicted Winner: <span className="text-amber-600">{p.predictedWinner}</span>
              </h2>
              <div className="mt-2 flex items-center gap-3 flex-wrap">
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">{p.confidence}% confidence</Badge>
                <span className="text-xs text-muted-foreground">
                  Edge: {team1Wins ? `+${p.edge}` : team2Wins ? `${p.edge}` : "0 (toss-up)"}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{p.prediction}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Universal Day breakdown */}
      <Card className="border-2 border-amber-200/40 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-950/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="size-5 text-amber-600" /> Universal Day Analysis
          </CardTitle>
          <CardDescription>
            Sum of ALL digits of the event date (MMDDYYYY), reduced with master preservation. The dominant energy of the day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-md bg-card p-3">
              <p className="text-xs uppercase text-muted-foreground">Event Date</p>
              <p className="mt-1 text-lg font-bold">{inputs.eventDate}</p>
            </div>
            <div className="rounded-md bg-card p-3">
              <p className="text-xs uppercase text-muted-foreground">Compound (digit sum)</p>
              <p className="mt-1 text-lg font-bold tabular-nums">
                {p.universalDay.compound}
                {p.universalDay.isWealth && <Badge className="ml-2 bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200">Wealth (28)</Badge>}
              </p>
            </div>
            <div className="rounded-md bg-card p-3">
              <p className="text-xs uppercase text-muted-foreground">Reduced Root</p>
              <p className="mt-1 text-lg font-bold tabular-nums">
                {p.universalDay.root}
                {p.universalDay.isMaster && <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">Master</Badge>}
                {p.universalDay.moneyCategory === "money" && <Badge className="ml-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">Money (8)</Badge>}
                {p.universalDay.moneyCategory === "money-lesser" && <Badge className="ml-2 bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200">Money (lesser)</Badge>}
              </p>
            </div>
            <div className="rounded-md bg-card p-3">
              <p className="text-xs uppercase text-muted-foreground">Meaning</p>
              <p className="mt-1 text-sm font-medium">{p.universalDay.meaning?.title ?? "—"}</p>
              <p className="text-[10px] text-muted-foreground">{p.universalDay.meaning?.vibration ?? ""}</p>
            </div>
          </div>
          {p.universalDay.isKarmicDebt && (
            <div className="mt-3 rounded-md border border-rose-300/60 dark:border-rose-700/40 bg-rose-50/60 dark:bg-rose-950/20 p-3 text-sm text-rose-900 dark:text-rose-200">
              <AlertTriangle className="mr-1 inline size-4" />
              Universal Day carries <strong>Karmic Debt {p.universalDay.karmicDebtAs}</strong> — the day itself carries karmic testing energy.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team comparison */}
      <div>
        <h3 className="mb-3 text-lg font-semibold flex items-center gap-2">
          <Sparkles className="size-5 text-amber-600" /> Team Numerology Comparison
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <TeamCard team={p.team1} isWinner={team1Wins && !tossUp} eventYearAnimal={p.eventChineseYearSign?.animal} />
          <TeamCard team={p.team2} isWinner={team2Wins && !tossUp} eventYearAnimal={p.eventChineseYearSign?.animal} />
        </div>
      </div>

      {/* Score bars */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Score Comparison</CardTitle>
          <CardDescription>Combined GG33 score per team (0–100).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{p.team1.name}</span>
              <span className="tabular-nums">{p.team1.teamScore}</span>
            </div>
            <Progress value={p.team1.teamScore} className="mt-1 [&>div]:bg-amber-500" />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{p.team2.name}</span>
              <span className="tabular-nums">{p.team2.teamScore}</span>
            </div>
            <Progress value={p.team2.teamScore} className="mt-1 [&>div]:bg-rose-500" />
          </div>
        </CardContent>
      </Card>

      {/* Chinese zodiac year sign for event year */}
      {data.chineseYearSign && (
        <ChineseYearSignCard
          sign={data.chineseYearSign}
          contextLabel="Event year (Chinese zodiac)"
        />
      )}

      {/* Reasoning chain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="size-5 text-amber-600" /> GG33 Reasoning Chain
          </CardTitle>
          <CardDescription>How the prediction was reached, step by step.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5">
            {p.reasoning.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

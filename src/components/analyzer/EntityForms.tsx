"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Sparkles, User2, Calendar, Building2, Trophy, MapPin, Shirt, Globe, Heart } from "lucide-react";

const ANIMALS: string[] = []; // no Chinese zodiac in pure GG33

// ─── Shared button ──────────────────────────────────────────────────────
function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      <Button
        type="submit"
        disabled={loading}
        size="lg"
        className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white shadow-md"
      >
        {loading ? (
          <><Loader2 className="size-4 animate-spin" /> Calculating…</>
        ) : (
          <><Sparkles className="size-4" /> {label}</>
        )}
      </Button>
      <p className="text-xs text-muted-foreground">All calculations run server-side. Nothing is stored.</p>
    </div>
  );
}

// ─── Person form ────────────────────────────────────────────────────────
export interface PersonFormValues {
  fullName: string;
  birthDate: string;
  birthTime: string;
  gender: string;
  partnerAnimal: string;
  partnerName: string;
  partnerBirthDate: string;
}

function setNativeValue(id: string, v: string) {
  const el = document.getElementById(id) as HTMLInputElement | null;
  if (!el) return;
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
  setter?.call(el, v);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

export function PersonForm({ onAnalyze, loading }: { onAnalyze: (v: PersonFormValues) => Promise<void>; loading: boolean }) {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("none");
  const [partnerName, setPartnerName] = useState("");
  const [partnerBirthDate, setPartnerBirthDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!fullName.trim()) { setError("Please enter your full birth name."); return; }
    if (!birthDate) { setError("Please enter your birth date."); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) { setError("Birth date must be yyyy-mm-dd."); return; }
    const [y, m, d] = birthDate.split("-").map(Number);
    if (y < 1900 || y > 2200 || m < 1 || m > 12 || d < 1 || d > 31) { setError("Birth date is out of range (1900–2200)."); return; }
    // Validate partner date if provided
    if (partnerBirthDate && !/^\d{4}-\d{2}-\d{2}$/.test(partnerBirthDate)) { setError("Partner birth date must be yyyy-mm-dd."); return; }
    if (partnerBirthDate) {
      const [py, pm, pd] = partnerBirthDate.split("-").map(Number);
      if (py < 1900 || py > 2200 || pm < 1 || pm > 12 || pd < 1 || pd > 31) { setError("Partner birth date is out of range."); return; }
    }
    await onAnalyze({
      fullName: fullName.trim(),
      birthDate,
      birthTime: "",
      gender: gender === "none" ? "" : gender,
      partnerAnimal: "",
      partnerName: partnerName.trim(),
      partnerBirthDate: partnerBirthDate || "",
    });
  }

  return (
    <Card className="w-full border-2 border-amber-200/50 dark:border-amber-900/30 bg-gradient-to-br from-amber-50/40 via-card to-rose-50/30 dark:from-amber-950/10 dark:to-rose-950/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <User2 className="size-5 text-amber-600" /> Person Analysis
        </CardTitle>
        <CardDescription>
          Enter full birth name + birth date. GG33 uses Pythagorean name + date math. Add a partner for compatibility analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User2 className="size-4 text-muted-foreground" /> Full Birth Name
            </Label>
            <Input id="fullName" placeholder="e.g. John Adam Smith" value={fullName}
              onChange={(e) => setFullName(e.target.value)} className="h-11" autoComplete="off" />
            <p className="text-xs text-muted-foreground">Use the name on your birth certificate.</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="birthDate" className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" /> Birth Date
            </Label>
            <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
              min="1900-01-01" max="2200-12-31" className="h-11" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label className="text-sm">Gender (optional)</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Not specified" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not specified</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Compatibility section */}
          <div className="rounded-lg border border-rose-200/50 dark:border-rose-900/30 bg-rose-50/20 dark:bg-rose-950/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="size-4 text-rose-500" />
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">Compatibility Analysis (optional)</p>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Enter a partner&apos;s name + birth date to compare Life Path, Chinese zodiac, and Personal Year alignment.</p>
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="partnerName" className="text-xs flex items-center gap-1.5">
                  <User2 className="size-3" /> Partner&apos;s Full Birth Name
                </Label>
                <Input id="partnerName" placeholder="e.g. Jane Marie Doe" value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)} className="h-10" autoComplete="off" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="partnerBirthDate" className="text-xs flex items-center gap-1.5">
                  <Calendar className="size-3" /> Partner&apos;s Birth Date
                </Label>
                <Input id="partnerBirthDate" type="date" value={partnerBirthDate} onChange={(e) => setPartnerBirthDate(e.target.value)}
                  min="1900-01-01" max="2200-12-31" className="h-10" />
              </div>
            </div>
          </div>

          {error && <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}
          <SubmitButton loading={loading} label="Generate Person Prediction" />
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Company form ───────────────────────────────────────────────────────
export interface CompanyFormValues {
  companyName: string;
  foundingDate: string;
  industry: string;
}

export function CompanyForm({ onAnalyze, loading }: { onAnalyze: (v: CompanyFormValues) => Promise<void>; loading: boolean }) {
  const [companyName, setCompanyName] = useState("");
  const [foundingDate, setFoundingDate] = useState("");
  const [industry, setIndustry] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!companyName.trim()) { setError("Please enter the company name."); return; }
    if (!foundingDate) { setError("Please enter the founding date."); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(foundingDate)) { setError("Founding date must be yyyy-mm-dd."); return; }
    const [y, m, d] = foundingDate.split("-").map(Number);
    if (y < 1900 || y > 2200 || m < 1 || m > 12 || d < 1 || d > 31) { setError("Founding date is out of range (1900–2200)."); return; }
    await onAnalyze({ companyName: companyName.trim(), foundingDate, industry: industry.trim() });
  }

  return (
    <Card className="w-full border-2 border-emerald-200/50 dark:border-emerald-900/30 bg-gradient-to-br from-emerald-50/40 via-card to-amber-50/30 dark:from-emerald-950/10 dark:to-amber-950/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Building2 className="size-5 text-emerald-600" /> Company Analysis
        </CardTitle>
        <CardDescription>
          Registered legal company name + founding date → GG33 numerology + Chinese zodiac analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="companyName" className="flex items-center gap-2">
              <Building2 className="size-4 text-muted-foreground" /> Company Name (registered legal name)
            </Label>
            <Input id="companyName" placeholder="e.g. Apple Inc" value={companyName}
              onChange={(e) => setCompanyName(e.target.value)} className="h-11" autoComplete="off" />
            <p className="text-xs text-muted-foreground">Use the registered legal name. GG33 reduces via Pythagorean. &quot;Apple Inc&quot; ≠ &quot;Apple&quot; ≠ &quot;APPLE&quot;.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="foundingDate" className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" /> Founding Date
              </Label>
              <Input id="foundingDate" type="date" value={foundingDate} onChange={(e) => setFoundingDate(e.target.value)}
                min="1900-01-01" max="2200-12-31" className="h-11" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="industry" className="flex items-center gap-2">
                <Sparkles className="size-4 text-muted-foreground" /> Industry (optional)
              </Label>
              <Input id="industry" placeholder="e.g. Technology, Finance, Hospitality" value={industry}
                onChange={(e) => setIndustry(e.target.value)} className="h-11" autoComplete="off" />
            </div>
          </div>
          {error && <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}
          <SubmitButton loading={loading} label="Analyze Company" />
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Sports event form ──────────────────────────────────────────────────
export interface PlayerFormValues {
  name: string;
  birthDate: string;
  jersey: string;
}

export interface SportsFormValues {
  sportType: string;
  eventDate: string;
  team1Name: string;
  team1City: string;
  team1FoundingYear: string;
  team1Jerseys: string;
  team1Players: PlayerFormValues[];
  team2Name: string;
  team2City: string;
  team2FoundingYear: string;
  team2Jerseys: string;
  team2Players: PlayerFormValues[];
}

const SPORT_TYPES = [
  "Soccer (Football)",
  "Basketball (NBA)",
  "American Football (NFL)",
  "Baseball (MLB)",
  "Ice Hockey (NHL)",
  "Tennis",
  "Cricket",
  "Rugby",
  "Formula 1",
  "Golf",
  "Boxing",
  "MMA / UFC",
  "Volleyball",
  "Handball",
  "Table Tennis",
  "Badminton",
  "Other",
];

const INDIVIDUAL_SPORTS = [
  "Tennis", "Formula 1", "Golf", "Boxing", "MMA / UFC", "Table Tennis", "Badminton",
];

function TeamFields({ prefix, name, setName, city, setCity, foundingYear, setFoundingYear, jerseys, setJerseys, players, setPlayers }: {
  prefix: string;
  name: string; setName: (v: string) => void;
  city: string; setCity: (v: string) => void;
  foundingYear: string; setFoundingYear: (v: string) => void;
  jerseys: string; setJerseys: (v: string) => void;
  players: PlayerFormValues[]; setPlayers: (v: PlayerFormValues[]) => void;
}) {
  const addPlayer = () => setPlayers([...players, { name: "", birthDate: "", jersey: "" }]);
  const removePlayer = (i: number) => setPlayers(players.filter((_, idx) => idx !== i));
  const updatePlayer = (i: number, field: keyof PlayerFormValues, v: string) =>
    setPlayers(players.map((p, idx) => idx === i ? { ...p, [field]: v } : p));

  return (
    <div className="grid gap-3 rounded-lg border bg-card p-4">
      <p className="text-sm font-semibold">{prefix}</p>
      <div className="grid gap-2">
        <Label className="text-xs flex items-center gap-1.5"><Trophy className="size-3" /> Team Name (registered)</Label>
        <Input placeholder="e.g. Manchester United" value={name} onChange={(e) => setName(e.target.value)} className="h-10" />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label className="text-xs flex items-center gap-1.5"><MapPin className="size-3" /> City (optional)</Label>
          <Input placeholder="e.g. Manchester" value={city} onChange={(e) => setCity(e.target.value)} className="h-10" />
        </div>
        <div className="grid gap-2">
          <Label className="text-xs flex items-center gap-1.5"><Calendar className="size-3" /> Founding Year (optional)</Label>
          <Input placeholder="e.g. 1878" value={foundingYear} onChange={(e) => setFoundingYear(e.target.value)} className="h-10" />
          <p className="text-[10px] text-muted-foreground">Used for team year number + Chinese zodiac</p>
        </div>
      </div>
      <div className="grid gap-2">
        <Label className="text-xs flex items-center gap-1.5"><Shirt className="size-3" /> Key Jersey Numbers (comma-separated)</Label>
        <Input placeholder="e.g. 10, 7, 23" value={jerseys} onChange={(e) => setJerseys(e.target.value)} className="h-10" />
        <p className="text-[11px] text-muted-foreground">GG33 classifies each jersey with master/karmic/wealth/money tags.</p>
      </div>

      {/* Players section */}
      <div className="mt-2 rounded-md border border-muted p-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold flex items-center gap-1.5"><User2 className="size-3" /> Key Players (optional)</Label>
          <button type="button" onClick={addPlayer} className="text-xs text-amber-700 dark:text-amber-300 hover:underline">
            + Add player
          </button>
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground">Adding a player&apos;s birthday computes their GG33 Life Path + Chinese zodiac sign.</p>
        {players.length === 0 && (
          <p className="mt-2 text-[11px] italic text-muted-foreground">No players added. Click &quot;+ Add player&quot; to include key players.</p>
        )}
        <div className="mt-2 space-y-2">
          {players.map((p, i) => (
            <div key={i} className="grid gap-1.5 rounded border bg-background p-2">
              <div className="flex items-center gap-2">
                <Input placeholder="Player name" value={p.name} onChange={(e) => updatePlayer(i, "name", e.target.value)} className="h-8 text-xs" />
                <button type="button" onClick={() => removePlayer(i)} className="shrink-0 text-xs text-rose-600 hover:underline">Remove</button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <Input type="date" placeholder="Birthday" value={p.birthDate} onChange={(e) => updatePlayer(i, "birthDate", e.target.value)} className="h-8 text-xs" min="1900-01-01" max="2200-12-31" />
                <Input placeholder="Jersey #" value={p.jersey} onChange={(e) => updatePlayer(i, "jersey", e.target.value)} className="h-8 text-xs" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Individual sport fields (F1, tennis, boxing, MMA, golf, etc.) ───
function IndividualFields({ prefix, name, setName, birthDate, setBirthDate, teamNumber, setTeamNumber }: {
  prefix: string;
  name: string; setName: (v: string) => void;
  birthDate: string; setBirthDate: (v: string) => void;
  teamNumber: string; setTeamNumber: (v: string) => void;
}) {
  return (
    <div className="grid gap-3 rounded-lg border bg-card p-4">
      <p className="text-sm font-semibold">{prefix}</p>
      <div className="grid gap-2">
        <Label className="text-xs flex items-center gap-1.5"><User2 className="size-3" /> Competitor Name</Label>
        <Input placeholder="e.g. Lewis Hamilton" value={name} onChange={(e) => setName(e.target.value)} className="h-10" />
      </div>
      <div className="grid gap-2">
        <Label className="text-xs flex items-center gap-1.5"><Calendar className="size-3" /> Birth Date</Label>
        <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="h-10" min="1900-01-01" max="2200-12-31" />
        <p className="text-[10px] text-muted-foreground">Computes GG33 Life Path + Chinese zodiac for this competitor.</p>
      </div>
      <div className="grid gap-2">
        <Label className="text-xs flex items-center gap-1.5"><Shirt className="size-3" /> Car# / Seed# / Number (optional)</Label>
        <Input placeholder="e.g. 44 (Hamilton), 1 (Verstappen)" value={teamNumber} onChange={(e) => setTeamNumber(e.target.value)} className="h-10" />
        <p className="text-[10px] text-muted-foreground">GG33 classifies this number with master/wealth/money tags.</p>
      </div>
    </div>
  );
}

function parseJerseys(s: string): number[] {
  return s.split(/[\s,]+/).map(x => parseInt(x, 10)).filter(x => Number.isFinite(x) && x > 0 && x < 100);
}

function parseFoundingYear(s: string): number | undefined {
  const n = parseInt(s, 10);
  return Number.isFinite(n) && n >= 1800 && n <= 2200 ? n : undefined;
}

function parsePlayers(players: PlayerFormValues[]) {
  return players
    .filter(p => p.name.trim() || p.birthDate.trim() || p.jersey.trim())
    .map(p => ({
      name: p.name.trim() || "Unknown",
      birthDate: p.birthDate || undefined,
      jersey: p.jersey ? parseInt(p.jersey, 10) : undefined,
    }));
}

export function SportsForm({ onAnalyze, loading }: { onAnalyze: (v: SportsFormValues) => Promise<void>; loading: boolean }) {
  const [sportType, setSportType] = useState("Soccer (Football)");
  const [eventDate, setEventDate] = useState("");
  // Team sport state
  const [team1Name, setTeam1Name] = useState("");
  const [team1City, setTeam1City] = useState("");
  const [team1FoundingYear, setTeam1FoundingYear] = useState("");
  const [team1Jerseys, setTeam1Jerseys] = useState("");
  const [team1Players, setTeam1Players] = useState<PlayerFormValues[]>([]);
  const [team2Name, setTeam2Name] = useState("");
  const [team2City, setTeam2City] = useState("");
  const [team2FoundingYear, setTeam2FoundingYear] = useState("");
  const [team2Jerseys, setTeam2Jerseys] = useState("");
  const [team2Players, setTeam2Players] = useState<PlayerFormValues[]>([]);
  // Individual sport state (competitor 1 and 2)
  const [ind1Name, setInd1Name] = useState("");
  const [ind1BirthDate, setInd1BirthDate] = useState("");
  const [ind1Number, setInd1Number] = useState("");
  const [ind2Name, setInd2Name] = useState("");
  const [ind2BirthDate, setInd2BirthDate] = useState("");
  const [ind2Number, setInd2Number] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isIndividual = INDIVIDUAL_SPORTS.includes(sportType as typeof INDIVIDUAL_SPORTS[number]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!eventDate) { setError("Please enter the event date."); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) { setError("Event date must be yyyy-mm-dd."); return; }
    const [y, m, d] = eventDate.split("-").map(Number);
    if (y < 1900 || y > 2200 || m < 1 || m > 12 || d < 1 || d > 31) { setError("Event date is out of range (1900–2200)."); return; }

    if (isIndividual) {
      // Individual sport — use competitor names + birthdays
      if (!ind1Name.trim() || !ind2Name.trim()) { setError("Please enter both competitor names."); return; }
      // For individual sports, we pass the competitor as a "team" with the competitor's name
      // and birthday as a player. The car#/seed# becomes the jersey number.
      await onAnalyze({
        sportType,
        eventDate,
        team1Name: ind1Name.trim(),
        team1City: "",
        team1FoundingYear: "",
        team1Jerseys: ind1Number.trim(),
        team1Players: [{ name: ind1Name.trim(), birthDate: ind1BirthDate, jersey: ind1Number.trim() }],
        team2Name: ind2Name.trim(),
        team2City: "",
        team2FoundingYear: "",
        team2Jerseys: ind2Number.trim(),
        team2Players: [{ name: ind2Name.trim(), birthDate: ind2BirthDate, jersey: ind2Number.trim() }],
      });
    } else {
      // Team sport
      if (!team1Name.trim() || !team2Name.trim()) { setError("Please enter both team names."); return; }
      await onAnalyze({
        sportType,
        eventDate,
        team1Name: team1Name.trim(),
        team1City: team1City.trim(),
        team1FoundingYear,
        team1Jerseys,
        team1Players,
        team2Name: team2Name.trim(),
        team2City: team2City.trim(),
        team2FoundingYear,
        team2Jerseys,
        team2Players,
      });
    }
  }

  return (
    <Card className="w-full border-2 border-rose-200/50 dark:border-rose-900/30 bg-gradient-to-br from-rose-50/40 via-card to-amber-50/30 dark:from-rose-950/10 dark:to-amber-950/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Trophy className="size-5 text-rose-600" /> Sports Event Predictor (All Sports)
        </CardTitle>
        <CardDescription>
          {isIndividual
            ? "Individual sport — enter competitor names + birth dates for GG33 Life Path + Chinese zodiac analysis."
            : "Team sport — enter team names + founding year + key players for full GG33 + Chinese zodiac analysis."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-5">
          {/* Sport type + event date */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label className="text-sm">Sport Type</Label>
              <Select value={sportType} onValueChange={setSportType}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SPORT_TYPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="eventDate" className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" /> Event Date
              </Label>
              <Input id="eventDate" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)}
                min="1900-01-01" max="2200-12-31" className="h-11" />
            </div>
          </div>

          {/* Competitors — individual or team depending on sport type */}
          {isIndividual ? (
            <div className="grid gap-4 md:grid-cols-2">
              <IndividualFields prefix="Competitor 1" name={ind1Name} setName={setInd1Name}
                birthDate={ind1BirthDate} setBirthDate={setInd1BirthDate}
                teamNumber={ind1Number} setTeamNumber={setInd1Number} />
              <IndividualFields prefix="Competitor 2" name={ind2Name} setName={setInd2Name}
                birthDate={ind2BirthDate} setBirthDate={setInd2BirthDate}
                teamNumber={ind2Number} setTeamNumber={setInd2Number} />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <TeamFields prefix="Team 1" name={team1Name} setName={setTeam1Name}
                city={team1City} setCity={setTeam1City}
                foundingYear={team1FoundingYear} setFoundingYear={setTeam1FoundingYear}
                jerseys={team1Jerseys} setJerseys={setTeam1Jerseys}
                players={team1Players} setPlayers={setTeam1Players} />
              <TeamFields prefix="Team 2" name={team2Name} setName={setTeam2Name}
                city={team2City} setCity={setTeam2City}
                foundingYear={team2FoundingYear} setFoundingYear={setTeam2FoundingYear}
                jerseys={team2Jerseys} setJerseys={setTeam2Jerseys}
                players={team2Players} setPlayers={setTeam2Players} />
            </div>
          )}

          {error && <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}
          <SubmitButton loading={loading} label="Predict Winner" />
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Country form ──────────────────────────────────────────────────────
export interface CountryFormValues {
  countryName: string;
  foundingDate: string;
  region: string;
}

export function CountryForm({ onAnalyze, loading }: { onAnalyze: (v: CountryFormValues) => Promise<void>; loading: boolean }) {
  const [countryName, setCountryName] = useState("");
  const [foundingDate, setFoundingDate] = useState("");
  const [region, setRegion] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!countryName.trim()) { setError("Please enter the country name."); return; }
    if (!foundingDate) { setError("Please enter the founding / independence date."); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(foundingDate)) { setError("Date must be yyyy-mm-dd."); return; }
    const [y, m, d] = foundingDate.split("-").map(Number);
    if (y < 1900 || y > 2200 || m < 1 || m > 12 || d < 1 || d > 31) { setError("Date is out of range (1900–2200)."); return; }
    await onAnalyze({ countryName: countryName.trim(), foundingDate, region: region.trim() });
  }

  return (
    <Card className="w-full border-2 border-sky-200/50 dark:border-sky-900/30 bg-gradient-to-br from-sky-50/40 via-card to-amber-50/30 dark:from-sky-950/10 dark:to-amber-950/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Globe className="size-5 text-sky-600" /> Country Analysis
        </CardTitle>
        <CardDescription>
          Country name + founding/independence date → GG33 numerology + Chinese zodiac analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="countryName" className="flex items-center gap-2">
              <Globe className="size-4 text-muted-foreground" /> Country Name (official)
            </Label>
            <Input id="countryName" placeholder="e.g. United States of America" value={countryName}
              onChange={(e) => setCountryName(e.target.value)} className="h-11" autoComplete="off" />
            <p className="text-xs text-muted-foreground">Use the official country name. GG33 reduces via Pythagorean.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="foundingDate" className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" /> Founding / Independence Date
              </Label>
              <Input id="foundingDate" type="date" value={foundingDate} onChange={(e) => setFoundingDate(e.target.value)}
                min="1900-01-01" max="2200-12-31" className="h-11" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="region" className="flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" /> Region (optional)
              </Label>
              <Input id="region" placeholder="e.g. North America, Europe, Asia" value={region}
                onChange={(e) => setRegion(e.target.value)} className="h-11" autoComplete="off" />
            </div>
          </div>
          {error && <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}
          <SubmitButton loading={loading} label="Analyze Country" />
        </form>
      </CardContent>
    </Card>
  );
}

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
import { Loader2, Sparkles, User2, Calendar, Clock } from "lucide-react";

export interface AnalyzerFormValues {
  fullName: string;
  birthDate: string;
  birthTime: string;
  gender: string;
  partnerAnimal: string;
}

const ANIMALS = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];

interface Props {
  onAnalyze: (v: AnalyzerFormValues) => Promise<void>;
  loading: boolean;
}

export function AnalyzerForm({ onAnalyze, loading }: Props) {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [gender, setGender] = useState("none");
  const [partnerAnimal, setPartnerAnimal] = useState("none");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!fullName.trim()) {
      setError("Please enter your full birth name (the name on your birth certificate).");
      return;
    }
    if (!birthDate) {
      setError("Please enter your birth date.");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      setError("Birth date must be in yyyy-mm-dd format.");
      return;
    }
    const [y, m, d] = birthDate.split("-").map(Number);
    if (y < 1900 || y > 2200 || m < 1 || m > 12 || d < 1 || d > 31) {
      setError("Birth date is out of range (1900–2200).");
      return;
    }
    await onAnalyze({
      fullName: fullName.trim(),
      birthDate,
      birthTime: birthTime || "",
      gender: gender === "none" ? "" : gender,
      partnerAnimal: partnerAnimal === "none" ? "" : partnerAnimal,
    });
  }

  return (
    <Card className="w-full border-2 border-amber-200/50 dark:border-amber-900/30 bg-gradient-to-br from-amber-50/40 via-card to-rose-50/30 dark:from-amber-950/10 dark:to-rose-950/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="size-5 text-amber-600" />
          Birth Profile Input
        </CardTitle>
        <CardDescription>
          Enter your full birth name and date of birth. Add the birth time for an accurate Bazi hour pillar — leave it blank if unknown.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User2 className="size-4 text-muted-foreground" />
              Full Birth Name
            </Label>
            <Input
              id="fullName"
              placeholder="e.g. John Adam Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="off"
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              Use the name on your birth certificate. GG33 uses Chaldean letter values for name numbers.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="birthDate" className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                Birth Date
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                min="1900-01-01"
                max="2200-12-31"
                className="h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="birthTime" className="flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                Birth Time (optional)
              </Label>
              <Input
                id="birthTime"
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="h-11"
              />
            </div>
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
            <div className="grid gap-2">
              <Label className="text-sm">Partner&apos;s Zodiac (optional)</Label>
              <Select value={partnerAnimal} onValueChange={setPartnerAnimal}>
                <SelectTrigger className="h-11"><SelectValue placeholder="None — skip compatibility" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {ANIMALS.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Calculating…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Generate Prediction Analysis
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              All calculations run server-side. Nothing is stored.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

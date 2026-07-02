"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  PersonForm,
  CompanyForm,
  CountryForm,
  SportsForm,
  type PersonFormValues,
  type CompanyFormValues,
  type CountryFormValues,
  type SportsFormValues,
} from "@/components/analyzer/EntityForms";
import { OverviewSection } from "@/components/analyzer/OverviewSection";
import { NumerologySection } from "@/components/analyzer/NumerologySection";
import {
  PersonalitySection,
  CareerSection,
  RelationshipSection,
  HealthSection,
  LuckySection,
} from "@/components/analyzer/DetailSections";
import { ForecastSection, RoadmapSection } from "@/components/analyzer/ForecastSection";
import { CompanyResult } from "@/components/analyzer/CompanyResult";
import { SportsResult } from "@/components/analyzer/SportsResult";
import { ChineseYearSignCard } from "@/components/analyzer/ChineseYearSignCard";
import { CompatibilitySection } from "@/components/analyzer/CompatibilitySection";
import type { AnalyzeResponse, EntityType } from "@/lib/types";
import { Sparkles, AlertCircle, User2, Building2, Trophy, Globe, Eye, Calendar, Heart, Database, Hash, MessageCircle } from "lucide-react";
import { T } from "@/lib/oracle/theme";
import { MyReadingTab, buildProfile, type OracleProfile } from "@/components/oracle/MyReadingTab";
import { DailyEnergyTab } from "@/components/oracle/DailyEnergyTab";
import { CompatibilityTab } from "@/components/oracle/CompatibilityTab";
import { EntitiesTab } from "@/components/oracle/EntitiesTab";
import { NumbersTab } from "@/components/oracle/NumbersTab";
import { OracleChatTab } from "@/components/oracle/OracleChatTab";
import { useAuth } from "@/components/oracle/auth";
import { AuthButton } from "@/components/oracle/AuthButton";
import { PaywallModal } from "@/components/oracle/PaywallModal";

type Mode = "analyzer" | "oracle";

const ENTITY_OPTIONS: { value: EntityType; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { value: "person",   label: "Person",       icon: User2,      desc: "Birth name + birth date → full numerology life analysis" },
  { value: "company",  label: "Company",      icon: Building2,  desc: "Company name + founding date → numerology + Chinese zodiac" },
  { value: "country",  label: "Country",      icon: Globe,      desc: "Country name + founding/independence date → numerology + Chinese zodiac" },
  { value: "sports",   label: "Sports Event", icon: Trophy,     desc: "Team 1 vs Team 2 + event date → predicted winner" },
];

const ORACLE_TABS = [
  { value: "reading",       label: "MY READING",     icon: Eye },
  { value: "daily",         label: "DAILY ENERGY",   icon: Calendar },
  { value: "compatibility", label: "COMPATIBILITY",  icon: Heart },
  { value: "entities",      label: "ENTITIES",       icon: Database },
  { value: "numbers",       label: "NUMBERS",        icon: Hash },
  { value: "oracle",        label: "ORACLE",         icon: MessageCircle },
] as const;

export default function Home() {
  const [entityType, setEntityType] = useState<EntityType>("person");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [oracleTab, setOracleTab] = useState<string>("reading");
  const [birthDate, setBirthDate] = useState("");
  const [profile, setProfile] = useState<OracleProfile | null>(null);
  const [mode, setMode] = useState<Mode>("oracle");
  const { state: authState, refresh: refreshAuth } = useAuth();
  const [paywall, setPaywall] = useState<{ feature: "oracle" | "analyzer" } | null>(null);

  // Load birthdate from account (DB) or localStorage
  useEffect(() => {
    if (authState.user.isSignedIn && authState.user.birthdate) {
      setBirthDate(authState.user.birthdate);
      setProfile(buildProfile(authState.user.birthdate));
      try { localStorage.setItem("so_bd", authState.user.birthdate); } catch {}
      return;
    }
    try {
      const bd = localStorage.getItem("so_bd");
      if (bd) { setBirthDate(bd); setProfile(buildProfile(bd)); }
    } catch {}
  }, [authState.user.isSignedIn, authState.user.birthdate]);

  function handleBirthDateChange(s: string) {
    setBirthDate(s);
    setProfile(s ? buildProfile(s) : null);
  }

  async function callAnalyze(payload: Record<string, unknown>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (res.status === 402) { setPaywall({ feature: "analyzer" }); await refreshAuth(); return; }
      if (!res.ok || !json.ok) throw new Error(json.error || `Request failed (${res.status})`);
      setData(json);
      await refreshAuth();
      setTimeout(() => { document.getElementById("analyzer-results")?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 100);
    } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); }
    finally { setLoading(false); }
  }

  async function handlePerson(v: PersonFormValues) {
    await callAnalyze({ entityType: "person", fullName: v.fullName, birthDate: v.birthDate, gender: v.gender || null, partnerName: v.partnerName || null, partnerBirthDate: v.partnerBirthDate || null });
  }
  async function handleCompany(v: CompanyFormValues) {
    await callAnalyze({ entityType: "company", companyName: v.companyName, foundingDate: v.foundingDate, industry: v.industry || null });
  }
  async function handleCountry(v: CountryFormValues) {
    await callAnalyze({ entityType: "country", countryName: v.countryName, foundingDate: v.foundingDate, industry: v.region || null });
  }
  async function handleSports(v: SportsFormValues) {
    await callAnalyze({ entityType: "sports", sportType: v.sportType, eventDate: v.eventDate, team1Name: v.team1Name, team1City: v.team1City || null, team1FoundingYear: v.team1FoundingYear ? parseInt(v.team1FoundingYear, 10) : undefined, team1Jerseys: v.team1Jerseys.split(/[\s,]+/).map((x) => parseInt(x, 10)).filter((x) => Number.isFinite(x) && x > 0 && x < 100), team1Players: v.team1Players.filter((p) => p.name.trim() || p.birthDate.trim() || p.jersey.trim()).map((p) => ({ name: p.name.trim() || "Unknown", birthDate: p.birthDate || undefined, jersey: p.jersey ? parseInt(p.jersey, 10) : undefined })), team2Name: v.team2Name, team2City: v.team2City || null, team2FoundingYear: v.team2FoundingYear ? parseInt(v.team2FoundingYear, 10) : undefined, team2Jerseys: v.team2Jerseys.split(/[\s,]+/).map((x) => parseInt(x, 10)).filter((x) => Number.isFinite(x) && x > 0 && x < 100), team2Players: v.team2Players.filter((p) => p.name.trim() || p.birthDate.trim() || p.jersey.trim()).map((p) => ({ name: p.name.trim() || "Unknown", birthDate: p.birthDate || undefined, jersey: p.jersey ? parseInt(p.jersey, 10) : undefined })) });
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: T.bg, color: T.text, fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      {/* HEADER */}
      <header className="border-b sticky top-0 z-30 backdrop-blur" style={{ background: `${T.bg2}f0`, borderColor: T.border }}>
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl shadow-md" style={{ background: `linear-gradient(135deg, ${T.orange}, ${T.orangeHi})`, color: "#000" }}>
              <Sparkles className="size-5" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight sm:text-lg" style={{ color: T.text }}>Silent <span style={{ color: T.orange }}>Oracle</span></h1>
              <p className="text-xs" style={{ color: T.textDim }}>Numerology · Astrology · Energy Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex rounded-md p-1 gap-1" style={{ background: T.bg3, border: `1px solid ${T.border}` }}>
              <button onClick={() => setMode("oracle")} className="px-3 py-1.5 text-xs font-bold rounded transition-colors" style={{ background: mode === "oracle" ? `${T.orange}22` : "transparent", color: mode === "oracle" ? T.orange : T.textDim, border: `1px solid ${mode === "oracle" ? T.orange : "transparent"}`, letterSpacing: "2px" }}>🔮 ORACLE</button>
              <button onClick={() => setMode("analyzer")} className="px-3 py-1.5 text-xs font-bold rounded transition-colors" style={{ background: mode === "analyzer" ? `${T.orange}22` : "transparent", color: mode === "analyzer" ? T.orange : T.textDim, border: `1px solid ${mode === "analyzer" ? T.orange : "transparent"}`, letterSpacing: "2px" }}>📊 ANALYZER</button>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 pb-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs" style={{ background: T.card, border: `1px solid ${T.border}`, color: T.textDim }}>
          <Sparkles className="size-3" style={{ color: T.orange }} />
          Numerology · Astrology · Chinese Zodiac · Oracle AI — for reflection and entertainment
        </div>
        <h2 className="mx-auto mt-4 max-w-4xl text-balance font-bold tracking-tight oracle-glow" style={{ fontSize: "clamp(28px, 5vw, 48px)", color: T.orange, fontFamily: "Georgia, serif", letterSpacing: "1px" }}>
          Decode any entity. Consult the Oracle. Master your numbers.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-balance text-sm sm:text-base" style={{ color: T.textMid }}>
          {mode === "oracle" ? (
            <>Build your <strong style={{ color: T.orange }}>personal numerology profile</strong>, track <strong style={{ color: T.orange }}>daily energy</strong>, check <strong style={{ color: T.orange }}>compatibility</strong>, browse <strong style={{ color: T.orange }}>{authState.user.isSubscribed ? "1,000+ entities" : "20 sample entities"}</strong>{authState.user.isSubscribed ? "" : " (Pro unlocks all 1,000+)"}, and ask the <strong style={{ color: T.orange }}>Oracle AI</strong> for guidance.</>
          ) : (
            <>Analyze a <strong style={{ color: T.orange }}>person</strong>, <strong style={{ color: T.orange }}>company</strong>, <strong style={{ color: T.orange }}>country</strong>, or <strong style={{ color: T.orange }}>sports event</strong> — numerology + Chinese zodiac analysis.</>
          )}
        </p>
      </section>

      {/* ORACLE MODE */}
      {mode === "oracle" && (
        <section className="mx-auto w-full max-w-3xl px-4 pb-16 flex-1">
          <Tabs value={oracleTab} onValueChange={setOracleTab}>
            <TabsList className="mb-5 flex h-auto w-full flex-wrap gap-1 p-1 overflow-x-auto oracle-scrollbar" style={{ background: T.card, border: `1px solid ${T.border}` }}>
              {ORACLE_TABS.map((t) => {
                const Icon = t.icon;
                const active = oracleTab === t.value;
                return (
                  <TabsTrigger key={t.value} value={t.value} className="flex-1 min-w-[100px] flex items-center gap-1.5 px-2 py-2 text-[10px] font-bold tracking-wider" style={{ color: active ? T.orange : T.textDim, letterSpacing: "1.5px" }}>
                    <Icon className="size-3.5" />
                    <span className="hidden sm:inline">{t.label}</span>
                    <span className="sm:hidden">{t.label.split(" ")[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <TabsContent value="reading" className="mt-0"><MyReadingTab birthDate={birthDate} onBirthDateChange={handleBirthDateChange} profile={profile} /></TabsContent>
            <TabsContent value="daily" className="mt-0"><DailyEnergyTab /></TabsContent>
            <TabsContent value="compatibility" className="mt-0"><CompatibilityTab /></TabsContent>
            <TabsContent value="entities" className="mt-0"><EntitiesTab profile={profile} /></TabsContent>
            <TabsContent value="numbers" className="mt-0"><NumbersTab /></TabsContent>
            <TabsContent value="oracle" className="mt-0"><OracleChatTab profile={profile} /></TabsContent>
          </Tabs>
        </section>
      )}

      {/* ANALYZER MODE */}
      {mode === "analyzer" && (
        <>
          <section id="analyzer-input" className="mx-auto w-full max-w-4xl px-4 pb-10">
            {!authState.user.isSubscribed && (
              <div className="mb-4 rounded-md p-3 text-xs" style={{ background: `${T.red}11`, border: `1px solid ${T.red}55`, color: T.textMid }}>
                <strong style={{ color: T.red }}>🔒 ANALYZER IS PRO-ONLY</strong> — This feature works with an active Oracle Pro subscription.
              </div>
            )}
            {authState.user.isSubscribed && (
              <div className="mb-4 flex items-center gap-2 rounded-md p-3 text-xs" style={{ background: `${T.green}11`, border: `1px solid ${T.green}55` }}>
                <span style={{ color: T.green, fontWeight: "bold" }}>✓ {authState.user.isAdmin ? "Admin" : "Oracle Pro"}</span>
                <span style={{ color: T.textMid }}>— Unlimited analyzer searches</span>
              </div>
            )}
            <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ENTITY_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = entityType === opt.value;
                return (
                  <button key={opt.value} type="button" onClick={() => { setEntityType(opt.value); setError(null); }} className="rounded-xl border-2 p-4 text-left transition-all" style={{ borderColor: active ? T.orange : T.border, background: active ? `${T.orange}11` : T.card, boxShadow: active ? `0 4px 12px ${T.orange}33` : "none" }}>
                    <Icon className="size-5" style={{ color: active ? T.orange : T.textDim }} />
                    <p className="mt-2 font-semibold" style={{ color: T.text }}>{opt.label}</p>
                    <p className="mt-0.5 text-xs" style={{ color: T.textDim }}>{opt.desc}</p>
                  </button>
                );
              })}
            </div>
            {entityType === "person" && <PersonForm onAnalyze={handlePerson} loading={loading} />}
            {entityType === "company" && <CompanyForm onAnalyze={handleCompany} loading={loading} />}
            {entityType === "country" && <CountryForm onAnalyze={handleCountry} loading={loading} />}
            {entityType === "sports" && <SportsForm onAnalyze={handleSports} loading={loading} />}
            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-md p-3 text-sm" style={{ background: `${T.red}11`, border: `1px solid ${T.red}55`, color: T.red }}>
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </section>
          {data && (
            <section id="analyzer-results" className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16">
              {data.entityType === "person" && data.report && (
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="mb-5 flex h-auto w-full flex-wrap gap-1 p-1 overflow-x-auto oracle-scrollbar" style={{ background: T.card, border: `1px solid ${T.border}` }}>
                    {["overview", "numerology", "chinese", "personality", "career", "relationships", "compatibility", "health", "forecast", "lucky"].filter((v) => v !== "compatibility" || data.compatibility).map((v) => (
                      <TabsTrigger key={v} value={v} className="flex-1 min-w-[90px] capitalize text-[11px] font-bold tracking-wider" style={{ color: T.textMid, letterSpacing: "1.5px" }}>{v}</TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsContent value="overview" className="mt-0"><OverviewSection data={data} /></TabsContent>
                  <TabsContent value="numerology" className="mt-0"><NumerologySection data={data} /></TabsContent>
                  <TabsContent value="chinese" className="mt-0">{data.chineseYearSign ? <ChineseYearSignCard sign={data.chineseYearSign} contextLabel="Your birth year" /> : <p className="text-sm" style={{ color: T.textDim }}>Chinese zodiac data not available.</p>}</TabsContent>
                  <TabsContent value="personality" className="mt-0"><PersonalitySection data={data} /></TabsContent>
                  <TabsContent value="career" className="mt-0"><div className="grid gap-5"><CareerSection data={data} /><RoadmapSection data={data} /></div></TabsContent>
                  <TabsContent value="relationships" className="mt-0"><RelationshipSection data={data} /></TabsContent>
                  {data.compatibility && <TabsContent value="compatibility" className="mt-0"><CompatibilitySection data={data} /></TabsContent>}
                  <TabsContent value="health" className="mt-0"><HealthSection data={data} /></TabsContent>
                  <TabsContent value="forecast" className="mt-0"><div className="grid gap-5"><ForecastSection data={data} /><RoadmapSection data={data} /></div></TabsContent>
                  <TabsContent value="lucky" className="mt-0"><LuckySection data={data} /></TabsContent>
                </Tabs>
              )}
              {(data.entityType === "company" || data.entityType === "country") && (data.entityChart || data.companyChart) && (
                <div className="grid gap-5">
                  <CompanyResult data={data} />
                  {data.chineseYearSign && <ChineseYearSignCard sign={data.chineseYearSign} contextLabel={data.entityType === "country" ? "Country's founding/independence year" : "Company's founding year"} />}
                </div>
              )}
              {data.entityType === "sports" && data.sportsPrediction && <SportsResult data={data} />}
            </section>
          )}
        </>
      )}

      {/* ADD TO HOME SCREEN */}
      <section className="mx-auto w-full max-w-3xl px-4 pb-8">
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "10px", padding: "20px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", color: T.textDim, marginBottom: "8px", textTransform: "uppercase" }}>📱 ADD SILENT ORACLE TO YOUR HOME SCREEN</div>
          <p style={{ fontSize: "12px", color: T.textMid, lineHeight: 1.7, marginBottom: "12px" }}>Don&apos;t have the app yet? Install Silent Oracle on your phone for quick access — it works like a native app.</p>
          <div style={{ fontSize: "12px", color: T.textMid, lineHeight: 1.9 }}>
            <p style={{ marginBottom: "8px" }}><strong style={{ color: T.orange }}>📱 iPhone (Safari):</strong><br />1. Open this page in Safari<br />2. Tap the Share button (square with up arrow) at the bottom<br />3. Scroll down and tap &quot;Add to Home Screen&quot;<br />4. Tap &quot;Add&quot;</p>
            <p><strong style={{ color: T.orange }}>🤖 Android (Chrome):</strong><br />1. Open this page in Chrome<br />2. Tap the three-dot menu (top right)<br />3. Tap &quot;Add to Home screen&quot;<br />4. Tap &quot;Add&quot;</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t" style={{ background: `${T.bg2}f0`, borderColor: T.border }}>
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs" style={{ color: T.textDim }}>
          <p className="mb-1">Silent Oracle — Numerology &amp; Astrology. For reflection and entertainment purposes only.</p>
          <p><a href="/privacy" style={{ color: T.textDim, textDecoration: "underline" }}>Privacy Policy</a> · <a href="/terms" style={{ color: T.textDim, textDecoration: "underline" }}>Terms of Service</a></p>
        </div>
      </footer>

      <PaywallModal open={paywall !== null} feature={paywall?.feature ?? "oracle"} onClose={() => setPaywall(null)} />
    </main>
  );
}

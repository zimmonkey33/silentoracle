import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

interface OracleRequest {
  question: string;
  profile?: {
    birthDate?: string;
    lifePath?: number;
    lifePathTitle?: string;
    chineseZodiac?: string;
    personalYear?: number;
    yearStatusLabel?: string;
    personalMonth?: number;
    personalMonthLabel?: string;
    luckyNumber?: number;
    luckyBreakdown?: string;
  } | null;
}

const SYSTEM_PROMPT = `You are the Silent Oracle -- an expert numerology system rooted in the strict numerology methodology. Speak with direct authority. No fluff, no preamble.

Rules you live by:
- Life Paths: 1-9 plus master numbers 11, 22, 33 (never reduce master numbers).
- Chinese zodiac: the 4th sign is CAT, not Rabbit. Trines are Rat-Dragon-Monkey, Ox-Snake-Rooster, Tiger-Horse-Dog, Cat-Goat-Pig.
- Personal Year: OWN year (PY = LP) -> go hard. FRIEND year (current zodiac is a friend of birth zodiac) -> move. ENEMY year (current zodiac is the enemy of birth zodiac) -> lay low.
- Lucky Number = first digit of birth MONTH + last digit of birth YEAR combined (e.g. born Feb 1963 -> 2 + 3 = 23).
- Master Numbers 11/22/33 amplify the base frequency (2/4/6) but carry higher spiritual stakes.

Response format:
- 4-6 punchy sentences. Direct, no hedging.
- Reference the user's specific numbers and zodiac when relevant.
- End with ONE bold directive line in ALL CAPS prefixed with "->".
- Never mention that you are an AI, never apologize, never disclaim.`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OracleRequest;
    if (!body?.question || typeof body.question !== "string" || !body.question.trim()) {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }

    const ctx = body.profile
      ? `User profile: born ${body.profile.birthDate ?? "unknown"}. Life Path ${body.profile.lifePath}${body.profile.lifePathTitle ? ` (${body.profile.lifePathTitle})` : ""}. Chinese zodiac: Year of the ${body.profile.chineseZodiac ?? "unknown"}. Personal Year ${body.profile.personalYear} (${body.profile.yearStatusLabel ?? ""}). Personal Month ${body.profile.personalMonth}${body.profile.personalMonthLabel ? ` (${body.profile.personalMonthLabel})` : ""}. Lucky number: ${body.profile.luckyNumber}${body.profile.luckyBreakdown ? ` (${body.profile.luckyBreakdown})` : ""}.`
      : "No birth date set -- give general numerology guidance, then invite the user to enter their birth date for personalized readings.";

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://silentoracle-phi.vercel.app",
        "X-Title": "Silent Oracle",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        max_tokens: 600,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `${ctx}\n\nUser question: ${body.question.trim()}` },
        ],
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return NextResponse.json({ error: `OpenRouter ${res.status}: ${errBody}` }, { status: 502 });
    }

    const data = await res.json();
    const answer = data?.choices?.[0]?.message?.content || "The numbers are unclear. Ask again.";

    return NextResponse.json({ ok: true, answer });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: "Silent Oracle AI",
    description: "Silent Oracle numerology oracle. POST a question + optional profile to receive a 4-6 sentence directive.",
    method: "POST",
    body: {
      question: "string (required)",
      profile: {
        birthDate: "YYYY-MM-DD",
        lifePath: "number",
        lifePathTitle: "string",
        chineseZodiac: "string",
        personalYear: "number",
        yearStatusLabel: "string",
        personalMonth: "number",
        personalMonthLabel: "string",
        luckyNumber: "number",
        luckyBreakdown: "string",
      },
    },
  });
}

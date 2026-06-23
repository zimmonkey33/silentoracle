import { NextRequest, NextResponse } from "next/server";
import { analyze } from "@/lib/prediction/analyzer";
import type { AnalyzeRequest } from "@/lib/prediction/analyzer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AnalyzeRequest;
    if (!body || !body.entityType) {
      return NextResponse.json(
        { error: "entityType is required (person | company | sports)" },
        { status: 400 },
      );
    }
    const result = await analyze(body);
    return NextResponse.json({ ok: true, ...result });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: "GG33 Numerology × Chinese Astrology — Multi-Entity Prediction Analyzer",
    methodology: "Strict GG33: Chaldean name math + Pythagorean date math, master numbers 11-99 preserved, compound numbers 1-99 with lucky/unlucky classification.",
    entityTypes: ["person", "company", "sports"],
    endpoints: {
      analyze: {
        method: "POST",
        examples: {
          person: {
            entityType: "person",
            fullName: "John Adam Smith",
            birthDate: "1996-07-04",
            birthTime: "08:30",
            gender: "male",
            partnerAnimal: "Dragon",
          },
          company: {
            entityType: "company",
            companyName: "Apple Inc",
            foundingDate: "1976-04-01",
            industry: "Technology",
          },
          sports: {
            entityType: "sports",
            eventDate: "2025-12-25",
            team1Name: "Manchester United",
            team1City: "Manchester",
            team1Jerseys: [10, 7, 23],
            team2Name: "Liverpool FC",
            team2City: "Liverpool",
            team2Jerseys: [11, 8, 4],
          },
        },
      },
    },
  });
}

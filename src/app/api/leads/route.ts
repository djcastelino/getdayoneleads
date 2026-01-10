import { NextResponse } from "next/server";
import { fetchLeads, LeadsResponse, SectorKey } from "@/lib/leads";

function parseSectors(value: unknown): SectorKey[] | undefined {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is SectorKey => isSector(entry));
  }

  if (typeof value === "string" && value.trim().length) {
    return value
      .split(",")
      .map((segment) => segment.trim())
      .filter((segment): segment is SectorKey => isSector(segment));
  }

  return undefined;
}

function isSector(value: string): value is SectorKey {
  return ["Janitorial", "Construction", "Fencing", "Waste", "Other"].includes(value as SectorKey);
}

async function handleRequest(sectors?: SectorKey[]): Promise<LeadsResponse> {
  return fetchLeads({ sectors });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sectorsParam = searchParams.get("sectors");
  const sectors = parseSectors(sectorsParam ?? undefined);

  const data = await handleRequest(sectors);
  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const sectors = parseSectors(body?.sectors);

  const data = await handleRequest(sectors);
  return NextResponse.json(data, { status: 200 });
}

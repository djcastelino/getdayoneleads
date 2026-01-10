export type SectorKey = "Janitorial" | "Construction" | "Fencing" | "Waste" | "Other";

export interface RawLead {
  awardId: string;
  project: string;
  location: string;
  value: string;
  winner: string;
  agency: string;
  naics: string;
  lastModified: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface Lead extends RawLead {
  amount: number | null;
  sector: SectorKey;
  city: string;
  timeline: Array<{ label: string; date: string; status: "past" | "current" | "upcoming" }>;
}

export interface LeadsResponse {
  count: number;
  leads: Lead[];
  generatedAt: string;
}

const SECTOR_LOOKUP: Array<{ sector: SectorKey; codes: RegExp[] }> = [
  { sector: "Janitorial", codes: [/^56172/, /^5617/] },
  { sector: "Construction", codes: [/^23/] },
  { sector: "Fencing", codes: [/23899/, /56173/] },
  { sector: "Waste", codes: [/562/] },
];

const FALLBACK_LEADS: LeadsResponse = {
  count: 3,
  generatedAt: new Date().toISOString(),
  leads: [
    {
      awardId: "SAMPLE-001",
      project: "Downtown Transit Center Cleaning",
      location: "Raleigh, NC",
      value: "$125,400",
      winner: "BlueSky Facilities",
      agency: "NC Department of Transportation",
      naics: "561720",
      lastModified: new Date().toISOString(),
      amount: 125400,
      sector: "Janitorial",
      city: "Raleigh",
      timeline: buildTimeline(new Date().toISOString()),
      contactName: "Mike Stevenson",
      contactPhone: "(919) 555-0123",
      contactEmail: "contracts@blueskyfacilities.com",
    },
    {
      awardId: "SAMPLE-002",
      project: "Wake County Elementary School Wing",
      location: "Cary, NC",
      value: "$2,450,000",
      winner: "NorthBuild Partners",
      agency: "Wake County Schools",
      naics: "236220",
      lastModified: new Date().toISOString(),
      amount: 2450000,
      sector: "Construction",
      city: "Cary",
      timeline: buildTimeline(new Date().toISOString()),
      contactName: "Sarah Chen",
      contactPhone: "(919) 555-0888",
      contactEmail: "bids@northbuild.com",
    },
    {
      awardId: "SAMPLE-003",
      project: "Perimeter Fencing Upgrade",
      location: "Charlotte, NC",
      value: "$410,000",
      winner: "SecureLine Systems",
      agency: "Charlotte Housing Authority",
      naics: "238990",
      lastModified: new Date().toISOString(),
      amount: 410000,
      sector: "Fencing",
      city: "Charlotte",
      timeline: buildTimeline(new Date().toISOString()),
      contactName: "Marcus Thorne",
      contactPhone: "(704) 555-0199",
      contactEmail: "mthorne@securelinesys.com",
    },
  ],
};

function mapSector(naics: string): SectorKey {
  if (!naics) {
    return "Other";
  }

  const normalized = naics.trim();

  for (const entry of SECTOR_LOOKUP) {
    if (entry.codes.some((pattern) => pattern.test(normalized))) {
      return entry.sector;
    }
  }

  return "Other";
}

function parseAmount(value: string): number | null {
  const numeric = value.replace(/[^0-9.]/g, "");
  if (!numeric) {
    return null;
  }

  const parsed = Number.parseFloat(numeric);
  return Number.isNaN(parsed) ? null : parsed;
}

function extractCity(location: string): string {
  if (!location) {
    return "North Carolina";
  }

  const [city] = location.split(",");
  return city.trim();
}

function buildTimeline(lastModified: string): Array<{
  label: string;
  date: string;
  status: "past" | "current" | "upcoming";
}> {
  const milestones = [
    { label: "Award Posted", offset: -5 },
    { label: "Site Visit", offset: -2 },
    { label: "Bid Awarded", offset: 0 },
    { label: "Kickoff", offset: 7 },
  ];

  const base = lastModified ? new Date(lastModified) : new Date();
  const today = new Date();

  return milestones.map(({ label, offset }) => {
    const date = new Date(base);
    date.setDate(date.getDate() + offset);

    let status: "past" | "current" | "upcoming" = "past";
    if (Math.abs(date.getTime() - today.getTime()) < 36 * 60 * 60 * 1000) {
      status = "current";
    } else if (date > today) {
      status = "upcoming";
    }

    return {
      label,
      date: date.toISOString(),
      status,
    };
  });
}

function normalizeLead(raw: Partial<RawLead>): Lead {
  const awardId = raw.awardId ?? "Unassigned";
  const project = raw.project ?? "No description provided";
  const location = raw.location ?? "North Carolina";
  const value = raw.value ?? "Pending valuation";
  const winner = raw.winner ?? "Not published";
  const agency = raw.agency ?? "Unknown agency";
  const naics = raw.naics ?? "N/A";
  const lastModified = raw.lastModified ?? new Date().toISOString();
  const contactName = raw.contactName;
  const contactPhone = raw.contactPhone;
  const contactEmail = raw.contactEmail;

  return {
    awardId,
    project,
    location,
    value,
    winner,
    agency,
    naics,
    lastModified,
    contactName,
    contactPhone,
    contactEmail,
    amount: parseAmount(value),
    sector: mapSector(naics),
    city: extractCity(location),
    timeline: buildTimeline(lastModified),
  };
}

export interface LeadsOptions {
  sectors?: SectorKey[];
}

export async function fetchLeads(options: LeadsOptions = {}): Promise<LeadsResponse> {
  const url = process.env.N8N_NC_LEADS_URL;

  if (!url) {
    return filterLeads(FALLBACK_LEADS, options);
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
      // 15s should handle API latency comfortably
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to load leads", res.status, await res.text());
      return filterLeads(FALLBACK_LEADS, options);
    }

    const payload = await res.json();
    const leads = Array.isArray(payload?.leads)
      ? (payload.leads as Partial<RawLead>[]).map(normalizeLead)
      : [];

    const response: LeadsResponse = {
      count: Number.isFinite(payload?.count)
        ? Number(payload.count)
        : leads.length,
      leads,
      generatedAt: new Date().toISOString(),
    };

    return filterLeads(response, options);
  } catch (error) {
    console.error("Error fetching leads", error);
    return filterLeads(FALLBACK_LEADS, options);
  }
}

function filterLeads(source: LeadsResponse, options: LeadsOptions): LeadsResponse {
  const sectors = options.sectors?.length ? options.sectors : undefined;

  if (!sectors) {
    return source;
  }

  const filtered = source.leads.filter((lead) => sectors.includes(lead.sector));

  return {
    count: filtered.length,
    leads: filtered,
    generatedAt: source.generatedAt,
  };
}

export function summarizeBySector(leads: Lead[]): Array<{ sector: SectorKey; count: number; total: number }> {
  const summary = new Map<SectorKey, { sector: SectorKey; count: number; total: number }>();

  for (const sector of ["Janitorial", "Construction", "Fencing", "Waste", "Other"] as const) {
    summary.set(sector, { sector, count: 0, total: 0 });
  }

  leads.forEach((lead) => {
    const bucket = summary.get(lead.sector) ?? summary.get("Other")!;
    bucket.count += 1;
    bucket.total += lead.amount ?? 0;
  });

  return Array.from(summary.values());
}

export function summarizeByCounty(leads: Lead[]): Array<{ county: string; total: number; intensity: number }> {
  const countyMap = new Map<string, { county: string; total: number; intensity: number }>();

  leads.forEach((lead) => {
    const county = deriveCounty(lead.city);
    const bucket = countyMap.get(county) ?? { county, total: 0, intensity: 0 };
    bucket.total += lead.amount ?? 0;
    bucket.intensity += 1;
    countyMap.set(county, bucket);
  });

  const maxIntensity = Math.max(1, ...Array.from(countyMap.values()).map((item) => item.intensity));

  return Array.from(countyMap.values()).map((item) => ({
    ...item,
    intensity: item.intensity / maxIntensity,
  }));
}

function deriveCounty(city: string): string {
  if (!city) {
    return "Statewide";
  }

  const lookup: Record<string, string> = {
    Raleigh: "Wake County",
    Cary: "Wake County",
    Durham: "Durham County",
    Charlotte: "Mecklenburg County",
    Greensboro: "Guilford County",
    Asheville: "Buncombe County",
    Wilmington: "New Hanover County",
  };

  return lookup[city] ?? `${city} County`;
}

export function formatCurrency(value: number | null): string {
  if (value === null) {
    return "Pending valuation";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getTopLeads(leads: Lead[], limit = 3): Lead[] {
  return leads
    .slice()
    .sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0))
    .slice(0, limit);
}

export function filterLeadsByAward(leads: Lead[], awardId: string): Lead | undefined {
  return leads.find((lead) => lead.awardId === awardId);
}

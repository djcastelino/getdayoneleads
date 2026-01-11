import { fetchLeads } from "@/lib/leads";
import { LeadRadarClient } from "./lead-radar-client";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LeadRadarPage({ searchParams }: PageProps) {
  const initialData = await fetchLeads();
  const { admin } = await searchParams;
  const isAdmin = admin === "true";

  return <LeadRadarClient initialData={initialData} isAdmin={isAdmin} />;
}

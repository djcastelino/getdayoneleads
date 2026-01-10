import { fetchLeads } from "@/lib/leads";
import { LeadRadarClient } from "./lead-radar-client";

export default async function LeadRadarPage() {
  const initialData = await fetchLeads();

  return <LeadRadarClient initialData={initialData} />;
}

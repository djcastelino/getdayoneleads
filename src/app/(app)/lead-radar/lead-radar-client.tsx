"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import useSWR from "swr";
import { loadLeadsAction, logOutreachAction } from "./actions";
import {
  Lead,
  LeadsResponse,
  SectorKey,
  formatCurrency,
  getTopLeads,
  summarizeByCounty,
  summarizeBySector,
} from "@/lib/leads";
import { LeadSummary } from "@/components/lead-summary";
import { TopLeadsTicker } from "@/components/top-leads-ticker";
import { SectorFilters } from "@/components/sector-filters";
import { LeadsGrid } from "@/components/leads-grid";
import { LeadDrawer } from "@/components/lead-drawer";
import { AwardsByTradeChart } from "@/components/insights/awards-by-trade-chart";
import { HotCountyHeatmap } from "@/components/insights/hot-county-heatmap";
import { AlertsSidebar } from "@/components/alerts-sidebar";
import { NotifyFab } from "@/components/notify-fab";

const TRACKED_SECTORS: SectorKey[] = ["Janitorial", "Construction", "Fencing", "Waste"];

interface LeadRadarClientProps {
  initialData: LeadsResponse;
  isAdmin?: boolean;
}

export function LeadRadarClient({ initialData, isAdmin = false }: LeadRadarClientProps) {
  const [selectedSectors, setSelectedSectors] = useState<SectorKey[]>(TRACKED_SECTORS);
  const [optimisticSectors, setOptimisticSectors] = useOptimistic(selectedSectors, (_, next: SectorKey[]) => next);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sectorKey = optimisticSectors.length ? optimisticSectors.sort().join(",") : "all";

  const { data, isLoading, mutate } = useSWR<LeadsResponse>(
    `/api/leads${optimisticSectors.length ? `?sectors=${sectorKey}` : ""}`,
    {
      fallbackData: initialData,
      keepPreviousData: true,
      onError: () => {
        // keep optimistic state if the request fails
        setOptimisticSectors(selectedSectors);
      },
    },
  );

  const leads = data?.leads ?? initialData.leads;

  const sectorSummary = useMemo(() => summarizeBySector(data?.leads ?? initialData.leads), [data, initialData]);
  const countySummary = useMemo(() => summarizeByCounty(leads), [leads]);
  const topLeads = useMemo(() => getTopLeads(leads, 3), [leads]);
  const totalObligation = useMemo(() => leads.reduce((sum, lead) => sum + (lead.amount ?? 0), 0), [leads]);

  const activeLead = useMemo(() => leads.find((lead) => lead.awardId === activeLeadId), [leads, activeLeadId]);

  const handleToggleSector = (sector: SectorKey) => {
    const next = selectedSectors.includes(sector)
      ? selectedSectors.filter((item) => item !== sector)
      : [...selectedSectors, sector];

    setOptimisticSectors(next);
    setSelectedSectors(next);

    startTransition(async () => {
      const latest = await loadLeadsAction({ sectors: next });
      mutate(latest, { revalidate: false });
    });
  };

  const handleOpenLead = (lead: Lead) => {
    setActiveLeadId(lead.awardId);
  };

  const handleCloseDrawer = () => {
    setActiveLeadId(null);
  };

  const handleLogAction = (lead: Lead, action: "intro-email" | "schedule-call" | "share" | "bookmark") => {
    startTransition(async () => {
      await logOutreachAction({ awardId: lead.awardId, action });
    });
  };

  const heroStats = {
    total: data?.count ?? initialData.count,
    updatedAt: data?.generatedAt ?? initialData.generatedAt,
    totalObligation: formatCurrency(totalObligation),
  };

  return (
    <div className="flex flex-col gap-10">
      <section className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:grid-cols-[1.2fr_1fr]" id="hero">
        <LeadSummary
          total={heroStats.total}
          updatedAt={heroStats.updatedAt}
          totalObligation={heroStats.totalObligation}
          isLoading={isLoading || isPending}
        />
        <TopLeadsTicker leads={topLeads} isLoading={isLoading && !topLeads.length} />
      </section>

      <SectorFilters
        options={TRACKED_SECTORS.map((sector) => ({
          label: sector,
          value: sector,
          count: sectorSummary.find((summary) => summary.sector === sector)?.count ?? 0,
        }))}
        selected={optimisticSectors}
        onToggle={handleToggleSector}
        isLoading={isLoading || isPending}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,_1fr)_360px]" id="timeline">
        <LeadsGrid
          leads={leads}
          isAdmin={isAdmin}
          isLoading={isLoading && !leads.length}
          onOpenLead={handleOpenLead}
          onQuickAction={handleLogAction}
        />
        <AlertsSidebar selectedSectors={selectedSectors} />
      </div>

      <section className="grid gap-8 lg:grid-cols-2" id="insights">
        <AwardsByTradeChart data={sectorSummary} />
        <HotCountyHeatmap data={countySummary} />
      </section>

      <LeadDrawer 
        lead={activeLead} 
        open={Boolean(activeLead)} 
        isAdmin={isAdmin}
        onClose={handleCloseDrawer} 
        onAction={handleLogAction} 
      />
      <NotifyFab onFilterToggle={handleToggleSector} selectedSectors={selectedSectors} />
    </div>
  );
}

"use client";

import { Lead } from "@/lib/leads";
import { LeadCard } from "./lead-card";

interface LeadsGridProps {
  leads: Lead[];
  isAdmin?: boolean;
  isLoading?: boolean;
  onOpenLead: (lead: Lead) => void;
  onQuickAction: (lead: Lead, action: "intro-email" | "schedule-call" | "share" | "bookmark") => void;
}

export function LeadsGrid({ leads, isAdmin, isLoading, onOpenLead, onQuickAction }: LeadsGridProps) {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Leads Timeline</h2>
        <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Newest first</span>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {leads.map((lead) => (
          <LeadCard key={lead.awardId} lead={lead} isAdmin={isAdmin} onOpen={onOpenLead} onQuickAction={onQuickAction} />
        ))}
        {isLoading && <SkeletonCards />}
      </div>
      {!leads.length && !isLoading && (
        <div className="rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-10 text-center text-sm text-slate-500 dark:text-slate-300">
          No awards match your filters yet. Try widening your search or check back after the next sync.
        </div>
      )}
    </div>
  );
}

function SkeletonCards() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-56 animate-pulse rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-100 dark:bg-white/5" />
      ))}
    </>
  );
}

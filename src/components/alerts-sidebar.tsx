"use client";

import { useState } from "react";
import { Bell, Flame, ListPlus } from "lucide-react";
import { StripeCheckoutButton } from "./stripe-checkout-button";
import type { SectorKey } from "@/lib/leads";

interface AlertsSidebarProps {
  selectedSectors: SectorKey[];
}

export function AlertsSidebar({ selectedSectors }: AlertsSidebarProps) {
  const [dailyDigest, setDailyDigest] = useState(true);
  const [instantAlerts, setInstantAlerts] = useState(true);

  return (
    <aside className="flex h-fit flex-col gap-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/70 p-6" id="alerts">
      <header className="flex items-center gap-3">
        <div className="rounded-full border border-orange-400/40 bg-orange-50 dark:bg-orange-500/10 p-2 text-orange-600 dark:text-orange-200">
          <Bell size={16} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3rem] text-orange-600 dark:text-orange-300">Alerts & Upgrades</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Stay in the loop</h3>
        </div>
      </header>

      <section className="space-y-4">
        <ToggleRow
          label="Instant push"
          description="Mobile push when a new award hits your filters."
          enabled={instantAlerts}
          onChange={setInstantAlerts}
        />
        <ToggleRow
          label="Daily digest"
          description="Email summary with exportable CSV every morning."
          enabled={dailyDigest}
          onChange={setDailyDigest}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <Flame size={16} className="text-orange-500 dark:text-orange-300" /> Saved searches
        </h4>
        <ul className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-200">
          {selectedSectors.map((sector) => (
            <li key={sector} className="flex items-center justify-between">
              <span>{sector}</span>
              <button type="button" className="text-xs uppercase tracking-wider text-teal-600 dark:text-teal-200">
                Manage
              </button>
            </li>
          ))}
          {!selectedSectors.length && <li className="text-xs text-slate-400">Turn on a sector to save it.</li>}
        </ul>
        <button
          type="button"
          className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-teal-600 dark:text-teal-200"
        >
          <ListPlus size={14} /> Add search
        </button>
      </section>

      <StripeCheckoutButton selectedSectors={selectedSectors} />
    </aside>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (next: boolean) => void;
}

function ToggleRow({ label, description, enabled, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-300">{description}</p>
      </div>
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full border border-slate-200 dark:border-white/10 transition ${
          enabled ? "bg-teal-500/80" : "bg-slate-200 dark:bg-slate-800"
        }`}
        onClick={() => onChange(!enabled)}
        aria-pressed={enabled}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white transition ${enabled ? "translate-x-5" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
}

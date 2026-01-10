"use client";

import { useState } from "react";
import { BellRing, Filter, X } from "lucide-react";
import type { SectorKey } from "@/lib/leads";

interface NotifyFabProps {
  selectedSectors: SectorKey[];
  onFilterToggle: (sector: SectorKey) => void;
}

export function NotifyFab({ selectedSectors, onFilterToggle }: NotifyFabProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 lg:hidden">
      <button
        type="button"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-teal-400 text-slate-950 shadow-xl"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <BellRing size={20} />}
      </button>

      {open && (
        <div className="absolute bottom-16 right-0 w-64 rounded-3xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2rem] text-teal-200">
            <Filter size={14} /> Filters
          </p>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm text-white">
            {selectedSectors.map((sector) => (
              <li key={sector}>
                <button
                  type="button"
                  className="rounded-full border border-teal-400/60 bg-teal-500/10 px-3 py-1 text-xs"
                  onClick={() => onFilterToggle(sector)}
                >
                  {sector}
                </button>
              </li>
            ))}
            {!selectedSectors.length && <li className="text-xs text-slate-400">No sectors selected</li>}
          </ul>
          <button
            type="button"
            className="mt-3 w-full rounded-xl border border-orange-400/60 bg-orange-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-orange-200"
          >
            Notify me
          </button>
        </div>
      )}
    </div>
  );
}

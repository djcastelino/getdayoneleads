"use client";

import { SectorKey } from "@/lib/leads";
import { clsx } from "clsx";

interface SectorOption {
  label: string;
  value: SectorKey;
  count: number;
}

interface SectorFiltersProps {
  options: SectorOption[];
  selected: SectorKey[];
  onToggle: (value: SectorKey) => void;
  isLoading?: boolean;
}

export function SectorFilters({ options, selected, onToggle, isLoading }: SectorFiltersProps) {
  return (
    <div className="sticky top-4 z-20 -mt-4">
      <div className="inline-flex max-w-full flex-wrap gap-2 rounded-full border border-white/10 bg-slate-900/70 px-4 py-3 backdrop-blur">
        {options.map((option) => {
          const isActive = selected.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggle(option.value)}
              className={clsx(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                isActive
                  ? "border-teal-400/80 bg-teal-500/20 text-teal-100 shadow-[0_0_12px_rgba(45,200,190,0.3)]"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-teal-300/50 hover:text-teal-200",
              )}
              disabled={isLoading && !isActive}
            >
              <span>{option.label}</span>
              <span className="rounded-full bg-black/30 px-2 py-0.5 text-xs text-slate-200/80">{option.count}</span>
            </button>
          );
        })}
        <span className="ml-2 text-xs uppercase tracking-wider text-slate-400">
          {isLoading ? "Refreshing" : "Tap to refine"}
        </span>
      </div>
    </div>
  );
}

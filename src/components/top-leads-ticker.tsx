"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Lead } from "@/lib/leads";

interface TopLeadsTickerProps {
  leads: Lead[];
  isLoading?: boolean;
}

export function TopLeadsTicker({ leads, isLoading }: TopLeadsTickerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!leads.length) {
      return;
    }

    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % leads.length);
    }, 4200);

    return () => window.clearInterval(id);
  }, [leads]);

  const activeLead = leads[index];

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/50 p-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3rem] text-orange-600 dark:text-orange-300">Radar Highlights</p>
        <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Top Awards by Value</h2>
      </header>
      <div className="relative mt-6 min-h-[220px]">
        <AnimatePresence mode="wait">
          <motion.article
            key={activeLead?.awardId ?? "placeholder"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 p-6 backdrop-blur"
          >
            {activeLead ? (
              <>
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-800 dark:text-orange-200">
                    {activeLead.naics} · {activeLead.sector}
                  </span>
                  <h3 className="mt-4 line-clamp-2 text-lg font-semibold text-slate-900 dark:text-white">
                    {activeLead.project}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-200/80">
                    {activeLead.agency}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-200/80">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Value</p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">{activeLead.value}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Last Updated</p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      {new Date(activeLead.lastModified).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                {isLoading ? "Scanning awards..." : "No awards yet"}
              </div>
            )}
          </motion.article>
        </AnimatePresence>
      </div>
      <footer className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{leads.length} tracked awards</span>
        <div className="flex gap-1">
          {leads.map((lead, idx) => (
            <button
              key={lead.awardId}
              type="button"
              className={`h-1.5 w-8 rounded-full transition ${idx === index ? "bg-orange-500 dark:bg-orange-400" : "bg-slate-300 dark:bg-white/20"}`}
              onClick={() => setIndex(idx)}
              aria-label={`Show ${lead.project}`}
            />
          ))}
        </div>
      </footer>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse rounded-3xl bg-slate-200/50 dark:bg-slate-950/20" aria-hidden />
      )}
    </div>
  );
}

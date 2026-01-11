"use client";

import { useCallback } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import { MailPlus, Share2, Star } from "lucide-react";
import type { Lead } from "@/lib/leads";

interface LeadCardProps {
  lead: Lead;
  isAdmin?: boolean;
  onOpen: (lead: Lead) => void;
  onQuickAction: (lead: Lead, action: "intro-email" | "schedule-call" | "share" | "bookmark") => void;
}

export function LeadCard({ lead, isAdmin, onOpen, onQuickAction }: LeadCardProps) {
  const handleAction = useCallback(
    (action: "intro-email" | "schedule-call" | "share" | "bookmark") => {
      onQuickAction(lead, action);
    },
    [lead, onQuickAction],
  );

  return (
    <HoverCard.Root openDelay={120} closeDelay={80}>
      <HoverCard.Trigger asChild>
        <article
          className="group flex h-full cursor-pointer flex-col justify-between rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/70 p-6 text-left transition hover:border-teal-500/50 dark:hover:border-teal-400/40 hover:bg-slate-50 dark:hover:bg-slate-900/90 shadow-sm dark:shadow-none"
          onClick={() => onOpen(lead)}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`rounded-full border border-slate-200 dark:border-slate-600 px-3 py-1 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300 ${!isAdmin ? 'blur-sm select-none' : ''}`}>
                {isAdmin ? lead.awardId : '#####-##'}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-200">
                {lead.city}
              </span>
            </div>
            <h3 className="line-clamp-3 text-lg font-semibold text-slate-900 dark:text-white drop-shadow-sm">
              {lead.project}
            </h3>
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-500">Award Value</p>
                <p className="text-base font-semibold text-teal-600 dark:text-teal-100">{lead.value}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-500">Agency</p>
                <div className="relative">
                  <p className={`max-w-[140px] overflow-hidden text-ellipsis text-sm text-slate-700 dark:text-white/80 ${!isAdmin ? 'blur-[2px] select-none' : ''}`}>
                     {lead.agency}
                  </p>
                  {!isAdmin && (
                    <p className="absolute inset-0 flex items-center justify-end text-[10px] font-semibold text-slate-400 dark:text-slate-500/80">
                       LOCKED
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-6 flex items-center justify-between text-xs text-slate-400 dark:text-slate-400">
            <span>Updated {new Date(lead.lastModified).toLocaleDateString()}</span>
            <menu className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1 text-xs text-slate-600 dark:text-slate-200 transition hover:border-orange-400/50 hover:bg-orange-50 dark:hover:bg-orange-500/20 hover:text-orange-600 dark:hover:text-orange-200"
                onClick={(event) => {
                  event.stopPropagation();
                  handleAction("intro-email");
                }}
              >
                <MailPlus size={14} /> Email PDF
              </button>
              <button
                type="button"
                className="flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1 text-xs text-slate-600 dark:text-slate-200 transition hover:border-teal-400/50 hover:bg-teal-50 dark:hover:bg-teal-500/20 hover:text-teal-600 dark:hover:text-teal-100"
                onClick={(event) => {
                  event.stopPropagation();
                  handleAction("share");
                }}
              >
                <Share2 size={14} /> Share
              </button>
              <button
                type="button"
                className="flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1 text-xs text-slate-600 dark:text-slate-200 transition hover:border-orange-300/50 hover:bg-orange-50 dark:hover:bg-orange-500/20 hover:text-orange-600 dark:hover:text-orange-200"
                onClick={(event) => {
                  event.stopPropagation();
                  handleAction("bookmark");
                }}
              >
                <Star size={14} /> Bookmark
              </button>
            </menu>
          </footer>
        </article>
      </HoverCard.Trigger>
      <HoverCard.Content
        className="w-80 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/90 p-4 text-sm text-slate-600 dark:text-slate-200 shadow-xl dark:shadow-2xl"
        sideOffset={16}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400 dark:text-slate-400">
            <span>Tags</span>
            <span>{lead.naics}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[lead.sector, lead.naics].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2 py-0.5 text-xs text-slate-500 dark:text-slate-100">
                {tag}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-400">Timeline</p>
            <ol className="flex flex-col gap-2">
              {lead.timeline.map((milestone) => (
                <li key={milestone.label} className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      milestone.status === "past"
                        ? "bg-slate-300 dark:bg-slate-500"
                        : milestone.status === "current"
                          ? "bg-orange-400 dark:bg-orange-300"
                          : "bg-teal-400 dark:bg-teal-300"
                    }`}
                  />
                  <div className="flex flex-1 items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>{milestone.label}</span>
                    <span>{new Date(milestone.date).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}

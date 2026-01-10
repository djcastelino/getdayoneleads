"use client";

import { useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Calendar, CheckCircle2, MailPlus, Phone, X } from "lucide-react";
import type { Lead } from "@/lib/leads";

interface LeadDrawerProps {
  lead?: Lead;
  open: boolean;
  onClose: () => void;
  onAction?: (lead: Lead, action: "intro-email" | "schedule-call" | "share" | "bookmark") => void;
}

export function LeadDrawer({ lead, open, onClose, onAction }: LeadDrawerProps) {
  const checklist = useMemo(
    () => [
      { label: "Call PM", action: "schedule-call" as const },
      { label: "Send intro deck", action: "intro-email" as const },
      { label: "Bookmark for follow-up", action: "bookmark" as const },
    ],
    [],
  );

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/95 p-8 shadow-2xl transition-colors duration-200">
          <div className="flex items-start justify-between">
            <div>
              <Dialog.Title className="text-sm uppercase tracking-[0.35rem] text-teal-600 dark:text-teal-300">
                Lead Detail
              </Dialog.Title>
              <Dialog.Description className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">
                {lead?.project ?? "Select a lead"}
              </Dialog.Description>
            </div>
            <button
              type="button"
              className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2 text-slate-500 dark:text-slate-200 transition hover:border-teal-400/60 hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-200"
              onClick={onClose}
              aria-label="Close lead detail"
            >
              <X size={16} />
            </button>
          </div>

          {lead ? (
            <div className="mt-8 space-y-8 text-sm text-slate-600 dark:text-slate-200">
              <section className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    {lead.awardId}
                  </span>
                  <span className="rounded-full border border-teal-500/30 dark:border-teal-400/50 bg-teal-50 dark:bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-700 dark:text-teal-200">
                    {lead.sector}
                  </span>
                  <span className="rounded-full border border-orange-400/50 dark:border-orange-400/50 bg-orange-50 dark:bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-700 dark:text-orange-200">
                    {lead.city}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-200/80">{lead.project}</p>
                <dl className="grid grid-cols-2 gap-4 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <div>
                    <dt className="text-slate-500 dark:text-slate-400">Value</dt>
                    <dd className="text-lg font-semibold text-slate-900 dark:text-white">{lead.value}</dd>
                  </div>
                  <div>
                    <dt>Agency</dt>
                    <dd className="text-sm text-slate-700 dark:text-slate-200">{lead.agency}</dd>
                  </div>
                  <div>
                    <dt>Recipient</dt>
                    <dd className="text-sm text-slate-700 dark:text-slate-200">{lead.winner}</dd>
                  </div>
                  <div>
                    <dt>Last Updated</dt>
                    <dd className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                      <Calendar size={14} />
                      {new Date(lead.lastModified).toLocaleString()}
                    </dd>
                  </div>
                </dl>

                {lead.contactName && (
                  <div className="mt-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4">
                    <p className="mb-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Prime Contractor POC</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{lead.contactName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{lead.winner}</p>
                        <div className="mt-1 flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300">
                          {lead.contactEmail && (
                            <span className="flex items-center gap-1.5">
                              <MailPlus size={12} className="text-teal-500" />
                              {lead.contactEmail}
                            </span>
                          )}
                          {lead.contactPhone && (
                            <span className="flex items-center gap-1.5">
                              <Phone size={12} className="text-teal-500" />
                              {lead.contactPhone}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                         type="button"
                         className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-white shadow-lg transition hover:bg-teal-400"
                         title="Call Now"
                      >
                         <Phone size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <h3 className="text-xs uppercase tracking-[0.2rem] text-slate-500 dark:text-slate-400">What&apos;s next</h3>
                <ul className="space-y-3 text-sm">
                  {checklist.map((item) => (
                    <li key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-3">
                      <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                        <CheckCircle2 size={16} className="text-teal-500 dark:text-teal-300" />
                        {item.label}
                      </span>
                      <button
                        type="button"
                        className="rounded-full border border-teal-500/30 dark:border-teal-400/60 bg-teal-50 dark:bg-teal-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-100 transition hover:bg-teal-100 dark:hover:bg-teal-500/20"
                        onClick={() => onAction?.(lead, item.action)}
                      >
                        Complete
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2rem] text-slate-500 dark:text-slate-400">Outreach</h3>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-400 px-4 py-3 text-sm font-semibold text-white dark:text-slate-950 shadow-lg transition hover:brightness-105"
                    onClick={() => onAction?.(lead, "intro-email")}
                  >
                    <MailPlus size={16} /> Launch Intro Email
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-white transition hover:border-orange-400/60 hover:bg-orange-50 dark:hover:bg-orange-500/10"
                    onClick={() => onAction?.(lead, "schedule-call")}
                  >
                    <Phone size={16} /> Schedule Call
                  </button>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-xs uppercase tracking-[0.2rem] text-slate-400">Timeline</h3>
                <ol className="space-y-3">
                  {lead.timeline.map((milestone) => (
                    <li key={milestone.label} className="flex items-start gap-3">
                      <span
                        className={`mt-1 h-2.5 w-2.5 rounded-full ${
                          milestone.status === "past"
                            ? "bg-slate-500"
                            : milestone.status === "current"
                              ? "bg-orange-300"
                              : "bg-teal-300"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-white">{milestone.label}</p>
                        <p className="text-xs text-slate-400">{new Date(milestone.date).toLocaleString()}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          ) : (
            <div className="mt-20 text-center text-sm text-slate-400">Select a lead card to see details.</div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

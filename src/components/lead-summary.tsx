import { clsx } from "clsx";

interface LeadSummaryProps {
  total: number;
  updatedAt: string;
  totalObligation: string;
  isLoading?: boolean;
}

export function LeadSummary({ total, updatedAt, totalObligation, isLoading }: LeadSummaryProps) {
  const formattedUpdate = formatRelative(updatedAt);

  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <div>
        <p className="text-sm uppercase tracking-[0.4rem] text-teal-600 dark:text-teal-300">Day-One Leads Today</p>
        <div className="mt-4 flex items-end gap-6">
          <span className={clsx("text-6xl font-semibold text-slate-900 dark:text-white drop-shadow-sm transition", isLoading && "animate-pulse opacity-60")}>
            {total}
          </span>
          <div className="rounded-full border border-teal-500/40 bg-teal-500/10 px-4 py-1 text-xs font-medium text-teal-700 dark:text-teal-200">
            Updated {formattedUpdate}
          </div>
        </div>
        <p className="mt-4 max-w-md text-sm text-slate-600 dark:text-slate-200/80">
          Fresh contracts sourced from USAspending within the last 24 hours. Toggle sectors to hone in on the trades that matter most to your crews.
        </p>
      </div>
      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4">
          <dt className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-300">Total Pipeline Value</dt>
          <dd className={clsx("mt-2 text-2xl font-semibold text-slate-900 dark:text-white", isLoading && "animate-pulse opacity-70")}>{totalObligation}</dd>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4">
          <dt className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-300">Alerts Active</dt>
          <dd className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Instant + Daily</dd>
        </div>
      </dl>
    </div>
  );
}

function formatRelative(timestamp: string): string {
  const date = new Date(timestamp);
  const now = Date.now();
  const diffMs = date.getTime() - now;
  const diffMinutes = Math.round(diffMs / (60 * 1000));

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  return formatter.format(diffDays, "day");
}

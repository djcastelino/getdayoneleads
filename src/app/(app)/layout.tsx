import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(45,_160,_200,_0.15),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(45,_160,_200,_0.25),_transparent_60%)]" />
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 pb-4 pt-10 sm:px-10 lg:px-16">
        <div>
          <p className="text-sm uppercase tracking-[0.25rem] text-teal-600 dark:text-teal-400">Lead Radar</p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 md:text-4xl">GetDayOneLeads</h1>
        </div>
        <nav className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
          <a className="rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 transition hover:border-teal-500 hover:text-teal-600 dark:hover:border-teal-400 dark:hover:text-teal-200" href="#timeline">
            Timeline
          </a>
          <a className="rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 transition hover:border-teal-500 hover:text-teal-600 dark:hover:border-teal-400 dark:hover:text-teal-200" href="#insights">
            Insights
          </a>
          <a className="rounded-full border border-teal-500 dark:border-teal-400 bg-teal-50 dark:bg-teal-500/10 px-3 py-1 font-medium text-teal-700 dark:text-teal-200 transition hover:bg-teal-100 dark:hover:bg-teal-500/20" href="#alerts">
            Alerts
          </a>
        </nav>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-32 sm:px-10 lg:px-16">{children}</main>
    </div>
  );
}

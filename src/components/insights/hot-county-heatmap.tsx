"use client";

interface CountyDatum {
  county: string;
  total: number;
  intensity: number;
}

interface HotCountyHeatmapProps {
  data: CountyDatum[];
}

export function HotCountyHeatmap({ data }: HotCountyHeatmapProps) {
  const sorted = data
    .slice()
    .sort((a, b) => b.total - a.total)
    .slice(0, 9);

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/70 p-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3rem] text-orange-600 dark:text-orange-300">Hot Counties</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">Where activity is heating up</h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">Normalized intensity</span>
      </header>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {sorted.map((county) => (
          <div
            key={county.county}
            className="rounded-2xl border border-white/5 p-3 text-sm text-white shadow-sm"
            style={{
              background: `linear-gradient(135deg, rgba(249, 115, 22, ${Math.max(0.4, county.intensity)}) 0%, rgba(30, 41, 59, 0.9) 100%)`,
            }}
          >
            <p className="text-xs uppercase tracking-wide text-white/90">{county.county}</p>
            <p className="mt-2 text-lg font-semibold">${formatCompact(county.total)}</p>
          </div>
        ))}
        {!sorted.length && (
          <div className="col-span-3 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            County breakdown will appear once we see new awards today.
          </div>
        )}
      </div>
    </section>
  );
}

function formatCompact(value: number): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

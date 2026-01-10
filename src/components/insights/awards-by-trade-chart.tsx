"use client";

import { SectorKey } from "@/lib/leads";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface TradeDatum {
  sector: SectorKey;
  count: number;
  total: number;
}

interface AwardsByTradeChartProps {
  data: TradeDatum[];
}

export function AwardsByTradeChart({ data }: AwardsByTradeChartProps) {
  const chartData = data.map((entry) => ({
    sector: entry.sector,
    awards: entry.count,
    total: Math.round(entry.total),
  }));

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/70 p-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3rem] text-teal-600 dark:text-teal-300">Awards by Trade</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">Where contracts are landing</h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">Past 24 hours</span>
      </header>
      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 24, left: 0, bottom: 10 }}>
            <defs>
              <linearGradient id="tradeGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700/50" />
            <XAxis dataKey="sector" stroke="#94a3b8" tickLine={false} axisLine={{ stroke: "transparent" }} />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={{ stroke: "transparent" }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(14, 165, 233, 0.1)" }} />
            <Bar dataKey="awards" fill="url(#tradeGradient)" radius={[12, 12, 12, 12]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 p-4 shadow-xl">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
        <p className="text-sm text-teal-600 dark:text-teal-400">
          {payload[0].value} Awards
        </p>
      </div>
    );
  }
  return null;
};

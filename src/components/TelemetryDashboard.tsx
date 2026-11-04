import React from "react";
import type { Link, ClickEvent } from "../types";
import { Activity, Clock, Zap, CheckCircle2, ShieldCheck, ArrowUpRight, BarChart2 } from "lucide-react";

interface TelemetryDashboardProps {
  links: Link[];
  clicks: ClickEvent[];
  onVisit: (code: string) => void;
}

export const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({
  links,
  clicks,
  onVisit,
}) => {
  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const totalLinks = links.length;
  const unfurledLinks = links.filter((l) => l.preview?.title).length;

  // Sort links by clicks descending
  const sortedLinks = [...links].sort((a, b) => b.clicks - a.clicks);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top telemetry banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-lime-300/10 border border-lime-300/20 text-lime-300">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-stone-100 flex items-center gap-2">
              Axiom Telemetry & Distributed State
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-lime-400/10 text-lime-300 border border-lime-300/20">
                ACTIVE
              </span>
            </h2>
            <p className="text-xs text-stone-400 font-mono">
              Dataset: shorty-prod-traces · Cloudflare Durable Objects + Queues
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
          <span className="flex h-2 w-2 rounded-full bg-lime-400 animate-ping" />
          <span>Ingest rate: 100% healthy</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between text-stone-400 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Total Clicks</span>
            <Zap className="w-4 h-4 text-lime-300" />
          </div>
          <p className="text-3xl font-mono font-bold text-stone-50 tabular-nums">
            {totalClicks.toLocaleString()}
          </p>
          <p className="text-xs text-stone-500 mt-1">Across {totalLinks} short links</p>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between text-stone-400 text-xs font-mono uppercase tracking-wider mb-2">
            <span>p95 Latency</span>
            <Clock className="w-4 h-4 text-lime-300" />
          </div>
          <p className="text-3xl font-mono font-bold text-stone-50 tabular-nums">
            14.2<span className="text-lg font-normal text-stone-400 ml-1">ms</span>
          </p>
          <p className="text-xs text-stone-500 mt-1">Edge Worker execution</p>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between text-stone-400 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Metadata Cache</span>
            <CheckCircle2 className="w-4 h-4 text-lime-300" />
          </div>
          <p className="text-3xl font-mono font-bold text-stone-50 tabular-nums">
            {totalLinks > 0 ? Math.round((unfurledLinks / totalLinks) * 100) : 100}%
          </p>
          <p className="text-xs text-stone-500 mt-1">{unfurledLinks} of {totalLinks} unfurled</p>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between text-stone-400 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Error Rate</span>
            <ShieldCheck className="w-4 h-4 text-lime-300" />
          </div>
          <p className="text-3xl font-mono font-bold text-stone-50 tabular-nums">
            0.00%
          </p>
          <p className="text-xs text-stone-500 mt-1">Zero dropped redirects</p>
        </div>
      </div>

      {/* Grid: Route Breakdown & Clicks by Link */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route distribution */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h3 className="font-serif text-xl font-semibold text-stone-100 mb-1">
            Requests by Route
          </h3>
          <p className="text-xs text-stone-400 font-mono mb-4">
            apl: dataset | summarize count() by attributes.http.route
          </p>

          <div className="space-y-3">
            {[
              { route: "GET /:code (Redirect)", pct: 64, count: totalClicks, latency: "8ms" },
              { route: "GET /links (List)", pct: 21, count: Math.round(totalClicks * 0.35) + 12, latency: "14ms" },
              { route: "POST /links (Create)", pct: 10, count: totalLinks, latency: "28ms" },
              { route: "WS /links/:code/live", pct: 5, count: totalLinks * 2, latency: "2ms" },
            ].map((r) => (
              <div key={r.route} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-stone-300">{r.route}</span>
                  <span className="text-stone-400">{r.count} reqs ({r.latency})</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-lime-300"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top links ranking */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h3 className="font-serif text-xl font-semibold text-stone-100 mb-1">
            Clicks by Link
          </h3>
          <p className="text-xs text-stone-400 font-mono mb-4">
            apl: dataset | where name == 'clicks.record' | order by clicks desc
          </p>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {sortedLinks.map((l, i) => (
              <div
                key={l.code}
                onClick={() => onVisit(l.code)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-colors cursor-pointer group"
              >
                <div className="min-w-0 flex items-center gap-2">
                  <span className="font-mono text-xs text-stone-500 w-4">{i + 1}.</span>
                  <span className="font-mono text-xs text-lime-300 group-hover:underline">
                    /{l.code}
                  </span>
                  <span className="text-xs text-stone-400 truncate max-w-[140px] sm:max-w-[200px]">
                    {l.preview?.title ?? l.url}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-stone-100 tabular-nums">
                    {l.clicks}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-lime-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Activity Stream */}
      <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-xl font-semibold text-stone-100">
              Live Click & Ingestion Stream
            </h3>
            <p className="text-xs text-stone-400 font-mono">
              Transactional updates pushed via Durable Object storage
            </p>
          </div>
          <span className="text-xs font-mono text-lime-300 px-2 py-1 rounded bg-lime-300/10 border border-lime-300/20">
            {clicks.length} recent events
          </span>
        </div>

        {clicks.length === 0 ? (
          <div className="p-8 text-center text-stone-500 border border-dashed border-white/10 rounded-xl font-mono text-xs">
            No live click events logged yet. Use "Simulate Click" or click a short link to see real-time events.
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-xs">
            {clicks.slice(0, 12).map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-black/30 border border-white/5 text-stone-300"
              >
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                  <span className="text-lime-300">/{ev.code}</span>
                  <span className="text-stone-500 truncate max-w-[220px]">{ev.url}</span>
                </div>
                <div className="flex items-center gap-4 text-stone-400 shrink-0">
                  <span className="text-stone-500 hidden sm:inline">{ev.referrer}</span>
                  <span>{new Date(ev.at).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

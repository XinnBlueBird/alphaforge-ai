"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

type Market = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  market_cap: number;
  volume_24h: number;
  change_24h: number;
  change_7d: number;
  sparkline: number[];
};

const FALLBACK: Market[] = [];

export default function MarketTicker() {
  const [data, setData] = useState<Market[]>(FALLBACK);
  const [updated, setUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/market", { cache: "no-store" });
        const j = await res.json();
        if (!alive) return;
        if (j.ok && Array.isArray(j.data)) {
          setData(j.data);
          setUpdated(j.fetched_at);
          setError(null);
        } else {
          setError(j.error || "Unable to load market data");
        }
      } catch (e) {
        if (alive) setError(String(e));
      }
    }
    load();
    const id = setInterval(load, 30000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  return (
    <section id="market" className="relative mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 mb-3 font-medium">
            Live Market
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
            What the agents are{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-300 bg-clip-text text-transparent">
              watching now.
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          {updated ? `Updated ${new Date(updated).toLocaleTimeString()}` : "Connecting…"}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-200">
          Market feed degraded: {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 backdrop-blur">
        <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
          <div className="col-span-4">Asset</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-right">24h</div>
          <div className="col-span-2 text-right">7d</div>
          <div className="col-span-2">Trend</div>
        </div>
        <div className="divide-y divide-zinc-800/70">
          {data.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-zinc-500">
              Loading live market data…
            </div>
          )}
          {data.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-12 gap-2 items-center px-5 py-3 hover:bg-zinc-900/40 transition"
            >
              <div className="col-span-4 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.image} alt={m.symbol} className="h-6 w-6 rounded-full" />
                <div>
                  <div className="text-sm font-medium text-zinc-100">{m.symbol}</div>
                  <div className="text-xs text-zinc-500">{m.name}</div>
                </div>
              </div>
              <div className="col-span-2 text-right font-mono text-sm text-zinc-100">
                ${fmtPrice(m.price)}
              </div>
              <Change col={2} v={m.change_24h} />
              <Change col={2} v={m.change_7d} />
              <div className="col-span-2">
                <Sparkline points={m.sparkline} positive={(m.change_7d ?? 0) >= 0} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Change({ v, col }: { v: number; col: number }) {
  const positive = (v ?? 0) >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <div className={`col-span-${col} text-right`}>
      <span
        className={`inline-flex items-center gap-1 font-mono text-sm ${
          positive ? "text-emerald-400" : "text-rose-400"
        }`}
      >
        <Icon className="h-3 w-3" /> {v?.toFixed(2) ?? "—"}%
      </span>
    </div>
  );
}

function Sparkline({ points, positive }: { points: number[]; positive: boolean }) {
  if (!points || points.length < 2) return <div className="h-8" />;
  const w = 100, h = 28;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(2)},${(h - ((p - min) / range) * h).toFixed(2)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-full">
      <path d={d} fill="none" stroke={positive ? "#34d399" : "#fb7185"} strokeWidth={1.5} />
    </svg>
  );
}

function fmtPrice(n: number) {
  if (n == null) return "—";
  if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (n >= 1) return n.toFixed(2);
  if (n >= 0.01) return n.toFixed(4);
  return n.toFixed(8);
}

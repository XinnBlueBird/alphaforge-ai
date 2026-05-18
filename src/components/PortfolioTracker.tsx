/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Briefcase, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type Position = { symbol: string; amount: number; avg_price: number };
type MarketRow = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change_24h?: number;
};

const STORAGE_KEY = "af_portfolio_v1";

const PIE_COLORS = ["#e879f9", "#22d3ee", "#34d399", "#fbbf24", "#fb7185", "#a78bfa", "#f472b6", "#60a5fa"];

export default function PortfolioTracker() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [market, setMarket] = useState<MarketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Position>({ symbol: "", amount: 0, avg_price: 0 });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPositions(JSON.parse(raw));
    } catch {}
    void loadMarket();
  }, []);

  function persist(next: Position[]) {
    setPositions(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }

  async function loadMarket() {
    setLoading(true);
    try {
      const r = await fetch("/api/market?ids=bitcoin,ethereum,solana,arbitrum,optimism,jupiter-exchange-solana,dogecoin,pepe,dogwifcoin,bonk,chainlink,avalanche-2,sui,injective-protocol,aptos,near,the-open-network,ripple,cardano,binancecoin");
      const j = await r.json();
      if (j.ok) setMarket(j.data || []);
    } finally {
      setLoading(false);
    }
  }

  const priceMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const row of market) m.set(row.symbol.toUpperCase(), row.price);
    return m;
  }, [market]);

  const enriched = useMemo(() => {
    return positions.map((p) => {
      const cur = priceMap.get(p.symbol.toUpperCase()) ?? 0;
      const value = cur * p.amount;
      const cost = p.avg_price * p.amount;
      const pnl = value - cost;
      const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
      return { ...p, current_price: cur, value, pnl, pnlPct };
    });
  }, [positions, priceMap]);

  const totals = useMemo(() => {
    const value = enriched.reduce((a, p) => a + p.value, 0);
    const cost = enriched.reduce((a, p) => a + p.avg_price * p.amount, 0);
    const pnl = value - cost;
    const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
    return { value, cost, pnl, pnlPct };
  }, [enriched]);

  const pieData = useMemo(
    () => enriched.filter((p) => p.value > 0).map((p) => ({ name: p.symbol, value: p.value })),
    [enriched],
  );

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.symbol.trim() || form.amount <= 0) return;
    const symbol = form.symbol.trim().toUpperCase();
    const next = [
      ...positions.filter((p) => p.symbol.toUpperCase() !== symbol),
      { symbol, amount: form.amount, avg_price: form.avg_price },
    ];
    persist(next);
    setForm({ symbol: "", amount: 0, avg_price: 0 });
  }

  function remove(symbol: string) {
    persist(positions.filter((p) => p.symbol.toUpperCase() !== symbol.toUpperCase()));
  }

  return (
    <section className="space-y-6">
      {/* Totals */}
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard
          label="Total Value"
          value={`$${totals.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          tone="cyan"
          icon={<Briefcase className="h-4 w-4" />}
        />
        <SummaryCard
          label="Total P&L"
          value={`${totals.pnl >= 0 ? "+" : ""}$${totals.pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          tone={totals.pnl >= 0 ? "emerald" : "rose"}
          icon={totals.pnl >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        />
        <SummaryCard
          label="Return"
          value={`${totals.pnlPct >= 0 ? "+" : ""}${totals.pnlPct.toFixed(2)}%`}
          tone={totals.pnlPct >= 0 ? "emerald" : "rose"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Table + form */}
        <div className="space-y-4">
          <form
            onSubmit={add}
            className="grid grid-cols-2 gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 sm:grid-cols-4"
          >
            <div className="col-span-2 sm:col-span-1">
              <Label>Symbol</Label>
              <input
                value={form.symbol}
                onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
                placeholder="BTC"
                className="mt-1.5 w-full rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm font-mono text-zinc-100 focus:border-cyan-500/60 focus:outline-none"
              />
            </div>
            <div>
              <Label>Amount</Label>
              <input
                type="number"
                step="any"
                value={form.amount || ""}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                placeholder="0.5"
                className="mt-1.5 w-full rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm font-mono text-zinc-100 focus:border-cyan-500/60 focus:outline-none"
              />
            </div>
            <div>
              <Label>Avg Price</Label>
              <input
                type="number"
                step="any"
                value={form.avg_price || ""}
                onChange={(e) => setForm({ ...form, avg_price: Number(e.target.value) })}
                placeholder="50000"
                className="mt-1.5 w-full rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm font-mono text-zinc-100 focus:border-cyan-500/60 focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-400"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
          </form>

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60">
            {loading ? (
              <div className="flex items-center justify-center gap-2 p-10 text-sm text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading prices…
              </div>
            ) : enriched.length === 0 ? (
              <div className="p-10 text-center text-sm text-zinc-500">
                No positions yet. Add one above to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/40 text-[10px] uppercase tracking-wider text-zinc-500">
                      <th className="px-4 py-2.5 text-left font-medium">Symbol</th>
                      <th className="px-4 py-2.5 text-right font-medium">Amount</th>
                      <th className="px-4 py-2.5 text-right font-medium">Avg Price</th>
                      <th className="px-4 py-2.5 text-right font-medium">Current</th>
                      <th className="px-4 py-2.5 text-right font-medium">P&L %</th>
                      <th className="px-4 py-2.5 text-right font-medium">P&L $</th>
                      <th className="px-4 py-2.5 text-right font-medium">Value</th>
                      <th className="px-4 py-2.5 text-right font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence initial={false}>
                      {enriched.map((p) => (
                        <motion.tr
                          key={p.symbol}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-zinc-900 last:border-b-0"
                        >
                          <td className="px-4 py-3 font-mono text-zinc-100">{p.symbol}</td>
                          <td className="px-4 py-3 text-right font-mono text-zinc-300">{p.amount}</td>
                          <td className="px-4 py-3 text-right font-mono text-zinc-300">${p.avg_price.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-mono text-zinc-200">
                            {p.current_price ? `$${p.current_price.toLocaleString()}` : "—"}
                          </td>
                          <td className={`px-4 py-3 text-right font-mono ${p.pnlPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {p.pnlPct >= 0 ? "+" : ""}{p.pnlPct.toFixed(2)}%
                          </td>
                          <td className={`px-4 py-3 text-right font-mono ${p.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {p.pnl >= 0 ? "+" : ""}${p.pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-zinc-100">
                            ${p.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => remove(p.symbol)}
                              className="rounded-md border border-zinc-800 bg-zinc-900/60 p-1.5 text-zinc-500 transition hover:border-rose-500/40 hover:text-rose-400"
                              aria-label="Remove"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Allocation pie */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="text-xs uppercase tracking-wider text-zinc-400 mb-3">Allocation</div>
          {pieData.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-zinc-500">
              No data yet
            </div>
          ) : (
            <>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={2}
                      stroke="#09090b"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#09090b", border: "1px solid #3f3f46", fontSize: 12 }}
                      formatter={(v: any) => `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 space-y-1.5">
                {pieData.map((d, i) => {
                  const pct = totals.value > 0 ? (d.value / totals.value) * 100 : 0;
                  return (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-sm"
                          style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                        />
                        <span className="font-mono text-zinc-300">{d.name}</span>
                      </div>
                      <span className="font-mono text-zinc-500">{pct.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{children}</div>;
}

function SummaryCard({
  label, value, tone, icon,
}: {
  label: string;
  value: string;
  tone: "cyan" | "emerald" | "rose";
  icon?: React.ReactNode;
}) {
  const color =
    tone === "emerald" ? "text-emerald-400" :
    tone === "rose" ? "text-rose-400" :
    "text-cyan-400";
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
        {icon}{label}
      </div>
      <div className={`mt-2 font-mono text-2xl ${color}`}>{value}</div>
    </div>
  );
}

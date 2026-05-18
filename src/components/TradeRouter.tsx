/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Route, Loader2, Zap, Fuel, Clock, TrendingUp } from "lucide-react";

const CHAINS = [
  { id: "ethereum", label: "Ethereum", color: "text-zinc-300" },
  { id: "base", label: "Base", color: "text-blue-400" },
  { id: "solana", label: "Solana", color: "text-emerald-400" },
  { id: "arbitrum", label: "Arbitrum", color: "text-cyan-400" },
];

const SAMPLES = [
  { from: "USDC", to: "WETH", amount: 1000, chain: "ethereum" },
  { from: "ETH", to: "AERO", amount: 0.5, chain: "base" },
  { from: "SOL", to: "JUP", amount: 25, chain: "solana" },
];

export default function TradeRouter() {
  const [from, setFrom] = useState("USDC");
  const [to, setTo] = useState("WETH");
  const [amount, setAmount] = useState(1000);
  const [chain, setChain] = useState("ethereum");
  const [slippage, setSlippage] = useState(50);
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState<any>(null);
  const [err, setErr] = useState("");

  async function simulate(opts?: { from?: string; to?: string; amount?: number; chain?: string }) {
    const payload = {
      from_token: opts?.from ?? from,
      to_token: opts?.to ?? to,
      amount: opts?.amount ?? amount,
      chain: opts?.chain ?? chain,
      slippage_bps: slippage,
    };
    setLoading(true);
    setErr("");
    setRoute(null);
    try {
      const r = await fetch("/api/route-trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!j.ok) {
        setErr(j.error ?? "Simulation failed");
        return;
      }
      setRoute(j);
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">
          <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
            <div className="mb-2 text-[10px] uppercase tracking-widest text-zinc-500">From</div>
            <div className="flex items-center gap-3">
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value.toUpperCase())}
                className="w-24 bg-transparent text-2xl font-medium text-white outline-none"
              />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="flex-1 bg-transparent text-right text-2xl font-mono text-white outline-none"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="rounded-full border border-zinc-800 bg-black p-2">
              <ArrowDown className="h-4 w-4 text-fuchsia-400" />
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
            <div className="mb-2 text-[10px] uppercase tracking-widest text-zinc-500">To</div>
            <div className="flex items-center gap-3">
              <input
                value={to}
                onChange={(e) => setTo(e.target.value.toUpperCase())}
                className="w-24 bg-transparent text-2xl font-medium text-white outline-none"
              />
              <div className="flex-1 text-right font-mono text-lg text-zinc-500">
                {route?.estimated_out ?? "—"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-zinc-500">
                Chain
              </label>
              <select
                value={chain}
                onChange={(e) => setChain(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/50"
              >
                {CHAINS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-zinc-500">
                Slippage (bps)
              </label>
              <input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(Number(e.target.value))}
                className="w-full rounded-md border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/50"
              />
            </div>
          </div>

          <button
            onClick={() => simulate()}
            disabled={loading || !from || !to || amount <= 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-fuchsia-500 px-4 py-2.5 text-sm font-medium text-black hover:bg-fuchsia-400 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Route className="h-4 w-4" />}
            {loading ? "Simulating route..." : "Simulate trade route"}
          </button>

          <div className="flex flex-wrap gap-2 pt-1">
            {SAMPLES.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setFrom(s.from);
                  setTo(s.to);
                  setAmount(s.amount);
                  setChain(s.chain);
                  void simulate(s);
                }}
                className="rounded-md border border-zinc-800 bg-black/40 px-2 py-1 text-[11px] text-zinc-400 hover:border-fuchsia-500/40 hover:text-fuchsia-300"
              >
                {s.amount} {s.from} → {s.to}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Route output
            </div>
            {route?.best_dex && (
              <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                best · {route.best_dex}
              </span>
            )}
          </div>

          {err && (
            <div className="rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-300">
              {err}
            </div>
          )}

          {!route && !err && (
            <div className="py-12 text-center text-xs text-zinc-600">
              Run a simulation to see route, gas, and impact.
            </div>
          )}

          {route && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Stat icon={TrendingUp} label="Est. out" value={`${route.estimated_out} ${to}`} />
                <Stat
                  icon={Zap}
                  label="Price impact"
                  value={`${route.price_impact_pct?.toFixed(2)}%`}
                  tone={route.price_impact_pct > 1 ? "warn" : "ok"}
                />
                <Stat icon={Fuel} label="Gas" value={`${route.gas_native} ${route.gas_token}`} />
                <Stat icon={Clock} label="Exec ETA" value={`${route.eta_seconds}s`} />
              </div>

              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  Hops
                </div>
                <div className="space-y-1.5">
                  {route.hops?.map((h: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between rounded-md border border-zinc-800 bg-black/40 px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-zinc-500">{i + 1}</span>
                        <span className="text-white">{h.dex}</span>
                      </div>
                      <span className="font-mono text-zinc-400">
                        {h.in} → {h.out}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  Quotes (all DEXs)
                </div>
                <div className="space-y-1">
                  {route.quotes?.map((q: any, i: number) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between rounded-md px-3 py-1.5 text-xs ${
                        q.dex === route.best_dex
                          ? "border border-emerald-500/30 bg-emerald-500/5"
                          : "border border-zinc-800 bg-black/30"
                      }`}
                    >
                      <span className="text-zinc-300">{q.dex}</span>
                      <span className="font-mono text-zinc-400">{q.out}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone = "ok",
}: {
  icon: any;
  label: string;
  value: string;
  tone?: "ok" | "warn";
}) {
  return (
    <div className="rounded-md border border-zinc-800 bg-black/30 px-3 py-2">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-zinc-500">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div
        className={`mt-0.5 font-mono text-sm ${
          tone === "warn" ? "text-amber-300" : "text-white"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

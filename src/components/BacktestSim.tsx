"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, Play } from "lucide-react";

type Strategy = "momentum" | "mean_reversion" | "breakout" | "multi_agent";

type Result = {
  ok: boolean;
  config?: { symbol: string; strategy: string; strategy_label: string; capital: number; days: number };
  summary?: {
    starting_capital: number;
    ending_equity: number;
    total_return_pct: number;
    benchmark_return_pct: number;
    alpha_pct: number;
    sharpe: number;
    win_rate_pct: number;
    total_trades: number;
    max_drawdown_pct: number;
  };
  series?: { t: number; equity: number; benchmark: number; drawdown: number }[];
};

const STRATS: { id: Strategy; label: string }[] = [
  { id: "multi_agent", label: "Multi-Agent" },
  { id: "momentum", label: "Momentum" },
  { id: "breakout", label: "Breakout" },
  { id: "mean_reversion", label: "Mean Reversion" },
];

export default function BacktestSim() {
  const [symbol, setSymbol] = useState("BTC");
  const [strategy, setStrategy] = useState<Strategy>("multi_agent");
  const [capital, setCapital] = useState(10000);
  const [days, setDays] = useState(90);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function run() {
    setLoading(true);
    try {
      const res = await fetch("/api/backtest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ symbol, strategy, capital, days }),
      });
      const j = await res.json();
      setResult(j);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="backtest" className="relative mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-wider text-emerald-400 mb-3 font-medium">
          Backtest Simulator
        </div>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Stress test before you{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
            commit capital.
          </span>
        </h2>
        <p className="mt-4 max-w-2xl text-zinc-400">
          Run any strategy across historical-style returns. Equity curve, drawdown, Sharpe, alpha vs
          buy-and-hold — all computed server-side, deterministic per config.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-5">
          <div>
            <Label>Symbol</Label>
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase().slice(0, 16))}
              className="mt-1.5 w-full rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm font-mono text-zinc-100 focus:border-emerald-500/60 focus:outline-none"
            />
          </div>

          <div>
            <Label>Strategy</Label>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              {STRATS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStrategy(s.id)}
                  className={`rounded-md border px-3 py-2 text-xs transition ${
                    strategy === s.id
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                      : "border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Capital · ${capital.toLocaleString()}</Label>
            <input
              type="range"
              min={1000}
              max={500000}
              step={1000}
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              className="mt-2 w-full accent-emerald-500"
            />
          </div>

          <div>
            <Label>Window · {days}d</Label>
            <input
              type="range"
              min={30}
              max={365}
              step={1}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="mt-2 w-full accent-emerald-500"
            />
          </div>

          <button
            onClick={run}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-emerald-400 disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Running…</>
            ) : (
              <><Play className="h-4 w-4" /> Run Backtest</>
            )}
          </button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {result?.ok && result.summary ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Metric label="Total Return" value={`${result.summary.total_return_pct}%`} positive={result.summary.total_return_pct >= 0} />
                <Metric label="Alpha vs HODL" value={`${result.summary.alpha_pct}%`} positive={result.summary.alpha_pct >= 0} />
                <Metric label="Sharpe" value={result.summary.sharpe.toFixed(2)} positive={result.summary.sharpe >= 1} />
                <Metric label="Max DD" value={`${result.summary.max_drawdown_pct}%`} positive={result.summary.max_drawdown_pct > -15} />
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
                <div className="text-xs uppercase tracking-wider text-zinc-400 mb-3">
                  Equity Curve · {result.config?.strategy_label} on {result.config?.symbol}
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.series}>
                      <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                      <XAxis dataKey="t" stroke="#71717a" fontSize={11} />
                      <YAxis stroke="#71717a" fontSize={11} domain={["dataMin", "dataMax"]} />
                      <Tooltip
                        contentStyle={{ background: "#09090b", border: "1px solid #3f3f46", fontSize: 12 }}
                        labelStyle={{ color: "#a1a1aa" }}
                      />
                      <Line type="monotone" dataKey="equity" name="Strategy" stroke="#34d399" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="benchmark" name="Buy & Hold" stroke="#a1a1aa" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
                <div className="text-xs uppercase tracking-wider text-zinc-400 mb-3">
                  Drawdown
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.series}>
                      <defs>
                        <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#fb7185" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#fb7185" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                      <XAxis dataKey="t" stroke="#71717a" fontSize={11} />
                      <YAxis stroke="#71717a" fontSize={11} />
                      <Tooltip
                        contentStyle={{ background: "#09090b", border: "1px solid #3f3f46", fontSize: 12 }}
                      />
                      <Area type="monotone" dataKey="drawdown" stroke="#fb7185" fill="url(#ddGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-10 text-center"
            >
              <div className="text-sm text-zinc-400">
                Configure and run a backtest to see equity curve, drawdown, and risk metrics.
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{children}</div>;
}

function Metric({ label, value, positive }: { label: string; value: string; positive: boolean }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`mt-1 font-mono text-xl ${positive ? "text-emerald-400" : "text-rose-400"}`}>
        {value}
      </div>
    </div>
  );
}

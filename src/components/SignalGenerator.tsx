"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";

type Agent = { name: string; score: number; note: string };
type Signal = {
  symbol: string;
  verdict: string;
  conviction: number;
  thesis: string;
  entry: string;
  target: string;
  invalidation: string;
  horizon: string;
  agents: Agent[];
  risks: string[];
};
type ApiResponse = {
  ok: boolean;
  signal?: Signal;
  meta?: { latency_ms: number; generated_at: string; model: string };
  error?: string;
  detail?: string;
};

const PRESETS = ["BTC", "ETH", "SOL", "ARB", "JUP", "PEPE", "WIF", "BONK"];

export default function SignalGenerator() {
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);

  async function generate(s: string) {
    const sym = s.trim().toUpperCase();
    if (!sym || loading) return;
    setSymbol(sym);
    setLoading(true);
    setData(null);
    try {
      const res = await fetch("/api/signal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ symbol: sym }),
      });
      const json = (await res.json()) as ApiResponse;
      setData(json);
    } catch (e) {
      setData({ ok: false, error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="signal" className="relative mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-wider text-fuchsia-400 mb-3 font-medium">
          Live Signal Engine
        </div>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Real signal.{" "}
          <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
            Live model.
          </span>
        </h2>
        <p className="mt-4 max-w-2xl text-zinc-400">
          Type a token, the multi-agent stack scores it across momentum, liquidity, narrative,
          on-chain, and risk — then writes a thesis with entry, target, and invalidation. Backed by
          MiMo V2.5 Pro running server-side.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur">
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => generate(p)}
              disabled={loading}
              className="rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:border-fuchsia-500/40 hover:text-white disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            generate(symbol);
          }}
          className="flex gap-2"
        >
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Type a ticker or contract address (e.g. SOL, ARB, 0x…)"
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-900/60 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-fuchsia-500/60 focus:outline-none"
            maxLength={64}
          />
          <button
            type="submit"
            disabled={loading || !symbol.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-fuchsia-500 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Forging…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate
              </>
            )}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {data && (
            <motion.div
              key={data.ok ? "ok" : "err"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-6"
            >
              {data.ok && data.signal ? (
                <SignalCard sig={data.signal} meta={data.meta} />
              ) : (
                <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Signal generation failed</div>
                    <div className="mt-1 text-amber-200/70 text-xs">
                      {data.error || "Unknown error"}{data.detail ? ` — ${data.detail}` : ""}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function verdictStyle(v: string) {
  const x = v.toUpperCase();
  if (x.includes("STRONG_BUY")) return { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: TrendingUp };
  if (x.includes("BUY")) return { color: "text-emerald-300", bg: "bg-emerald-500/5", border: "border-emerald-500/20", icon: TrendingUp };
  if (x.includes("STRONG_SELL")) return { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", icon: TrendingDown };
  if (x.includes("SELL")) return { color: "text-rose-300", bg: "bg-rose-500/5", border: "border-rose-500/20", icon: TrendingDown };
  return { color: "text-zinc-300", bg: "bg-zinc-500/5", border: "border-zinc-500/20", icon: Minus };
}

function SignalCard({ sig, meta }: { sig: Signal; meta?: ApiResponse["meta"] }) {
  const v = verdictStyle(sig.verdict);
  const Icon = v.icon;
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <div className={`rounded-xl border ${v.border} ${v.bg} p-5`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400">Verdict · {sig.symbol}</div>
              <div className={`mt-1 flex items-center gap-2 text-2xl font-semibold ${v.color}`}>
                <Icon className="h-6 w-6" /> {sig.verdict.replace(/_/g, " ")}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-zinc-400">Conviction</div>
              <div className={`text-3xl font-mono ${v.color}`}>{sig.conviction}</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-200 leading-relaxed">{sig.thesis}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <KV label="Entry" value={sig.entry} />
          <KV label="Target" value={sig.target} />
          <KV label="Invalidation" value={sig.invalidation} accent="rose" />
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="text-xs uppercase tracking-wider text-zinc-400 mb-3">Agent Scores</div>
          <div className="space-y-3">
            {sig.agents.map((a) => (
              <AgentRow key={a.name} agent={a} />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="text-xs uppercase tracking-wider text-zinc-400 mb-3">Horizon</div>
          <div className="font-mono text-lg text-zinc-200">{sig.horizon}</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="text-xs uppercase tracking-wider text-zinc-400 mb-3">Key Risks</div>
          <ul className="space-y-2 text-sm text-zinc-300">
            {sig.risks.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-amber-400">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
        {meta && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-xs text-zinc-500 space-y-1">
            <div className="flex justify-between">
              <span>Model</span>
              <span className="font-mono text-zinc-300">{meta.model}</span>
            </div>
            <div className="flex justify-between">
              <span>Latency</span>
              <span className="font-mono text-zinc-300">{meta.latency_ms} ms</span>
            </div>
            <div className="flex justify-between">
              <span>Generated</span>
              <span className="font-mono text-zinc-300">
                {new Date(meta.generated_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function KV({ label, value, accent }: { label: string; value: string; accent?: "rose" }) {
  const c = accent === "rose" ? "text-rose-300" : "text-zinc-100";
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`mt-1 font-mono text-sm ${c}`}>{value}</div>
    </div>
  );
}

function AgentRow({ agent }: { agent: Agent }) {
  const score = Math.max(0, Math.min(100, agent.score));
  const tone =
    score >= 70 ? "bg-emerald-500" : score >= 50 ? "bg-cyan-500" : score >= 30 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="font-medium text-zinc-200">{agent.name}</span>
        <span className="font-mono text-zinc-400">{score}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full ${tone}`}
        />
      </div>
      <div className="mt-1 text-xs text-zinc-500">{agent.note}</div>
    </div>
  );
}

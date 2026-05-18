"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, ChevronRight, Cpu, Eye, Pause, Play } from "lucide-react";

type AgentStatus = "active" | "idle" | "training";
type Agent = {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  throughput: number; // req/min
  confidence: number; // 0-100
  lastDecision: string;
  prompt: string;
  recentCalls: { ts: string; symbol: string; verdict: string }[];
};

const AGENTS_SEED: Agent[] = [
  {
    id: "momentum",
    name: "Momentum",
    role: "Trend & velocity scoring",
    status: "active",
    throughput: 42,
    confidence: 78,
    lastDecision: "SOL · STRONG_BUY · 87",
    prompt: "Score price momentum across 1h/4h/1d. Weight regime detection.",
    recentCalls: [
      { ts: "08:42", symbol: "SOL", verdict: "STRONG_BUY" },
      { ts: "08:39", symbol: "ETH", verdict: "BUY" },
      { ts: "08:35", symbol: "ARB", verdict: "NEUTRAL" },
    ],
  },
  {
    id: "liquidity",
    name: "Liquidity",
    role: "Depth & slippage analysis",
    status: "active",
    throughput: 38,
    confidence: 91,
    lastDecision: "BTC · BUY · 92",
    prompt: "Read order-book depth, DEX liquidity, derivatives OI. Flag thin books.",
    recentCalls: [
      { ts: "08:43", symbol: "BTC", verdict: "BUY" },
      { ts: "08:40", symbol: "JUP", verdict: "BUY" },
      { ts: "08:36", symbol: "WIF", verdict: "NEUTRAL" },
    ],
  },
  {
    id: "narrative",
    name: "Narrative",
    role: "Social sentiment & memes",
    status: "active",
    throughput: 51,
    confidence: 64,
    lastDecision: "PEPE · BUY · 71",
    prompt: "Read X/TG/Discord sentiment + KOL conviction. Decay old narratives.",
    recentCalls: [
      { ts: "08:43", symbol: "PEPE", verdict: "BUY" },
      { ts: "08:38", symbol: "BONK", verdict: "NEUTRAL" },
      { ts: "08:34", symbol: "WIF", verdict: "BUY" },
    ],
  },
  {
    id: "onchain",
    name: "OnChain",
    role: "Wallet flows & holders",
    status: "active",
    throughput: 29,
    confidence: 82,
    lastDecision: "ARB · NEUTRAL · 58",
    prompt: "Inspect smart-money flow, holder distribution, unlock schedule, contract risk.",
    recentCalls: [
      { ts: "08:42", symbol: "ARB", verdict: "NEUTRAL" },
      { ts: "08:37", symbol: "OP", verdict: "BUY" },
      { ts: "08:33", symbol: "SUI", verdict: "SELL" },
    ],
  },
  {
    id: "risk",
    name: "Risk",
    role: "Drawdown & invalidation",
    status: "active",
    throughput: 36,
    confidence: 88,
    lastDecision: "ETH · STRONG_BUY · 81",
    prompt: "Compute max drawdown, beta, correlation. Set invalidation rules per setup.",
    recentCalls: [
      { ts: "08:43", symbol: "ETH", verdict: "STRONG_BUY" },
      { ts: "08:39", symbol: "BTC", verdict: "BUY" },
      { ts: "08:35", symbol: "TON", verdict: "NEUTRAL" },
    ],
  },
  {
    id: "verdict",
    name: "Verdict",
    role: "Synthesis & thesis writer",
    status: "active",
    throughput: 18,
    confidence: 76,
    lastDecision: "Composing — ETH thesis",
    prompt: "Aggregate sub-agent scores. Write thesis with entry/target/invalidation.",
    recentCalls: [
      { ts: "08:43", symbol: "ETH", verdict: "STRONG_BUY" },
      { ts: "08:42", symbol: "SOL", verdict: "BUY" },
      { ts: "08:40", symbol: "BTC", verdict: "BUY" },
    ],
  },
  {
    id: "forge",
    name: "Forge",
    role: "Bot code generator",
    status: "idle",
    throughput: 6,
    confidence: 81,
    lastDecision: "Last forge: ETH momentum bot · 4m ago",
    prompt: "Convert thesis to runnable Python/TS strategy with backtest harness.",
    recentCalls: [
      { ts: "08:39", symbol: "ETH", verdict: "BOT_FORGED" },
      { ts: "08:21", symbol: "ARB", verdict: "BOT_FORGED" },
    ],
  },
  {
    id: "executor",
    name: "Executor",
    role: "Webhook & order routing",
    status: "training",
    throughput: 0,
    confidence: 0,
    lastDecision: "Calibrating slippage model",
    prompt: "Route signals to webhooks, exchanges, or paper-trading sandbox.",
    recentCalls: [],
  },
];

export default function AgentsConsole() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS_SEED);
  const [selected, setSelected] = useState<Agent>(AGENTS_SEED[0]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setAgents((prev) =>
        prev.map((a) => {
          if (a.status !== "active") return a;
          const drift = Math.floor(Math.random() * 5) - 2;
          const conf = Math.max(40, Math.min(99, a.confidence + (Math.random() < 0.5 ? -1 : 1)));
          return { ...a, throughput: Math.max(0, a.throughput + drift), confidence: conf };
        }),
      );
    }, 2000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
      {/* Left: agent list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500">
            <Activity className="h-3 w-3 text-emerald-400 animate-pulse" /> Live runtime
          </div>
          <button
            onClick={() => setPaused(!paused)}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900/60 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
          >
            {paused ? <><Play className="h-3 w-3" /> Resume</> : <><Pause className="h-3 w-3" /> Pause</>}
          </button>
        </div>
        <div className="space-y-2">
          {agents.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelected(a)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                selected.id === a.id
                  ? "border-fuchsia-500/40 bg-fuchsia-500/5"
                  : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-fuchsia-400" />
                  <div>
                    <div className="text-sm font-medium text-zinc-100">{a.name}</div>
                    <div className="text-xs text-zinc-500">{a.role}</div>
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <Mini label="Throughput" value={`${a.throughput}/min`} />
                <Mini label="Confidence" value={`${a.confidence}%`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: detail panel */}
      <motion.div
        key={selected.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-500">Agent · {selected.id}</div>
            <h3 className="mt-1 text-2xl font-semibold text-zinc-100">{selected.name}</h3>
            <p className="text-sm text-zinc-400">{selected.role}</p>
          </div>
          <StatusBadge status={selected.status} />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat label="Throughput" value={`${selected.throughput}/min`} accent="cyan" />
          <Stat label="Confidence" value={`${selected.confidence}%`} accent="emerald" />
          <Stat label="Last Decision" value={selected.lastDecision} accent="fuchsia" small />
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500">
            <Eye className="h-3 w-3" /> System prompt
          </div>
          <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-black/40 p-3 text-xs text-zinc-300">
{selected.prompt}
          </pre>
        </div>

        <div className="mt-6">
          <div className="mb-2 text-xs uppercase tracking-wider text-zinc-500">Recent calls</div>
          <div className="space-y-1.5">
            {selected.recentCalls.length === 0 ? (
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4 text-center text-sm text-zinc-500">
                No recent calls — agent is in training.
              </div>
            ) : (
              selected.recentCalls.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-zinc-500">{c.ts}</span>
                    <span className="font-medium text-zinc-200">{c.symbol}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono ${verdictColor(c.verdict)}`}>{c.verdict}</span>
                    <ChevronRight className="h-3 w-3 text-zinc-600" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatusBadge({ status }: { status: AgentStatus }) {
  const map = {
    active: { c: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", t: "Active" },
    idle: { c: "bg-zinc-500/10 text-zinc-400 border-zinc-700", t: "Idle" },
    training: { c: "bg-amber-500/10 text-amber-400 border-amber-500/30", t: "Training" },
  } as const;
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${s.c}`}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${
        status === "active" ? "bg-emerald-400 animate-pulse" : status === "training" ? "bg-amber-400" : "bg-zinc-500"
      }`} />
      {s.t}
    </span>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/40 px-2.5 py-1.5">
      <div className="text-[9px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="font-mono text-zinc-200">{value}</div>
    </div>
  );
}

function Stat({ label, value, accent, small }: { label: string; value: string; accent: "cyan" | "emerald" | "fuchsia"; small?: boolean }) {
  const c = accent === "cyan" ? "text-cyan-300" : accent === "emerald" ? "text-emerald-300" : "text-fuchsia-300";
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`mt-1 font-mono ${small ? "text-sm" : "text-xl"} ${c}`}>{value}</div>
    </div>
  );
}

function verdictColor(v: string) {
  if (v.includes("STRONG_BUY") || v.includes("BOT_FORGED")) return "text-emerald-400";
  if (v.includes("BUY")) return "text-emerald-300";
  if (v.includes("STRONG_SELL")) return "text-rose-400";
  if (v.includes("SELL")) return "text-rose-300";
  return "text-zinc-400";
}

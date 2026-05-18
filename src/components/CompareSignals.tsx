"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, X as XIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

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

type Slot = { sym: string; loading: boolean; sig: Signal | null; err: string | null };

const DEFAULT: Slot[] = [
  { sym: "BTC", loading: false, sig: null, err: null },
  { sym: "ETH", loading: false, sig: null, err: null },
  { sym: "SOL", loading: false, sig: null, err: null },
];

export default function CompareSignals() {
  const [slots, setSlots] = useState<Slot[]>(DEFAULT);
  const [running, setRunning] = useState(false);

  function update(i: number, patch: Partial<Slot>) {
    setSlots((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  async function fetchOne(i: number, sym: string) {
    const s = sym.trim().toUpperCase();
    if (!s) return;
    update(i, { loading: true, sig: null, err: null });
    try {
      const res = await fetch("/api/signal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ symbol: s }),
      });
      const j = await res.json();
      if (j.ok && j.signal) update(i, { loading: false, sig: j.signal });
      else update(i, { loading: false, err: j.error || "failed" });
    } catch (e) {
      update(i, { loading: false, err: String(e) });
    }
  }

  async function runAll() {
    setRunning(true);
    try {
      await Promise.all(slots.map((s, i) => fetchOne(i, s.sym)));
    } finally {
      setRunning(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Compare three at once</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Pit setups against each other. The agents run in parallel — verdicts and convictions side by side.
          </p>
        </div>
        <button
          onClick={runAll}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-md bg-fuchsia-500 px-5 py-2.5 text-sm font-medium text-black hover:bg-fuchsia-400 disabled:opacity-50"
        >
          {running ? <><Loader2 className="h-4 w-4 animate-spin" /> Running…</> : <><Sparkles className="h-4 w-4" /> Run All</>}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {slots.map((s, i) => (
          <SlotCard
            key={i}
            slot={s}
            onChange={(sym) => update(i, { sym })}
            onRun={() => fetchOne(i, s.sym)}
          />
        ))}
      </div>
    </section>
  );
}

function SlotCard({
  slot, onChange, onRun,
}: {
  slot: Slot;
  onChange: (sym: string) => void;
  onRun: () => void;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
      <div className="flex gap-2">
        <input
          value={slot.sym}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="flex-1 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-sm font-mono text-zinc-100 focus:border-fuchsia-500/40 focus:outline-none"
          maxLength={16}
        />
        <button
          onClick={onRun}
          disabled={slot.loading || !slot.sym.trim()}
          className="rounded-md bg-fuchsia-500/15 border border-fuchsia-500/30 px-3 text-xs text-fuchsia-300 hover:bg-fuchsia-500/25 disabled:opacity-40"
        >
          {slot.loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Run"}
        </button>
      </div>

      {slot.err && (
        <div className="rounded-md border border-rose-500/30 bg-rose-500/5 p-2 text-xs text-rose-300">
          <XIcon className="inline h-3 w-3 mr-1" /> {slot.err}
        </div>
      )}

      {slot.sig && <SigSummary sig={slot.sig} />}

      {!slot.sig && !slot.err && !slot.loading && (
        <div className="rounded-md border border-dashed border-zinc-800 bg-zinc-950/30 p-4 text-center text-xs text-zinc-500">
          Click Run or use Run All
        </div>
      )}
    </div>
  );
}

function SigSummary({ sig }: { sig: Signal }) {
  const v = verdictStyle(sig.verdict);
  const Icon = v.icon;
  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
      <div className={`rounded-md border ${v.border} ${v.bg} p-3`}>
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${v.color}`}>
            <Icon className="h-4 w-4" /> {sig.verdict.replace(/_/g, " ")}
          </span>
          <span className={`font-mono text-lg ${v.color}`}>{sig.conviction}</span>
        </div>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-300">{sig.thesis}</p>
      </div>

      <div className="mt-3 space-y-1.5">
        {sig.agents.slice(0, 5).map((a) => (
          <div key={a.name} className="flex items-center gap-2 text-[11px]">
            <span className="w-16 text-zinc-400">{a.name}</span>
            <div className="flex-1 h-1 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className={
                  a.score >= 70 ? "bg-emerald-500" :
                  a.score >= 50 ? "bg-cyan-500" :
                  a.score >= 30 ? "bg-amber-500" : "bg-rose-500"
                }
                style={{ height: "100%", width: `${a.score}%` }}
              />
            </div>
            <span className="w-7 text-right font-mono text-zinc-400">{a.score}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px]">
        <KV label="Entry" value={sig.entry} />
        <KV label="Target" value={sig.target} />
      </div>
    </motion.div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-zinc-800 bg-zinc-950/40 px-2 py-1">
      <div className="text-[9px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="font-mono text-zinc-200 truncate">{value}</div>
    </div>
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

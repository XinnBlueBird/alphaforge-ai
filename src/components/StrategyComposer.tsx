"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Loader2, Copy, Check, Code2 } from "lucide-react";

const TEMPLATES = [
  "Buy SOL when 1h RSI < 30 and 24h volume > $2B, take profit at +5%, stop loss -3%",
  "DCA into ETH every Friday at 16:00 UTC if price is below 7d MA",
  "Long ARB when funding rate is negative and OI rising 4h+",
  "Trail-stop BTC after +8% move, exit if MACD crosses down on 4h",
];

type Strategy = {
  name: string;
  symbol: string;
  trigger: { description: string; conditions: string[] };
  entry: { type: string; size_pct: number; max_slippage_bps: number };
  exit: { take_profit: string; stop_loss: string; max_hold_hours: number };
  risk: { max_position_pct: number; max_drawdown_pct: number; cooldown_min: number };
  notes: string[];
};

export default function StrategyComposer() {
  const [intent, setIntent] = useState("");
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function compose() {
    if (!intent.trim() || loading) return;
    setLoading(true);
    setError(null);
    setStrategy(null);
    try {
      const res = await fetch("/api/compose", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ intent }),
      });
      const j = await res.json();
      if (j.ok && j.strategy) setStrategy(j.strategy);
      else setError(j.error || "Composer failed");
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function copyJSON() {
    if (!strategy) return;
    await navigator.clipboard.writeText(JSON.stringify(strategy, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
        <div className="text-xs uppercase tracking-wider text-fuchsia-400 mb-2">Plain English →</div>

        <div className="flex flex-wrap gap-2 mb-3">
          {TEMPLATES.map((t, i) => (
            <button
              key={i}
              onClick={() => setIntent(t)}
              disabled={loading}
              className="rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300 hover:border-fuchsia-500/40 hover:text-white disabled:opacity-50"
            >
              Template {i + 1}
            </button>
          ))}
        </div>

        <textarea
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          placeholder="Describe your strategy in plain English. e.g. 'Buy SOL when 1h RSI < 30, target +5%, stop -3%'"
          rows={4}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-fuchsia-500/40 focus:outline-none resize-none"
          maxLength={1000}
        />

        <button
          onClick={compose}
          disabled={loading || !intent.trim()}
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-fuchsia-500 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-fuchsia-400 disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Composing…</>
          ) : (
            <><Wand2 className="h-4 w-4" /> Compose Strategy</>
          )}
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-300"
          >
            {error}
          </motion.div>
        )}

        {strategy && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 lg:grid-cols-2"
          >
            <div className="space-y-3">
              <Card label="Strategy" value={strategy.name} accent="fuchsia" />
              <Card label="Symbol" value={strategy.symbol} accent="cyan" />
              <Card label="Trigger" value={strategy.trigger.description} small />
              <Card label="Entry" value={`${strategy.entry.type} · ${strategy.entry.size_pct}% size · ${strategy.entry.max_slippage_bps}bps slip`} small />
              <Card label="Exit" value={`TP ${strategy.exit.take_profit} · SL ${strategy.exit.stop_loss} · ${strategy.exit.max_hold_hours}h max`} small />
              <Card label="Risk" value={`Max pos ${strategy.risk.max_position_pct}% · Max DD ${strategy.risk.max_drawdown_pct}% · Cooldown ${strategy.risk.cooldown_min}m`} small />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/40 px-4 py-2.5">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Code2 className="h-3.5 w-3.5" /> strategy.json
                </div>
                <button
                  onClick={copyJSON}
                  className="inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-white"
                >
                  {copied ? <><Check className="h-3 w-3 text-emerald-400" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
                </button>
              </div>
              <pre className="max-h-[500px] overflow-auto p-4 text-xs leading-relaxed text-zinc-300">
{JSON.stringify(strategy, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Card({ label, value, accent, small }: { label: string; value: string; accent?: "fuchsia" | "cyan"; small?: boolean }) {
  const c = accent === "fuchsia" ? "text-fuchsia-300" : accent === "cyan" ? "text-cyan-300" : "text-zinc-100";
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`mt-1 ${small ? "text-sm" : "text-lg"} ${c}`}>{value}</div>
    </div>
  );
}

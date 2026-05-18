/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Copy, Check, ArrowRight } from "lucide-react";

type CondType = "rsi" | "price_ma" | "volume" | "macd" | "funding";

type Condition = {
  id: string;
  type: CondType;
  params: Record<string, string | number>;
};

const TEMPLATES: Record<CondType, { label: string; defaults: Record<string, any>; render: (p: Record<string, any>) => string }> = {
  rsi: {
    label: "RSI threshold",
    defaults: { period: 14, op: "<", value: 30 },
    render: (p) => `RSI(${p.period}) ${p.op} ${p.value}`,
  },
  price_ma: {
    label: "Price vs MA",
    defaults: { ma: 20, op: ">", offset_pct: 0 },
    render: (p) => `Price ${p.op} MA(${p.ma}) ${p.offset_pct ? `±${p.offset_pct}%` : ""}`,
  },
  volume: {
    label: "Volume spike",
    defaults: { window: 24, multiplier: 2 },
    render: (p) => `Volume ${p.window}h > ${p.multiplier}× avg`,
  },
  macd: {
    label: "MACD cross",
    defaults: { signal: "above", timeframe: "4h" },
    render: (p) => `MACD crosses ${p.signal} signal (${p.timeframe})`,
  },
  funding: {
    label: "Funding rate",
    defaults: { op: "<", value: 0 },
    render: (p) => `Funding ${p.op} ${p.value}%`,
  },
};

export default function StrategyBuilder() {
  const [conditions, setConditions] = useState<Condition[]>([
    { id: "c1", type: "rsi", params: { ...TEMPLATES.rsi.defaults } },
  ]);
  const [combine, setCombine] = useState<"AND" | "OR">("AND");
  const [name, setName] = useState("My Strategy");
  const [symbol, setSymbol] = useState("SOL");
  const [copied, setCopied] = useState(false);

  function addCondition(type: CondType) {
    const id = `c${Date.now()}`;
    setConditions([...conditions, { id, type, params: { ...TEMPLATES[type].defaults } }]);
  }

  function removeCondition(id: string) {
    setConditions(conditions.filter((c) => c.id !== id));
  }

  function updateParam(id: string, key: string, value: any) {
    setConditions(conditions.map((c) =>
      c.id === id ? { ...c, params: { ...c.params, [key]: value } } : c
    ));
  }

  const strategyJSON = {
    name,
    symbol,
    combine,
    conditions: conditions.map((c) => ({
      type: c.type,
      label: TEMPLATES[c.type].render(c.params),
      params: c.params,
    })),
    created_at: new Date().toISOString(),
  };

  async function copyJSON() {
    await navigator.clipboard.writeText(JSON.stringify(strategyJSON, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      {/* Builder */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-zinc-500">Strategy name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-zinc-500">Symbol</label>
              <input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="mt-1.5 w-full rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm font-mono text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-500">Combine logic</label>
            <div className="mt-1.5 flex gap-1.5">
              {(["AND", "OR"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setCombine(m)}
                  className={`flex-1 rounded-md border px-3 py-1.5 text-xs font-mono transition ${
                    combine === m
                      ? "border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-300"
                      : "border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:text-white"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Conditions</div>
          <AnimatePresence>
            <div className="space-y-2">
              {conditions.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-fuchsia-500/15 border border-fuchsia-500/30 px-2 py-0.5 text-[10px] font-mono text-fuchsia-300">
                        {i === 0 ? "IF" : combine}
                      </span>
                      <span className="text-sm text-zinc-100">{TEMPLATES[c.type].label}</span>
                    </div>
                    <button
                      onClick={() => removeCondition(c.id)}
                      className="text-zinc-500 hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(c.params).map(([k, v]) => (
                      <ParamInput
                        key={k}
                        label={k}
                        value={v}
                        onChange={(nv) => updateParam(c.id, k, nv)}
                      />
                    ))}
                  </div>
                  <div className="mt-2 text-[11px] font-mono text-zinc-500">
                    → {TEMPLATES[c.type].render(c.params)}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {(Object.keys(TEMPLATES) as CondType[]).map((t) => (
              <button
                key={t}
                onClick={() => addCondition(t)}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300 hover:border-fuchsia-500/30 hover:text-white"
              >
                <Plus className="h-3 w-3" /> {TEMPLATES[t].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* JSON output + actions */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/40 px-4 py-2.5">
            <div className="text-xs font-mono text-zinc-400">strategy.json</div>
            <button
              onClick={copyJSON}
              className="inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-white"
            >
              {copied ? <><Check className="h-3 w-3 text-emerald-400" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
            </button>
          </div>
          <pre className="max-h-[500px] overflow-auto p-4 text-xs leading-relaxed text-zinc-300">
{JSON.stringify(strategyJSON, null, 2)}
          </pre>
        </div>

        <div className="rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/5 p-5">
          <div className="text-xs uppercase tracking-wider text-fuchsia-300 mb-2">Next step</div>
          <p className="text-sm text-zinc-200 mb-4">
            Send this strategy to the Backtest Lab to see how it would have performed.
          </p>
          <Link
            href={`/lab?symbol=${symbol}&strategy=multi_agent`}
            className="inline-flex items-center gap-2 rounded-md bg-fuchsia-500 px-4 py-2 text-sm font-medium text-black hover:bg-fuchsia-400"
          >
            Open Backtest Lab <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ParamInput({ label, value, onChange }: { label: string; value: any; onChange: (v: any) => void }) {
  const isNum = typeof value === "number";
  return (
    <label className="block">
      <div className="text-[9px] uppercase tracking-wider text-zinc-500">{label}</div>
      <input
        type={isNum ? "number" : "text"}
        value={value}
        onChange={(e) => onChange(isNum ? Number(e.target.value) : e.target.value)}
        className="mt-0.5 w-full rounded-md border border-zinc-800 bg-zinc-950/40 px-2 py-1 text-xs font-mono text-zinc-100 focus:border-fuchsia-500/40 focus:outline-none"
      />
    </label>
  );
}

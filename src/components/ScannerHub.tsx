/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Sparkles, AlertTriangle, Coins, AtSign, Rocket, Layers,
  TrendingUp, ShieldAlert,
} from "lucide-react";

type Kind = "token" | "x" | "project" | "defi";

const TABS: { id: Kind; label: string; icon: any; placeholder: string; presets: string[]; accent: string }[] = [
  {
    id: "token", label: "Token Scan", icon: Coins,
    placeholder: "Symbol or contract (e.g. SOL, 0x71fc7…)",
    presets: ["SOL", "JUP", "WIF", "PEPE", "BONK"],
    accent: "fuchsia",
  },
  {
    id: "x", label: "X Sentiment", icon: AtSign,
    placeholder: "Cashtag, project, or topic ($SOL, AI x crypto)",
    presets: ["$ETH", "AI agents", "$BTC", "Solana memes", "DePIN"],
    accent: "cyan",
  },
  {
    id: "project", label: "Project Alpha", icon: Rocket,
    placeholder: "Project name or thesis (e.g. Monad, AI x crypto)",
    presets: ["Monad", "Berachain", "Eigenlayer", "Hyperliquid", "Plasma"],
    accent: "amber",
  },
  {
    id: "defi", label: "DeFi Yields", icon: Layers,
    placeholder: "Chain or protocol (e.g. Base, Aerodrome, Curve)",
    presets: ["Base", "Aerodrome", "Pendle", "Hyperliquid", "Solana"],
    accent: "emerald",
  },
];

const TONE_COLOR: Record<string, string> = {
  good: "text-emerald-300", warn: "text-amber-300", bad: "text-rose-300",
  bullish: "text-emerald-300", bearish: "text-rose-300", neutral: "text-zinc-300",
  low: "text-emerald-300", med: "text-amber-300", high: "text-rose-300",
};

const ACCENT: Record<string, { ring: string; chip: string; bar: string; text: string }> = {
  fuchsia: { ring: "border-fuchsia-500/40", chip: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30", bar: "bg-fuchsia-500", text: "text-fuchsia-400" },
  cyan:    { ring: "border-cyan-500/40",    chip: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",       bar: "bg-cyan-500",    text: "text-cyan-400" },
  amber:   { ring: "border-amber-500/40",   chip: "bg-amber-500/10 text-amber-300 border-amber-500/30",    bar: "bg-amber-500",   text: "text-amber-400" },
  emerald: { ring: "border-emerald-500/40", chip: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30", bar: "bg-emerald-500", text: "text-emerald-400" },
};

export default function ScannerHub() {
  const [tab, setTab] = useState<Kind>("token");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const cur = TABS.find((t) => t.id === tab)!;
  const a = ACCENT[cur.accent];

  async function scan(q: string) {
    const v = q.trim();
    if (!v || loading) return;
    setQuery(v);
    setLoading(true);
    setErr(null);
    setResult(null);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: tab, query: v }),
      });
      const j = await res.json();
      if (j.ok) setResult(j.result);
      else setErr(j.error || "scan failed");
    } catch (e) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = t.id === tab;
          const acc = ACCENT[t.accent];
          return (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setResult(null); setErr(null); }}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                active
                  ? `${acc.ring} ${acc.chip}`
                  : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {cur.presets.map((p) => (
            <button
              key={p}
              onClick={() => scan(p)}
              disabled={loading}
              className="rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:border-zinc-500 hover:text-white disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); scan(query); }} className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={cur.placeholder}
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-900/60 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-fuchsia-500/40 focus:outline-none"
            maxLength={200}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className={`inline-flex items-center gap-2 rounded-md ${a.bar} px-5 py-2.5 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-50`}
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Scanning…</> : <><Sparkles className="h-4 w-4" /> Scan</>}
          </button>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {err && (
          <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-200">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>{err}</div>
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div
            key={`res-${tab}-${query}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "token" && <TokenView r={result} accent={a} />}
            {tab === "x" && <XView r={result} accent={a} />}
            {tab === "project" && <ProjectView r={result} accent={a} />}
            {tab === "defi" && <DefiView r={result} accent={a} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----- Views -----

function ScoreRing({ score, color }: { score: number; color: string }) {
  const c = Math.max(0, Math.min(100, score));
  return (
    <div className="relative inline-flex h-20 w-20 items-center justify-center">
      <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#27272a" strokeWidth="3" />
        <circle
          cx="18" cy="18" r="15.9" fill="none"
          stroke={color} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={`${c}, 100`}
        />
      </svg>
      <span className="absolute font-mono text-xl font-semibold text-zinc-100">{c}</span>
    </div>
  );
}

function TokenView({ r, accent }: { r: any; accent: any }) {
  const verdictColor =
    r.verdict === "ALPHA" ? "text-emerald-400" :
    r.verdict === "AVOID" ? "text-rose-400" : "text-zinc-300";
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className={`lg:col-span-2 rounded-2xl border ${accent.ring} bg-zinc-950/60 p-6 space-y-4`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-500">Token · {r.symbol}</div>
            <h3 className="mt-1 text-2xl font-semibold">{r.headline}</h3>
            <div className={`mt-2 text-lg font-mono ${verdictColor}`}>{r.verdict}</div>
          </div>
          <ScoreRing score={r.score} color="#d946ef" />
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed">{r.narrative}</p>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Playbook</div>
          <div className="text-sm text-zinc-200">{r.playbook}</div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Metrics</div>
          <div className="space-y-2">
            {r.metrics?.map((m: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">{m.label}</span>
                <span className={`font-mono ${TONE_COLOR[m.tone] || "text-zinc-200"}`}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-rose-300 mb-2">
            <ShieldAlert className="h-3 w-3" /> Red Flags
          </div>
          <ul className="space-y-1.5 text-sm text-rose-200/90">
            {r.redflags?.map((f: string, i: number) => (
              <li key={i} className="flex gap-2"><span>•</span><span>{f}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function XView({ r, accent }: { r: any; accent: any }) {
  const sentColor = r.sentiment === "BULLISH" ? "text-emerald-400" : r.sentiment === "BEARISH" ? "text-rose-400" : "text-zinc-300";
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className={`lg:col-span-2 rounded-2xl border ${accent.ring} bg-zinc-950/60 p-6 space-y-4`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-500">X · {r.topic}</div>
            <h3 className="mt-1 text-2xl font-semibold">{r.headline}</h3>
            <div className={`mt-2 text-lg font-mono ${sentColor}`}>
              {r.sentiment} · trend {r.trend_direction}
            </div>
          </div>
          <ScoreRing score={r.buzz_score} color="#22d3ee" />
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed"><span className="text-cyan-400">KOL take —</span> {r.kol_take}</p>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-sm text-zinc-200">
          <span className="text-cyan-400">Verdict —</span> {r.verdict}
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Engagement</div>
          {r.engagement && Object.entries(r.engagement).map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm py-0.5">
              <span className="text-zinc-400 capitalize">{k.replace(/_/g, " ")}</span>
              <span className="font-mono text-zinc-200">{v as string}</span>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-2">
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Tweets</div>
          {r.tweet_examples?.map((t: any, i: number) => (
            <div key={i} className="rounded-md border border-zinc-800 bg-zinc-900/40 p-2.5 text-xs">
              <div className={`font-mono mb-1 ${TONE_COLOR[t.vibe] || "text-zinc-300"}`}>{t.author}</div>
              <div className="text-zinc-300 leading-relaxed">{t.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectView({ r, accent }: { r: any; accent: any }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className={`lg:col-span-2 rounded-2xl border ${accent.ring} bg-zinc-950/60 p-6 space-y-4`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-500">{r.category} · {r.stage}</div>
            <h3 className="mt-1 text-2xl font-semibold">{r.project}</h3>
          </div>
          <ScoreRing score={r.alpha_score} color="#f59e0b" />
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed">{r.thesis}</p>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <div className="text-[10px] uppercase tracking-wider text-amber-300 mb-1">Why now</div>
          <div className="text-sm text-zinc-100">{r.why_now}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <KV label="Tokenomics" value={r.tokenomics} />
          <KV label="Team" value={r.team} />
          <KV label="Fundraise" value={r.fundraise} />
          <KV label="Next Catalyst" value={r.next_catalyst} accent="amber" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="text-xs uppercase tracking-wider text-emerald-300 mb-2">Moat</div>
          <ul className="space-y-1.5 text-sm text-zinc-200">
            {r.moat?.map((m: string, i: number) => (
              <li key={i} className="flex gap-2"><span className="text-emerald-400">▸</span><span>{m}</span></li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
          <div className="text-xs uppercase tracking-wider text-rose-300 mb-2">Risks</div>
          <ul className="space-y-1.5 text-sm text-zinc-200">
            {r.risks?.map((m: string, i: number) => (
              <li key={i} className="flex gap-2"><span className="text-rose-400">⚠</span><span>{m}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function DefiView({ r, accent }: { r: any; accent: any }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className={`lg:col-span-2 rounded-2xl border ${accent.ring} bg-zinc-950/60 p-6 space-y-4`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-500">DeFi · {r.target}</div>
            <h3 className="mt-1 text-2xl font-semibold">{r.headline}</h3>
            <div className="mt-2 text-sm text-zinc-400">TVL: <span className="font-mono text-zinc-200">{r.tvl}</span></div>
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3 text-emerald-400" /> Best yields
          </div>
          <div className="space-y-2">
            {r.best_yields?.map((y: any, i: number) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-sm">
                <div className="col-span-4 font-medium text-zinc-100">{y.pool}</div>
                <div className="col-span-2 font-mono text-emerald-300">{y.apy}</div>
                <div className={`col-span-1 text-xs uppercase tracking-wider ${TONE_COLOR[y.risk] || ""}`}>{y.risk}</div>
                <div className="col-span-5 text-xs text-zinc-400">{y.note}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-sm text-zinc-200">
          <span className="text-emerald-400">Smart money —</span> {r.smart_money_flow}
        </div>
      </div>
      <div className="space-y-3">
        <DefiList title="Stable strategies" items={r.stable_strategies} accent="cyan" />
        <DefiList title="Leveraged plays" items={r.leveraged_plays} accent="amber" />
        <DefiList title="Incentive programs" items={r.incentive_programs} accent="emerald" />
        {r.risk_summary && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
            <div className="text-xs uppercase tracking-wider text-rose-300 mb-2">Risk</div>
            <p className="text-sm text-zinc-200">{r.risk_summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DefiList({ title, items, accent }: { title: string; items?: string[]; accent: string }) {
  if (!items?.length) return null;
  const acc = ACCENT[accent];
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
      <div className={`text-xs uppercase tracking-wider mb-2 ${acc.text}`}>{title}</div>
      <ul className="space-y-1.5 text-sm text-zinc-200">
        {items.map((m, i) => (
          <li key={i} className="flex gap-2"><span className={acc.text}>▸</span><span>{m}</span></li>
        ))}
      </ul>
    </div>
  );
}

function KV({ label, value, accent }: { label: string; value: string; accent?: "amber" }) {
  const c = accent === "amber" ? "text-amber-300" : "text-zinc-100";
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`mt-1 text-sm ${c}`}>{value}</div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AGENTS } from "@/lib/agents";

type Event = {
  id: string;
  ts: number;
  agent: (typeof AGENTS)[number];
  message: string;
  status: "ok" | "warn" | "info";
};

const TEMPLATES: Record<string, string[]> = {
  "social-scraper": [
    "$WIF mention spike +340% in 6 alpha groups",
    "@cobie quote-tweet detected on $UNI proposal",
    "TG channel 'sol-degen-tier1' posted $POPCAT thesis",
    "Discord whale signal: 3 known wallets accumulating $JTO",
  ],
  "onchain-verifier": [
    "$WIF — top 10 holders 18%, LP locked 6mo, contract verified ✓",
    "$XYZ flagged HONEYPOT — sell tax 99% (skip)",
    "$JTO — 12 dev commits in 7d, healthy distribution",
    "$NEW — liquidity 240K, 2-day-old token (high risk)",
  ],
  "conviction-scorer": [
    "$WIF conviction 82/100 — narrative fit 'AI agents szn'",
    "$JTO conviction 71/100 — momentum strong, risk moderate",
    "$NEW conviction 34/100 — too early, low liquidity",
    "$POPCAT conviction 88/100 — clean tape, founder-led",
  ],
  "strategy-architect": [
    "snipe($WIF, 2 SOL, slippage=8%, TP+30/SL-15, 24h)",
    "accumulate($JTO, 0.5 SOL/h × 6h, max=3 SOL)",
    "farm($KAMINO_USDC, 12% APY, auto-compound 6h)",
    "hedge($BTC short 2x perp, sized 30% of long $WIF)",
  ],
  "bot-code-generator": [
    "snipe_bot.py — 320 LOC · async RPC pool · 3-tier failover",
    "accumulator.ts — 187 LOC · Jupiter v6 · slippage adapt",
    "farm_compounder.py — 144 LOC · cron 6h · gas-aware",
    "hedge_perp.ts — 256 LOC · Drift Protocol · stop-out logic",
  ],
  "backtest-generator": [
    "30d backtest: +47% PnL · -12% max DD · 64% WR (89 trades)",
    "60d backtest: +23% PnL · -18% max DD · 55% WR (142 trades)",
    "Monte-carlo (10k sims): 78% positive expectancy",
    "7d walk-forward: +9% PnL — within tolerance",
  ],
  "deploy-memo-writer": [
    "memo.md generated — thesis, risk, deploy steps (1.2KB)",
    "tweet_thread.md — 6 tweets, hook + body + CTA",
    "deploy_checklist.md — pre/post-flight, kill-switch",
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function statusFor(): "ok" | "warn" | "info" {
  const r = Math.random();
  return r > 0.85 ? "warn" : r > 0.4 ? "ok" : "info";
}

const STATUS_COLOR: Record<Event["status"], string> = {
  ok: "text-emerald-400",
  warn: "text-amber-400",
  info: "text-cyan-400",
};

export default function LiveFeed() {
  const [events, setEvents] = useState<Event[]>(() =>
    Array.from({ length: 6 }, (_, i) => seedEvent(Date.now() - i * 4000)),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setEvents((prev) => [seedEvent(Date.now()), ...prev].slice(0, 14));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="feed" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8">
        <span className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs uppercase tracking-wider text-zinc-400">
          Live Feed
        </span>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight">
          Watch the loop run.
        </h2>
        <p className="mt-3 max-w-2xl text-zinc-400">
          A simulated feed of agent activity. In production this is the real stream
          piped to your Telegram, Discord, or X.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-800 bg-black">
        <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-950 px-4 py-2 text-xs">
          <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-zinc-400">/var/log/alphaforge/agents.log</span>
          <span className="ml-auto font-mono text-zinc-600">
            {events.length} events · live
          </span>
        </div>
        <div className="max-h-[420px] overflow-y-auto">
          {events.map((e) => (
            <div
              key={e.id}
              className="grid grid-cols-12 gap-3 border-b border-zinc-900 px-4 py-2.5 font-mono text-xs last:border-0 hover:bg-zinc-950"
            >
              <span className="col-span-2 text-zinc-600">
                {new Date(e.ts).toISOString().slice(11, 19)}
              </span>
              <span className={`col-span-1 ${STATUS_COLOR[e.status]}`}>
                {e.status === "ok" ? "✓" : e.status === "warn" ? "!" : "·"}
              </span>
              <span className="col-span-3 text-zinc-400">
                {e.agent.emoji} {e.agent.name}
              </span>
              <span className="col-span-6 text-zinc-200">{e.message}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function seedEvent(ts: number): Event {
  const agent = pick(AGENTS);
  return {
    id: `${ts}-${Math.random().toString(36).slice(2, 8)}`,
    ts,
    agent,
    message: pick(TEMPLATES[agent.id] || ["processing…"]),
    status: statusFor(),
  };
}

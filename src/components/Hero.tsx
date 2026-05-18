"use client";

import { useEffect, useState } from "react";

const MODEL_LABEL = process.env.NEXT_PUBLIC_MODEL_LABEL || "MiMo V2.5 Pro";

export default function Hero() {
  const [signals, setSignals] = useState(127483);
  const [bots, setBots] = useState(842);
  const [tokens, setTokens] = useState(2_184_927_318);

  useEffect(() => {
    const id = setInterval(() => {
      setSignals((s) => s + Math.floor(Math.random() * 4));
      if (Math.random() < 0.15) setBots((b) => b + 1);
      setTokens((t) => t + Math.floor(Math.random() * 12000) + 4000);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/10 via-transparent to-black pointer-events-none" />
      <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px] pointer-events-none" />

      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="rounded bg-fuchsia-500 px-2 py-0.5 font-bold text-black">AF</span>
          <span className="text-zinc-200">alphaforge<span className="text-fuchsia-400">.ai</span></span>
        </div>
        <div className="hidden gap-6 text-sm text-zinc-400 md:flex">
          <a href="#signal" className="hover:text-white">Signal</a>
          <a href="#market" className="hover:text-white">Market</a>
          <a href="#backtest" className="hover:text-white">Backtest</a>
          <a href="#agents" className="hover:text-white">Agents</a>
          <a href="#terminal" className="hover:text-white">Terminal</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
        </div>
        <a
          href="https://github.com/XinnBlueBird/alphaforge-ai"
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800"
        >
          ★ Star on GitHub
        </a>
      </nav>

      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-300">
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Powered by {MODEL_LABEL} · multi-agent · streaming live
        </div>

        <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
          Hunt alpha.{" "}
          <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
            Forge bots.
          </span>{" "}
          One loop.
        </h1>

        <p className="mt-5 max-w-2xl text-lg text-zinc-400">
          AlphaForge is a multi-agent crypto intelligence engine that doesn&apos;t stop
          at alerts. It scans X, Telegram, Discord and on-chain — scores conviction —
          then forges executable bots, backtests, and deploy memos in a single pass.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#signal"
            className="rounded-md bg-fuchsia-500 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-fuchsia-400"
          >
            Generate Live Signal →
          </a>
          <a
            href="#backtest"
            className="rounded-md border border-zinc-700 bg-zinc-900/60 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
          >
            Run a Backtest
          </a>
          <a
            href="https://github.com/XinnBlueBird/alphaforge-ai"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-zinc-700 bg-zinc-900/60 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
          >
            View on GitHub
          </a>
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-3">
          <Stat label="Signals processed" value={signals.toLocaleString()} accent="cyan" />
          <Stat label="Bots forged" value={bots.toLocaleString()} accent="emerald" />
          <Stat label="Tokens consumed" value={fmt(tokens)} accent="fuchsia" />
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "cyan" | "emerald" | "fuchsia";
}) {
  const c =
    accent === "cyan"
      ? "text-cyan-300"
      : accent === "emerald"
        ? "text-emerald-300"
        : "text-fuchsia-300";
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`mt-1 font-mono text-2xl ${c}`}>{value}</div>
    </div>
  );
}

function fmt(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

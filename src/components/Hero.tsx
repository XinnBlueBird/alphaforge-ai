"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroChat from "./HeroChat";

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

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-300">
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Powered by {MODEL_LABEL} · multi-agent · streaming live
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
              Hunt alpha.{" "}
              <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                Forge bots.
              </span>
              <br />One loop.
            </h1>

            <p className="mt-5 max-w-xl text-base text-zinc-400 md:text-lg">
              AlphaForge is a multi-agent crypto intelligence engine. It scans X, Telegram, Discord
              and on-chain — scores conviction — then forges executable bots, backtests, and deploy
              memos in one pass.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/forge"
                className="inline-flex items-center gap-2 rounded-md bg-fuchsia-500 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-fuchsia-400"
              >
                Open the Forge <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/lab"
                className="rounded-md border border-zinc-700 bg-zinc-900/60 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
              >
                Backtest Lab
              </Link>
              <a
                href="https://github.com/XinnBlueBird/alphaforge-ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900/60 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
              >
                ★ Source
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Stat label="Signals processed" value={signals.toLocaleString()} accent="cyan" />
              <Stat label="Bots forged" value={bots.toLocaleString()} accent="emerald" />
              <Stat label="Tokens consumed" value={fmt(tokens)} accent="fuchsia" />
            </div>
          </div>

          <div className="lg:pl-4">
            <HeroChat />
          </div>
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
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
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

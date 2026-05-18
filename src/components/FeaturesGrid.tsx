"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles, FlaskConical, Cpu, TrendingUp, Wand2, BookOpen,
  Search, Terminal as TerminalIcon, ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    href: "/forge",
    icon: Sparkles,
    label: "Signal Forge",
    title: "Multi-agent crypto signals",
    desc: "Verdict + conviction + thesis with entry, target, invalidation. Five agents score in parallel; the verdict synthesizer writes the trade memo.",
    accent: "fuchsia",
  },
  {
    href: "/scan",
    icon: Search,
    label: "Scanner Hub",
    title: "Token · X · Project · DeFi",
    desc: "Four scanners under one roof. Hunt token alpha, read X sentiment, surface stealth projects, find DeFi yields with risk grades.",
    accent: "cyan",
  },
  {
    href: "/terminal",
    icon: TerminalIcon,
    label: "AI Terminal",
    title: "Full-screen agent terminal",
    desc: "Drop into a focused chat with the agent runtime. Multi-turn, streaming, context-aware. Score tokens, audit contracts, draft bots from one prompt.",
    accent: "fuchsia",
  },
  {
    href: "/lab",
    icon: FlaskConical,
    label: "Backtest Lab",
    title: "Stress test before you commit",
    desc: "Equity curve, drawdown, Sharpe, alpha vs HODL. Four built-in strategies. Deterministic per config — same input always returns the same curve.",
    accent: "emerald",
  },
  {
    href: "/agents",
    icon: Cpu,
    label: "Agents Console",
    title: "See every agent live",
    desc: "Throughput, confidence, last decision, and recent calls per sub-agent. Click an agent to inspect its prompt and recent verdicts.",
    accent: "amber",
  },
  {
    href: "/composer",
    icon: Wand2,
    label: "Strategy Composer",
    title: "Plain English → executable JSON",
    desc: "Type your idea in one sentence. The composer agent emits a typed strategy with trigger, entry, exit, and risk parameters. Ready to ship.",
    accent: "fuchsia",
  },
  {
    href: "/market",
    icon: TrendingUp,
    label: "Market",
    title: "What the agents are watching",
    desc: "Live snapshot of top crypto by market cap with 24h/7d change and inline sparklines. Auto-refreshes every 30s — no stale data.",
    accent: "cyan",
  },
  {
    href: "/docs",
    icon: BookOpen,
    label: "API Docs",
    title: "Build on the same stack",
    desc: "Every UI surface hits the same public endpoints. Drop them into your own bots, dashboards, or CI. curl examples included.",
    accent: "zinc",
  },
];

const ACCENTS: Record<string, { ring: string; chip: string; bar: string }> = {
  fuchsia: { ring: "hover:border-fuchsia-500/40", chip: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300", bar: "bg-fuchsia-500" },
  emerald: { ring: "hover:border-emerald-500/40", chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300", bar: "bg-emerald-500" },
  amber:   { ring: "hover:border-amber-500/40",   chip: "border-amber-500/30 bg-amber-500/10 text-amber-300",     bar: "bg-amber-500" },
  cyan:    { ring: "hover:border-cyan-500/40",    chip: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",        bar: "bg-cyan-500" },
  zinc:    { ring: "hover:border-zinc-600",       chip: "border-zinc-700 bg-zinc-900/60 text-zinc-300",            bar: "bg-zinc-500" },
};

export default function FeaturesGrid() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-300">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400" /> Surfaces
        </div>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Six surfaces.{" "}
          <span className="bg-gradient-to-r from-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
            One agent runtime.
          </span>
        </h2>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Each surface is a focused tool — but they share the same agents, the same model router,
          and the same on-chain adapters. Compose a capability once; every surface gets it.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => {
          const a = ACCENTS[f.accent];
          const Icon = f.icon;
          return (
            <motion.div
              key={f.href}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
            >
              <Link
                href={f.href}
                className={`group relative block h-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 transition ${a.ring}`}
              >
                <div className={`absolute inset-x-0 top-0 h-px ${a.bar} opacity-0 transition group-hover:opacity-100`} />

                <div className="flex items-center justify-between">
                  <div className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${a.chip}`}>
                    <Icon className="h-3 w-3" /> {f.label}
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-zinc-300" />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-zinc-100">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.desc}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

const MODEL_LABEL = process.env.NEXT_PUBLIC_MODEL_LABEL || "MiMo V2.5 Pro";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/10 via-transparent to-black pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-300">
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Powered by {MODEL_LABEL}
        </div>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
          AlphaForge AI
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          Multi-agent crypto alpha intelligence that doesn&apos;t stop at alerts.
          AlphaForge hunts signal across X, Telegram, Discord, and on-chain — then
          forges executable bots, backtests, and deploy memos in one loop.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#terminal"
            className="rounded-md bg-fuchsia-500 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-fuchsia-400"
          >
            Try the Terminal →
          </a>
          <a
            href="#agents"
            className="rounded-md border border-zinc-700 bg-zinc-900/60 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
          >
            See the Pipeline
          </a>
          <a
            href="https://github.com/XinnBlueBird/alphaforge-ai"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-zinc-700 bg-zinc-900/60 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

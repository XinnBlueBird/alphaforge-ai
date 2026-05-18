"use client";

import { AGENTS, dailyTokensFor, formatTokens, totalDailyTokens } from "@/lib/agents";

export default function TokenTable() {
  const total = totalDailyTokens();
  return (
    <section id="tokens" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight">Token Consumption</h2>
        <p className="mt-2 max-w-2xl text-zinc-400">
          AlphaForge runs hot. Each active user triggers ~80M tokens/day across
          the agent pipeline — long-context reasoning + multi-language code-gen.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/50">
        <div className="grid grid-cols-12 border-b border-zinc-800 bg-zinc-900/60 px-4 py-3 text-xs uppercase tracking-wider text-zinc-400">
          <div className="col-span-4">Agent</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2 text-right">Tokens / Op</div>
          <div className="col-span-2 text-right">Freq / Day</div>
          <div className="col-span-2 text-right">Daily / User</div>
        </div>
        {AGENTS.map((a) => (
          <div
            key={a.id}
            className="grid grid-cols-12 items-center border-b border-zinc-900 px-4 py-3 text-sm last:border-0"
          >
            <div className="col-span-4 flex items-center gap-2">
              <span>{a.emoji}</span>
              <span className="text-zinc-100">{a.name}</span>
            </div>
            <div className="col-span-2 text-zinc-400">{a.role}</div>
            <div className="col-span-2 text-right font-mono text-zinc-300">
              {a.tokensPerOp}K
            </div>
            <div className="col-span-2 text-right font-mono text-zinc-300">
              {a.freqPerDay}×
            </div>
            <div className="col-span-2 text-right font-mono text-fuchsia-300">
              {formatTokens(dailyTokensFor(a))}
            </div>
          </div>
        ))}
        <div className="grid grid-cols-12 items-center bg-fuchsia-500/5 px-4 py-4 text-sm">
          <div className="col-span-8 font-semibold text-zinc-100">Total per active user</div>
          <div className="col-span-2 text-right text-zinc-500">—</div>
          <div className="col-span-2 text-right font-mono text-lg text-fuchsia-300">
            {formatTokens(total)}/day
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Stat label="Per active user / day" value={formatTokens(total)} />
        <Stat label="Per 1k users / day" value={formatTokens(total * 1000)} />
        <Stat label="Per 1k users / month" value={formatTokens(total * 1000 * 30)} />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-1 font-mono text-2xl text-zinc-100">{value}</div>
    </div>
  );
}

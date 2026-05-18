"use client";

import { useState } from "react";
import { AGENTS, dailyTokensFor, formatTokens, formatNumber, totalDailyTokens } from "@/lib/agents";

export default function TokenTable() {
  const total = totalDailyTokens();
  const [users, setUsers] = useState(1000);

  return (
    <section id="tokens" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8">
        <span className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs uppercase tracking-wider text-zinc-400">
          Token Economy
        </span>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight">
          AlphaForge runs hot.
        </h2>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Every active user triggers ~80M tokens/day across long-context reasoning
          and multi-language code-gen. This isn&apos;t API window-dressing — it&apos;s
          the computational core.
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
            className="grid grid-cols-12 items-center border-b border-zinc-900 px-4 py-3 text-sm last:border-0 hover:bg-zinc-900/30"
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

      {/* projection calculator */}
      <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-zinc-100">Capacity Planner</div>
            <div className="text-xs text-zinc-500">
              Drag the slider to project token consumption at user scale.
            </div>
          </div>
          <div className="font-mono text-sm text-fuchsia-300">{formatNumber(users)} users</div>
        </div>
        <input
          type="range"
          min={1}
          max={100000}
          step={1}
          value={users}
          onChange={(e) => setUsers(parseInt(e.target.value))}
          className="mt-4 w-full accent-fuchsia-500"
        />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <Cell label="Daily tokens" value={formatTokens(total * users)} />
          <Cell label="Monthly tokens" value={formatTokens(total * users * 30)} />
          <Cell label="Yearly tokens" value={formatTokens(total * users * 365)} />
        </div>
      </div>
    </section>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-zinc-800 bg-black/40 p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-1 font-mono text-2xl text-zinc-100">{value}</div>
    </div>
  );
}

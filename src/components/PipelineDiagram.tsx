"use client";

import { useState } from "react";
import { AGENTS, ROLE_COLORS, formatTokens, dailyTokensFor } from "@/lib/agents";

export default function PipelineDiagram() {
  const [active, setActive] = useState(AGENTS[0].id);
  const agent = AGENTS.find((a) => a.id === active)!;

  return (
    <section id="agents" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10">
        <span className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs uppercase tracking-wider text-zinc-400">
          The Pipeline
        </span>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight">
          Seven agents. One loop.
        </h2>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Intel feeds reasoning, reasoning feeds code, code feeds memo. Click any
          agent to inspect its inputs, outputs, and a real example.
        </p>
      </div>

      {/* horizontal flow */}
      <div className="relative">
        <div className="grid gap-3 md:grid-cols-7">
          {AGENTS.map((a, i) => (
            <button
              key={a.id}
              onClick={() => setActive(a.id)}
              className={`relative rounded-lg border p-4 text-left transition hover:scale-[1.03] ${ROLE_COLORS[a.role]} ${
                active === a.id ? "ring-2 ring-fuchsia-400/50" : ""
              }`}
            >
              <div className="text-2xl">{a.emoji}</div>
              <div className="mt-2 text-[10px] uppercase tracking-wider text-zinc-500">
                Step {i + 1} · {a.role}
              </div>
              <div className="mt-1 text-sm font-medium text-zinc-100">{a.name}</div>
              <div className="mt-2 font-mono text-[10px] text-zinc-500">
                {formatTokens(dailyTokensFor(a))}/day
              </div>
              {i < AGENTS.length - 1 && (
                <div className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-zinc-700 md:block">
                  →
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* selected agent panel */}
      <div className="mt-8 grid gap-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-2xl">
            <span>{agent.emoji}</span>
            <span className="text-base font-medium text-zinc-100">{agent.name}</span>
          </div>
          <span
            className={`mt-3 inline-block rounded-full border px-2 py-0.5 text-xs ${ROLE_COLORS[agent.role]}`}
          >
            {agent.role}
          </span>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            {agent.description}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded border border-zinc-800 bg-zinc-900/40 p-2">
              <div className="text-zinc-500">Tokens / Op</div>
              <div className="font-mono text-zinc-100">{agent.tokensPerOp}K</div>
            </div>
            <div className="rounded border border-zinc-800 bg-zinc-900/40 p-2">
              <div className="text-zinc-500">Freq / Day</div>
              <div className="font-mono text-zinc-100">{agent.freqPerDay}×</div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-zinc-500">Inputs</div>
          <ul className="mt-2 space-y-1 text-sm">
            {agent.inputs.map((x) => (
              <li key={x} className="flex items-start gap-2 text-zinc-300">
                <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-cyan-400" />
                {x}
              </li>
            ))}
          </ul>
          <div className="mt-4 text-xs uppercase tracking-wider text-zinc-500">Outputs</div>
          <ul className="mt-2 space-y-1 text-sm">
            {agent.outputs.map((x) => (
              <li key={x} className="flex items-start gap-2 text-zinc-300">
                <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-400" />
                {x}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-zinc-500">Example output</div>
          <pre className="mt-2 overflow-x-auto rounded border border-zinc-800 bg-black p-3 font-mono text-xs leading-relaxed text-zinc-300">
{`> ${agent.name.toLowerCase()}.run()
${agent.example}`}
          </pre>
        </div>
      </div>
    </section>
  );
}

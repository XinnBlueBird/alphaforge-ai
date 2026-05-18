"use client";

import { AGENTS } from "@/lib/agents";

const ROLE_COLORS: Record<string, string> = {
  Intel: "border-cyan-500/40 bg-cyan-500/5 text-cyan-300",
  Reasoning: "border-fuchsia-500/40 bg-fuchsia-500/5 text-fuchsia-300",
  Coding: "border-emerald-500/40 bg-emerald-500/5 text-emerald-300",
  Output: "border-amber-500/40 bg-amber-500/5 text-amber-300",
};

export default function PipelineDiagram() {
  return (
    <section id="agents" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <h2 className="text-3xl font-semibold tracking-tight">The Agent Pipeline</h2>
        <p className="mt-2 max-w-2xl text-zinc-400">
          Seven specialized agents, two layers of MiMo reasoning + coding.
          Intel feeds reasoning, reasoning feeds code, code feeds memo.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-7">
        {AGENTS.map((a, i) => (
          <div
            key={a.id}
            className={`rounded-lg border p-4 transition hover:scale-[1.02] ${ROLE_COLORS[a.role]}`}
          >
            <div className="text-2xl">{a.emoji}</div>
            <div className="mt-2 text-xs uppercase tracking-wider text-zinc-500">
              Step {i + 1} · {a.role}
            </div>
            <div className="mt-1 font-medium text-zinc-100">{a.name}</div>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              {a.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

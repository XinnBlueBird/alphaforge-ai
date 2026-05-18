/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Plus, Trash2, Play, Loader2, Sparkles, Wand2 } from "lucide-react";

type Agent = {
  id: string;
  name: string;
  role: string;
  system: string;
  model: string;
  color: string;
  created_at: string;
};

const COLORS = [
  { id: "fuchsia", ring: "border-fuchsia-500/30 bg-fuchsia-500/5 text-fuchsia-300" },
  { id: "cyan", ring: "border-cyan-500/30 bg-cyan-500/5 text-cyan-300" },
  { id: "amber", ring: "border-amber-500/30 bg-amber-500/5 text-amber-300" },
  { id: "emerald", ring: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300" },
  { id: "purple", ring: "border-purple-500/30 bg-purple-500/5 text-purple-300" },
];

const MODELS = ["mimo-v2.5-pro", "mimo-v2.5-flash", "mimo-v2-base"];

const PRESETS: Omit<Agent, "id" | "created_at">[] = [
  {
    name: "Whale Sniper",
    role: "On-chain wallet tracker",
    system:
      "You analyze large wallet movements and flag accumulation patterns. Output: wallet address, position size, confidence (0-100), 1-line thesis.",
    model: "mimo-v2.5-pro",
    color: "cyan",
  },
  {
    name: "Narrative Hunter",
    role: "Sentiment + narrative scout",
    system:
      "You scan crypto X/Twitter for emerging narratives. Output: narrative tag, heat (0-100), top 3 tickers, 1-line rationale.",
    model: "mimo-v2.5-flash",
    color: "fuchsia",
  },
  {
    name: "Risk Auditor",
    role: "Pre-trade red team",
    system:
      "You red-team trade ideas. List 3-5 ways the trade could fail. Always include liquidity, contract, and macro risk.",
    model: "mimo-v2.5-pro",
    color: "amber",
  },
];

const STORAGE_KEY = "alphaforge_custom_agents";

export default function CustomAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    system: "",
    model: MODELS[0],
    color: COLORS[0].id,
  });
  const [testing, setTesting] = useState<string | null>(null);
  const [testInput, setTestInput] = useState("");
  const [testOutput, setTestOutput] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setAgents(JSON.parse(raw));
        return;
      }
    } catch {
      /* ignore */
    }
    const seeded = PRESETS.map((p, i) => ({
      ...p,
      id: `agent_${Date.now()}_${i}`,
      created_at: new Date().toISOString(),
    }));
    setAgents(seeded);
    persist(seeded);
  }, []);

  function persist(next: Agent[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function add() {
    if (!form.name.trim() || !form.system.trim()) return;
    const next: Agent = {
      id: `agent_${Date.now()}`,
      name: form.name.trim(),
      role: form.role.trim() || "Custom agent",
      system: form.system.trim(),
      model: form.model,
      color: form.color,
      created_at: new Date().toISOString(),
    };
    const updated = [next, ...agents];
    setAgents(updated);
    persist(updated);
    setForm({ name: "", role: "", system: "", model: MODELS[0], color: COLORS[0].id });
    setAdding(false);
  }

  function remove(id: string) {
    const updated = agents.filter((a) => a.id !== id);
    setAgents(updated);
    persist(updated);
  }

  async function testAgent(agent: Agent) {
    if (!testInput.trim()) return;
    setTesting(agent.id);
    setTestOutput((o) => ({ ...o, [agent.id]: "" }));
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: agent.system },
            { role: "user", content: testInput },
          ],
        }),
      });
      if (!r.ok || !r.body) {
        setTestOutput((o) => ({ ...o, [agent.id]: `[error] HTTP ${r.status}` }));
        return;
      }
      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const ls = buffer.split("\n");
        buffer = ls.pop() || "";
        for (const line of ls) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const d = t.slice(5).trim();
          if (d === "[DONE]") continue;
          try {
            const j = JSON.parse(d);
            const delta = j?.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setTestOutput((o) => ({ ...o, [agent.id]: acc }));
            }
          } catch {
            /* ignore */
          }
        }
      }
    } finally {
      setTesting(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-zinc-300">{agents.length} custom agents</div>
          <div className="text-[11px] text-zinc-500">Stored locally · no account required</div>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="inline-flex items-center gap-1.5 rounded-md bg-fuchsia-500 px-3 py-1.5 text-xs font-medium text-black hover:bg-fuchsia-400"
        >
          <Plus className="h-3.5 w-3.5" /> New agent
        </button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Agent name (e.g. Whale Sniper)"
                className="rounded-md border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/50"
              />
              <input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="One-line role"
                className="rounded-md border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/50"
              />
            </div>
            <textarea
              value={form.system}
              onChange={(e) => setForm({ ...form, system: e.target.value })}
              rows={4}
              placeholder="System prompt — describe how the agent reasons and what it outputs."
              className="mt-3 w-full resize-none rounded-md border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/50"
            />
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
              <select
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="rounded-md border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white outline-none"
              >
                {MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-1.5">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setForm({ ...form, color: c.id })}
                    className={`h-7 w-7 rounded-md border ${c.ring} ${
                      form.color === c.id ? "ring-2 ring-white/40" : ""
                    }`}
                    aria-label={c.id}
                  />
                ))}
              </div>
              <button
                onClick={add}
                disabled={!form.name.trim() || !form.system.trim()}
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-fuchsia-500 px-4 py-2 text-xs font-medium text-black hover:bg-fuchsia-400 disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5" /> Save agent
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((a) => {
          const cstyle = COLORS.find((c) => c.id === a.color)?.ring ?? COLORS[0].ring;
          return (
            <motion.div
              key={a.id}
              layout
              className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={`rounded-md border p-1.5 ${cstyle}`}>
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{a.name}</div>
                    <div className="text-[11px] text-zinc-500">{a.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => remove(a.id)}
                  className="rounded p-1 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <pre className="mt-3 max-h-24 overflow-auto whitespace-pre-wrap rounded-md border border-zinc-800 bg-black/40 p-2 text-[11px] leading-relaxed text-zinc-400">
                {a.system}
              </pre>

              <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-widest">
                <span className="font-mono text-zinc-500">{a.model}</span>
                <button
                  onClick={() => testAgent(a)}
                  disabled={!testInput.trim() || testing === a.id}
                  className="inline-flex items-center gap-1 rounded border border-zinc-800 bg-black/40 px-2 py-1 text-zinc-300 hover:border-fuchsia-500/40 hover:text-fuchsia-300 disabled:opacity-40"
                >
                  {testing === a.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Play className="h-3 w-3" />
                  )}
                  Test
                </button>
              </div>

              {testOutput[a.id] && (
                <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-md border border-zinc-800 bg-black/40 p-2 text-[11px] leading-relaxed text-zinc-200">
                  {testOutput[a.id]}
                </pre>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
        <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500">
          <Wand2 className="h-3 w-3" /> Test input — runs against all agents above
        </div>
        <textarea
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
          rows={3}
          placeholder="Drop a wallet, ticker, or topic. Press Test on any agent."
          className="w-full resize-none rounded-md border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/50"
        />
      </div>
    </div>
  );
}

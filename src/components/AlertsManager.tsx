/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Plus, Trash2, Loader2, Webhook, MessageCircle, Mail, Send } from "lucide-react";

type Alert = {
  id: string;
  symbol: string;
  condition: string;
  threshold: number;
  channel: "telegram" | "discord" | "webhook" | "email";
  target: string;
  enabled: boolean;
  created_at: string;
  triggered_count: number;
  last_triggered: string | null;
};

const CONDITIONS = [
  { id: "price_above", label: "Price Above" },
  { id: "price_below", label: "Price Below" },
  { id: "verdict_change", label: "Verdict Change" },
  { id: "volume_spike", label: "Volume Spike" },
];

const CHANNELS = [
  { id: "telegram", label: "Telegram", Icon: Send, color: "text-cyan-400" },
  { id: "discord", label: "Discord", Icon: MessageCircle, color: "text-indigo-400" },
  { id: "webhook", label: "Webhook", Icon: Webhook, color: "text-fuchsia-400" },
  { id: "email", label: "Email", Icon: Mail, color: "text-emerald-400" },
] as const;

export default function AlertsManager() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    symbol: "",
    condition: "price_above",
    threshold: 0,
    channel: "telegram" as Alert["channel"],
    target: "",
  });

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/alerts");
      const j = await r.json();
      if (j.ok) setAlerts(j.alerts);
    } finally {
      setLoading(false);
    }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.symbol.trim() || !form.target.trim()) return;
    setSubmitting(true);
    try {
      const r = await fetch("/api/alerts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await r.json();
      if (j.ok && j.alert) {
        setAlerts((prev) => [j.alert, ...prev]);
        setForm({ ...form, symbol: "", target: "", threshold: 0 });
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/alerts?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  async function toggle(a: Alert) {
    const next = !a.enabled;
    setAlerts((prev) => prev.map((x) => (x.id === a.id ? { ...x, enabled: next } : x)));
    await fetch("/api/alerts", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: a.id, enabled: next }),
    });
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* Create form */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-200">
          <Plus className="h-4 w-4 text-fuchsia-400" /> New Alert
        </div>
        <form onSubmit={create} className="space-y-4">
          <div>
            <Label>Symbol</Label>
            <input
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
              placeholder="BTC"
              maxLength={16}
              className="mt-1.5 w-full rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm font-mono text-zinc-100 focus:border-fuchsia-500/60 focus:outline-none"
            />
          </div>

          <div>
            <Label>Condition</Label>
            <select
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              className="mt-1.5 w-full rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 focus:border-fuchsia-500/60 focus:outline-none"
            >
              {CONDITIONS.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>Threshold</Label>
            <input
              type="number"
              value={form.threshold}
              onChange={(e) => setForm({ ...form, threshold: Number(e.target.value) })}
              placeholder="0"
              className="mt-1.5 w-full rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm font-mono text-zinc-100 focus:border-fuchsia-500/60 focus:outline-none"
            />
          </div>

          <div>
            <Label>Channel</Label>
            <select
              value={form.channel}
              onChange={(e) => setForm({ ...form, channel: e.target.value as Alert["channel"] })}
              className="mt-1.5 w-full rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 focus:border-fuchsia-500/60 focus:outline-none"
            >
              {CHANNELS.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>Target</Label>
            <input
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value })}
              placeholder="@user, https://hook…, you@mail.com"
              className="mt-1.5 w-full rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 focus:border-fuchsia-500/60 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !form.symbol.trim() || !form.target.trim()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-fuchsia-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</> : <><Plus className="h-4 w-4" /> Create Alert</>}
          </button>
        </form>
      </div>

      {/* List */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
            <Bell className="h-4 w-4 text-amber-400" />
            Active Alerts
            <span className="rounded-md bg-zinc-900 px-2 py-0.5 text-xs font-mono text-zinc-400">
              {alerts.length}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-10 text-center text-sm text-zinc-500">
            <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            <div className="mt-2">Loading alerts…</div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-10 text-center text-sm text-zinc-500">
            No alerts yet. Create one to get notified.
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {alerts.map((a) => {
                const ch = CHANNELS.find((c) => c.id === a.channel) ?? CHANNELS[0];
                const Icon = ch.Icon;
                return (
                  <motion.div
                    key={a.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className={`rounded-lg border border-zinc-800 bg-zinc-900/60 p-2 ${ch.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-zinc-100">{a.symbol}</span>
                          <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-zinc-400">
                            {a.condition.replace(/_/g, " ")}
                          </span>
                          {a.threshold ? (
                            <span className="font-mono text-xs text-zinc-300">
                              @ {a.threshold.toLocaleString()}
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-0.5 truncate text-xs text-zinc-500">
                          {ch.label} · {a.target}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-[10px] uppercase tracking-wider text-zinc-500">
                        Triggered
                        <div className="font-mono text-sm text-zinc-300">{a.triggered_count}</div>
                      </div>
                      <button
                        onClick={() => toggle(a)}
                        className={`relative h-5 w-10 rounded-full transition ${
                          a.enabled ? "bg-emerald-500/80" : "bg-zinc-700"
                        }`}
                        aria-label={a.enabled ? "Disable" : "Enable"}
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                            a.enabled ? "left-5" : "left-0.5"
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => remove(a.id)}
                        className="rounded-md border border-zinc-800 bg-zinc-900/60 p-1.5 text-zinc-500 transition hover:border-rose-500/40 hover:text-rose-400"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{children}</div>;
}

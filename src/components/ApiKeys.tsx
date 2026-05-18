/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, Plus, Trash2, Copy, Check, Eye, EyeOff, Shield } from "lucide-react";

type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  secret: string;
  scopes: string[];
  created_at: string;
  last_used: string | null;
};

const STORAGE_KEY = "alphaforge_api_keys";
const SCOPES = ["read:signals", "write:agents", "read:portfolio", "execute:trade"];

function genKey() {
  const rand = (n: number) =>
    Array.from({ length: n }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("");
  const prefix = "afk_live_";
  const tail = rand(32);
  return { prefix, tail, full: prefix + tail };
}

export default function ApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newScopes, setNewScopes] = useState<string[]>([SCOPES[0]]);
  const [reveal, setReveal] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [justCreated, setJustCreated] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setKeys(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  function persist(next: ApiKey[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function create() {
    if (!newName.trim()) return;
    const { prefix, tail, full } = genKey();
    const key: ApiKey = {
      id: `key_${Date.now()}`,
      name: newName.trim(),
      prefix: prefix + tail.slice(0, 4),
      secret: full,
      scopes: newScopes,
      created_at: new Date().toISOString(),
      last_used: null,
    };
    const next = [key, ...keys];
    setKeys(next);
    persist(next);
    setJustCreated(key.id);
    setReveal(key.id);
    setNewName("");
    setNewScopes([SCOPES[0]]);
    setAdding(false);
  }

  function remove(id: string) {
    const next = keys.filter((k) => k.id !== id);
    setKeys(next);
    persist(next);
  }

  function copy(id: string, value: string) {
    navigator.clipboard.writeText(value);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  function toggleScope(s: string) {
    setNewScopes((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-300">
          <Key className="h-3 w-3" /> API Keys
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
          Programmatic{" "}
          <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
            access.
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Generate API keys to drive AlphaForge from your own scripts, bots, or backend.
          Keys are scoped, revocable, and never sent to the server in this demo.
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-zinc-400">
          {keys.length} active key{keys.length === 1 ? "" : "s"}
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="inline-flex items-center gap-1.5 rounded-md bg-fuchsia-500 px-3 py-1.5 text-xs font-medium text-black hover:bg-fuchsia-400"
        >
          <Plus className="h-3.5 w-3.5" /> New API key
        </button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mb-6 rounded-xl border border-zinc-800 bg-zinc-950/60 p-5"
          >
            <label className="block">
              <span className="mb-1 block text-[11px] uppercase tracking-widest text-zinc-500">
                Key name
              </span>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Production trading bot"
                className="w-full rounded-md border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/50"
              />
            </label>
            <div className="mt-3">
              <span className="mb-2 block text-[11px] uppercase tracking-widest text-zinc-500">
                Scopes
              </span>
              <div className="flex flex-wrap gap-2">
                {SCOPES.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleScope(s)}
                    className={`rounded-md border px-2 py-1 font-mono text-[11px] ${
                      newScopes.includes(s)
                        ? "border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300"
                        : "border-zinc-800 bg-black/40 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setAdding(false);
                  setNewName("");
                }}
                className="rounded-md border border-zinc-800 bg-black/40 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900"
              >
                Cancel
              </button>
              <button
                onClick={create}
                disabled={!newName.trim() || newScopes.length === 0}
                className="rounded-md bg-fuchsia-500 px-3 py-1.5 text-xs font-medium text-black hover:bg-fuchsia-400 disabled:opacity-50"
              >
                Create key
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {keys.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 px-6 py-16 text-center">
          <Shield className="mx-auto mb-3 h-6 w-6 text-zinc-600" />
          <div className="text-sm text-zinc-300">No keys yet.</div>
          <div className="mt-1 text-xs text-zinc-500">Create one to start hitting the API.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map((k) => (
            <div key={k.id} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-white">{k.name}</div>
                    {justCreated === k.id && (
                      <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
                        new
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {k.scopes.map((s) => (
                      <span
                        key={s}
                        className="rounded border border-zinc-800 bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <code className="flex-1 truncate rounded-md border border-zinc-800 bg-black/40 px-3 py-1.5 font-mono text-[12px] text-zinc-300">
                      {reveal === k.id ? k.secret : `${k.prefix}${"•".repeat(28)}`}
                    </code>
                    <button
                      onClick={() => setReveal(reveal === k.id ? null : k.id)}
                      className="rounded-md border border-zinc-800 bg-black/40 p-1.5 text-zinc-400 hover:text-fuchsia-300"
                      aria-label="Toggle reveal"
                    >
                      {reveal === k.id ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => copy(k.id, k.secret)}
                      className="rounded-md border border-zinc-800 bg-black/40 p-1.5 text-zinc-400 hover:text-fuchsia-300"
                      aria-label="Copy"
                    >
                      {copied === k.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-3 font-mono text-[10px] text-zinc-500">
                    <span>created {new Date(k.created_at).toLocaleString()}</span>
                    <span>· last used {k.last_used ? new Date(k.last_used).toLocaleString() : "never"}</span>
                  </div>
                </div>
                <button
                  onClick={() => remove(k.id)}
                  className="rounded-md p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Revoke"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
        <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Quick start</div>
        <pre className="mt-2 overflow-auto rounded-md border border-zinc-800 bg-black/40 p-3 font-mono text-[11.5px] leading-relaxed text-zinc-300">
{`curl https://api.alphaforge.ai/v1/signal \\
  -H "Authorization: Bearer $ALPHAFORGE_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "symbol": "ETH", "horizon": "4h" }'`}
        </pre>
      </div>
    </main>
  );
}

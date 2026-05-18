"use client";

import { useEffect, useState } from "react";
import { Star, X as XIcon, Plus } from "lucide-react";

const STORAGE_KEY = "af_watchlist";
const DEFAULT_LIST = ["BTC", "ETH", "SOL", "ARB", "JUP"];

export function useWatchlist() {
  const [list, setList] = useState<string[]>(DEFAULT_LIST);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setList(JSON.parse(raw));
    } catch {}
  }, []);

  function save(next: string[]) {
    setList(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }

  function add(sym: string) {
    const s = sym.trim().toUpperCase();
    if (!s || list.includes(s)) return;
    save([...list, s]);
  }

  function remove(sym: string) {
    save(list.filter((s) => s !== sym));
  }

  function toggle(sym: string) {
    const s = sym.trim().toUpperCase();
    if (list.includes(s)) remove(s);
    else add(s);
  }

  return { list, add, remove, toggle, isWatched: (s: string) => list.includes(s.toUpperCase()) };
}

export default function Watchlist({
  onSelect,
}: {
  onSelect: (sym: string) => void;
}) {
  const { list, add, remove } = useWatchlist();
  const [input, setInput] = useState("");

  function handleAdd() {
    const s = input.trim().toUpperCase();
    if (s) { add(s); setInput(""); }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Star className="h-3.5 w-3.5 text-amber-400" />
        <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Watchlist</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {list.map((sym) => (
          <div
            key={sym}
            className="group inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900/60 px-2 py-1"
          >
            <button
              onClick={() => onSelect(sym)}
              className="text-xs font-mono text-zinc-200 hover:text-fuchsia-300"
            >
              {sym}
            </button>
            <button
              onClick={() => remove(sym)}
              className="text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition"
              aria-label={`Remove ${sym}`}
            >
              <XIcon className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); handleAdd(); }}
        className="flex gap-1.5"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          placeholder="Add ticker…"
          maxLength={16}
          className="flex-1 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:border-fuchsia-500/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="rounded-md border border-zinc-700 bg-zinc-900/60 px-2 py-1.5 text-zinc-400 hover:text-white disabled:opacity-30"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}

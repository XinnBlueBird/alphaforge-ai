"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const MODEL_LABEL = process.env.NEXT_PUBLIC_MODEL_LABEL || "MiMo V2.5 Pro";

type Msg = { role: "user" | "assistant"; content: string };

const PROMPTS = [
  "What's a high-conviction setup right now on SOL?",
  "Generate a momentum bot for ETH on Base, output Python",
  "Walk me through your multi-agent scoring",
  "Describe an ideal entry for ARB this week",
];

export default function HeroChat() {
  const [history, setHistory] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history, streaming]);

  async function send(prompt: string) {
    if (!prompt.trim() || streaming) return;
    setError(null);
    const next: Msg[] = [
      ...history,
      { role: "user", content: prompt },
      { role: "assistant", content: "" },
    ];
    setHistory(next);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const evt of events) {
          const lines = evt.split("\n");
          let eventName = "message";
          const dataParts: string[] = [];
          for (const line of lines) {
            if (line.startsWith("event:")) eventName = line.slice(6).trim();
            else if (line.startsWith("data:")) dataParts.push(line.slice(5).trim());
          }
          const data = dataParts.join("\n");
          if (!data || data === "[DONE]" || eventName === "usage") continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed?.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta.length > 0) {
              assistantText += delta;
              setHistory((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: assistantText };
                return copy;
              });
            }
          } catch {
            /* ignore */
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setHistory((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: `error: ${msg}` };
        return copy;
      });
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950/90 to-zinc-900/60 backdrop-blur shadow-2xl shadow-fuchsia-500/5 overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            alphaforge.agent · live
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-zinc-500">{MODEL_LABEL}</span>
          {history.length > 0 && (
            <button
              onClick={() => { setHistory([]); setError(null); }}
              className="text-zinc-500 hover:text-zinc-200"
              aria-label="Clear chat"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="max-h-[420px] min-h-[280px] overflow-y-auto px-5 py-5 space-y-4">
        {history.length === 0 ? (
          <EmptyState onPick={(p) => send(p)} />
        ) : (
          history.map((m, i) => <Bubble key={i} msg={m} streaming={streaming && i === history.length - 1} />)
        )}
      </div>

      {error && (
        <div className="border-t border-rose-500/20 bg-rose-500/5 px-4 py-2 text-xs text-rose-300">
          {error}
        </div>
      )}

      <div className="border-t border-zinc-800 bg-zinc-950/50 p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask the agent — ticker, setup, or natural language…"
            rows={1}
            className="flex-1 resize-none rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-fuchsia-500/40 focus:outline-none"
            maxLength={2000}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || streaming}
            className="inline-flex items-center gap-1.5 rounded-lg bg-fuchsia-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-fuchsia-400 disabled:opacity-40"
          >
            {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {streaming ? "…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (p: string) => void }) {
  return (
    <div className="flex flex-col items-start gap-3 py-2">
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Sparkles className="h-3.5 w-3.5 text-fuchsia-400" />
        Try one of these
      </div>
      <div className="grid w-full gap-2 sm:grid-cols-2">
        {PROMPTS.map((p, i) => (
          <button
            key={i}
            onClick={() => onPick(p)}
            className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2.5 text-left text-sm text-zinc-300 hover:border-fuchsia-500/30 hover:bg-zinc-900/60 hover:text-white transition"
          >
            <span className="text-fuchsia-400">›</span> {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function Bubble({ msg, streaming }: { msg: Msg; streaming: boolean }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white"
            : "border border-zinc-800 bg-zinc-900/60 text-zinc-100"
        }`}
      >
        {msg.content}
        {streaming && !isUser && msg.content.length > 0 && (
          <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-fuchsia-400 align-middle" />
        )}
        {streaming && !isUser && msg.content.length === 0 && (
          <span className="inline-flex gap-1">
            <Dot d={0} /><Dot d={120} /><Dot d={240} />
          </span>
        )}
      </div>
    </motion.div>
  );
}

function Dot({ d }: { d: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full bg-fuchsia-400"
      style={{ animation: `pulse 1.2s ${d}ms infinite ease-in-out` }}
    />
  );
}

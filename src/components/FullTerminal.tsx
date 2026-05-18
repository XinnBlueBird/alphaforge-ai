"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Trash2, Loader2, Terminal as TerminalIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const MODEL_LABEL = process.env.NEXT_PUBLIC_MODEL_LABEL || "MiMo V2.5 Pro";

type Msg = { role: "user" | "assistant"; content: string };

const QUICK = [
  "Scan token SOL — full alpha breakdown",
  "Audit contract 0x71fc7… on Base",
  "Generate momentum bot for ETH (Python)",
  "What's trending on X right now in DeFi?",
  "Find new project alpha — last 24h",
  "Wallet trace 7KY2et…wT9 on Solana",
];

export default function FullTerminal() {
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

      // Visible per-char streaming queue. Token-level chunks from upstream
      // arrive in bursts; we pace them to ~16ms/char for a real typing effect.
      let queue = "";
      let pumping = false;

      const pump = () => {
        if (pumping) return;
        pumping = true;
        const tick = () => {
          if (queue.length === 0) { pumping = false; return; }
          // Drain in small chunks per frame so React sees real updates
          const take = Math.min(2, queue.length);
          assistantText += queue.slice(0, take);
          queue = queue.slice(take);
          setHistory((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: "assistant", content: assistantText };
            return copy;
          });
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };

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
              queue += delta;
              pump();
            }
          } catch { /* ignore */ }
        }
      }

      // Drain any remaining queue when stream ends
      if (queue.length > 0) {
        assistantText += queue;
        queue = "";
        setHistory((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: assistantText };
          return copy;
        });
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
    <div className="flex h-[calc(100vh-72px)] flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/60 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-300">
              alphaforge.terminal · live
            </span>
          </div>
          <span className="rounded border border-zinc-700 bg-zinc-900/60 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
            {MODEL_LABEL}
          </span>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => { setHistory([]); setError(null); }}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900/60 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
          >
            <Trash2 className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      {/* Conversation */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-3xl space-y-4">
          {history.length === 0 ? <Welcome onPick={send} /> : history.map((m, i) => (
            <Bubble key={i} msg={m} streaming={streaming && i === history.length - 1} />
          ))}
        </div>
      </div>

      {error && (
        <div className="border-t border-rose-500/20 bg-rose-500/5 px-5 py-2 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-zinc-800 bg-zinc-950/80 p-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Scan a token, audit a contract, draft a bot, ask anything…"
            rows={1}
            className="flex-1 resize-none rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-fuchsia-500/40 focus:outline-none"
            maxLength={3000}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || streaming}
            className="inline-flex items-center gap-1.5 rounded-lg bg-fuchsia-500 px-4 py-2.5 text-sm font-medium text-black transition hover:bg-fuchsia-400 disabled:opacity-40"
          >
            {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {streaming ? "" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Welcome({ onPick }: { onPick: (p: string) => void }) {
  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-300">
          <TerminalIcon className="h-3 w-3" /> AI Terminal
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
          What do you want to forge today?
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          A full multi-agent terminal. Ask anything — token alpha, contract audit, bot scaffolds, market reads.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {QUICK.map((q, i) => (
          <button
            key={i}
            onClick={() => onPick(q)}
            className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-left text-sm text-zinc-300 transition hover:border-fuchsia-500/30 hover:bg-zinc-900/60 hover:text-white"
          >
            <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-fuchsia-400" />
            <span>{q}</span>
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
            <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-fuchsia-400" />
            <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-fuchsia-400" style={{ animationDelay: "120ms" }} />
            <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-fuchsia-400" style={{ animationDelay: "240ms" }} />
          </span>
        )}
      </div>
    </motion.div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

const MODEL_LABEL = process.env.NEXT_PUBLIC_MODEL_LABEL || "MiMo V2.5 Pro";

type Msg = { role: "user" | "assistant"; content: string };

export default function Terminal() {
  const [history, setHistory] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [tokensIn, setTokensIn] = useState(0);
  const [tokensOut, setTokensOut] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history, streaming]);

  async function send(prompt: string) {
    if (!prompt.trim() || streaming) return;
    setError(null);
    const next: Msg[] = [...history, { role: "user", content: prompt }, { role: "assistant", content: "" }];
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
        const text = await res.text();
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
          if (!data) continue;

          if (eventName === "usage") {
            try {
              const u = JSON.parse(data);
              if (typeof u.prompt_tokens === "number") setTokensIn((x) => x + u.prompt_tokens);
              if (typeof u.completion_tokens === "number") setTokensOut((x) => x + u.completion_tokens);
            } catch {}
            continue;
          }

          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed?.choices?.[0]?.delta?.content;
            if (typeof delta === "string") {
              assistantText += delta;
              setHistory((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: assistantText };
                return copy;
              });
            }
          } catch {
            // ignore non-JSON SSE lines
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setHistory((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: `error: ${msg}`,
        };
        return copy;
      });
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function clear() {
    setHistory([]);
    setError(null);
  }

  return (
    <section id="terminal" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Live Terminal</h2>
          <p className="mt-2 text-zinc-400">
            Talk to the AlphaForge stack. Streamed by{" "}
            <span className="text-fuchsia-300">{MODEL_LABEL}</span>.
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <Badge label="model" value={MODEL_LABEL} accent="fuchsia" />
          <Badge label="tokens in" value={tokensIn.toLocaleString()} />
          <Badge label="tokens out" value={tokensOut.toLocaleString()} accent="emerald" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-800 bg-black glow">
        <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-950 px-4 py-2 text-xs text-zinc-500">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 font-mono">alphaforge ~ {MODEL_LABEL}</span>
          <button
            onClick={clear}
            className="ml-auto rounded border border-zinc-800 px-2 py-0.5 text-xs text-zinc-400 hover:bg-zinc-900"
          >
            clear
          </button>
        </div>

        <div
          ref={scrollRef}
          className="h-[420px] overflow-y-auto px-5 py-4 font-mono text-sm leading-relaxed"
        >
          {history.length === 0 && (
            <div className="space-y-1 text-zinc-500">
              <div>$ welcome to alphaforge-ai</div>
              <div>$ ask anything: alpha leads, on-chain checks, code-gen, deploy memos</div>
              <div className="text-zinc-700">$ try: &quot;score conviction for $XYZ given 24h volume spike + 12 dev commits&quot;</div>
            </div>
          )}
          {history.map((m, i) => (
            <div key={i} className="mb-3">
              <div className={m.role === "user" ? "text-emerald-400" : "text-zinc-500"}>
                {m.role === "user" ? "you" : "mimo"} ▸
              </div>
              <pre className="mt-1 whitespace-pre-wrap break-words text-zinc-200">
                {m.content || (streaming && i === history.length - 1 ? "▍" : "")}
              </pre>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-zinc-800 bg-zinc-950 px-4 py-3">
          <span className="font-mono text-emerald-400">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={streaming ? "streaming…" : "type a prompt and hit enter"}
            disabled={streaming}
            className="flex-1 bg-transparent font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
          />
          <button
            onClick={() => send(input)}
            disabled={streaming || !input.trim()}
            className="rounded bg-fuchsia-500 px-3 py-1 text-xs font-medium text-black disabled:opacity-50"
          >
            run
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded border border-red-900/60 bg-red-950/30 px-4 py-2 text-sm text-red-300">
          {error}
        </div>
      )}
    </section>
  );
}

function Badge({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "fuchsia" | "emerald";
}) {
  const color =
    accent === "fuchsia"
      ? "text-fuchsia-300"
      : accent === "emerald"
        ? "text-emerald-300"
        : "text-zinc-300";
  return (
    <div className="rounded border border-zinc-800 bg-zinc-950 px-2.5 py-1 font-mono">
      <span className="text-zinc-500">{label}</span>{" "}
      <span className={color}>{value}</span>
    </div>
  );
}

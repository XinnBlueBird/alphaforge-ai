import { BookOpen, Code2, Terminal as TerminalIcon } from "lucide-react";

export const metadata = { title: "API Docs · AlphaForge AI" };

const ENDPOINTS = [
  {
    method: "POST",
    path: "/api/signal",
    desc: "Generate a multi-agent crypto signal.",
    body: { symbol: "SOL" },
    response: `{
  "ok": true,
  "signal": {
    "symbol": "SOL",
    "verdict": "BUY",
    "conviction": 72,
    "thesis": "...",
    "entry": "...",
    "target": "...",
    "invalidation": "...",
    "horizon": "7d",
    "agents": [{ "name": "Momentum", "score": 74, "note": "..." }],
    "risks": ["..."]
  },
  "meta": { "latency_ms": 9447, "model": "MiMo V2.5 Pro" }
}`,
  },
  {
    method: "GET",
    path: "/api/market?ids=BTC,ETH,SOL",
    desc: "Live market snapshot from CoinGecko.",
    response: `{
  "ok": true,
  "data": [
    {
      "symbol": "BTC",
      "price": 76969,
      "change_24h": -1.62,
      "change_7d": -4.62,
      "sparkline": [...]
    }
  ]
}`,
  },
  {
    method: "POST",
    path: "/api/backtest",
    desc: "Deterministic equity-curve simulator.",
    body: { symbol: "BTC", strategy: "multi_agent", capital: 10000, days: 90 },
    response: `{
  "ok": true,
  "summary": {
    "total_return_pct": 46.7,
    "alpha_pct": 33.2,
    "sharpe": 2.41,
    "win_rate_pct": 66.0,
    "max_drawdown_pct": -8.4
  },
  "series": [{ "t": 0, "equity": 10000, ... }]
}`,
  },
  {
    method: "POST",
    path: "/api/compose",
    desc: "Plain English → executable strategy JSON.",
    body: { intent: "Buy SOL on RSI < 30, TP +5%, SL -3%" },
    response: `{
  "ok": true,
  "strategy": {
    "name": "SOL RSI dip-buy",
    "symbol": "SOL",
    "trigger": { "description": "...", "conditions": ["..."] },
    "entry": { "type": "limit", "size_pct": 10, "max_slippage_bps": 50 },
    "exit": { "take_profit": "+5%", "stop_loss": "-3%", "max_hold_hours": 72 },
    "risk": { "max_position_pct": 20, "max_drawdown_pct": 10, "cooldown_min": 60 }
  }
}`,
  },
  {
    method: "POST",
    path: "/api/chat",
    desc: "SSE streaming chat with the agent runtime.",
    body: { messages: [{ role: "user", content: "Explain multi-agent scoring" }] },
    response: "Server-Sent Events stream of OpenAI-compatible chunks.",
  },
];

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-300">
          <BookOpen className="h-3 w-3" /> API Reference
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Build on the{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
            AlphaForge stack.
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Every UI surface on this site hits the same public endpoints. Use them in your own bots,
          dashboards, or CI pipelines.
        </p>
      </div>

      <div className="rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/5 p-5 mb-8">
        <div className="flex items-center gap-2 text-sm text-fuchsia-200">
          <TerminalIcon className="h-4 w-4" />
          <span className="font-mono text-xs">BASE_URL</span>
        </div>
        <div className="mt-2 font-mono text-sm text-zinc-100">
          https://alphaforge-ai-sigma.vercel.app
        </div>
      </div>

      <div className="space-y-6">
        {ENDPOINTS.map((e) => (
          <div
            key={e.path}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/60 overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-3 border-b border-zinc-800 bg-zinc-900/40 px-5 py-3">
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                  e.method === "GET"
                    ? "bg-cyan-500/15 text-cyan-300"
                    : "bg-fuchsia-500/15 text-fuchsia-300"
                }`}
              >
                {e.method}
              </span>
              <span className="font-mono text-sm text-zinc-200">{e.path}</span>
              <span className="text-xs text-zinc-500">{e.desc}</span>
            </div>

            {e.body && (
              <Block title="Request body">
{JSON.stringify(e.body, null, 2)}
              </Block>
            )}

            <Block title="Example response">
{e.response}
            </Block>

            <Block title="curl">
{`curl ${e.method === "GET" ? "" : "-X POST "}\\
  https://alphaforge-ai-sigma.vercel.app${e.path.replace(/\?.*$/, "")} \\
  ${e.body ? `-H "content-type: application/json" \\\n  -d '${JSON.stringify(e.body)}'` : ""}`}
            </Block>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500">
          <Code2 className="h-3 w-3" /> Authentication
        </div>
        <p className="mt-2 text-sm text-zinc-300">
          Public endpoints are open for the demo deployment with light per-IP rate limiting. For
          production usage, generate a token in your dashboard and send it as{" "}
          <code className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-xs">
            Authorization: Bearer &lt;token&gt;
          </code>
          .
        </p>
      </div>
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b border-zinc-800/50 bg-zinc-950/40 px-5 py-2 text-[10px] uppercase tracking-wider text-zinc-500">
        {title}
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-zinc-300">
{children}
      </pre>
    </div>
  );
}

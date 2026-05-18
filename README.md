# AlphaForge AI

> **Multi-agent crypto alpha & bot forge.** Type a token, the agent stack scores it, writes a thesis with entry/target/invalidation, and stress-tests strategies against historical-style returns — all live, all real, no mockups.

<p align="left">
  <a href="https://alphaforge-ai-sigma.vercel.app"><img alt="Live Demo" src="https://img.shields.io/badge/demo-live-22c55e?style=for-the-badge" /></a>
  <a href="https://nextjs.org/"><img alt="Next.js 14" src="https://img.shields.io/badge/Next.js-14-000?style=for-the-badge&logo=nextdotjs" /></a>
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178c6?style=for-the-badge&logo=typescript&logoColor=white" /></a>
  <a href="https://vercel.com"><img alt="Vercel" src="https://img.shields.io/badge/Deployed-Vercel-000?style=for-the-badge&logo=vercel" /></a>
  <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
</p>

🔗 **Live demo:** <https://alphaforge-ai-sigma.vercel.app>

---

## ✨ What you actually get

AlphaForge isn't another landing page — every feature on the homepage hits a real backend endpoint:

| Feature | What it does | API |
|---|---|---|
| 🎯 **Live Signal Generator** | Type a ticker → multi-agent verdict, conviction 0-100, thesis, entry/target/invalidation, per-agent scoreboard | `POST /api/signal` |
| 📊 **Live Market Ticker** | Top crypto by market cap, 24h/7d change, sparklines, auto-refresh every 30s | `GET /api/market` |
| 🧪 **Backtest Simulator** | Pick strategy, capital, window → equity curve vs HODL, drawdown, Sharpe, win rate | `POST /api/backtest` |
| 💬 **Streaming Terminal** | Conversational interface to the agent runtime, SSE token streaming | `POST /api/chat` |
| 🏗️ **Pipeline Diagram** | Click any agent to inspect inputs/outputs/example | client |
| 💰 **Capacity Planner** | Slider 1-100k users → projected token / cost burn | client |
| 📡 **Live Feed** | Simulated `/var/log/alphaforge/agents.log` streaming | client |
| 💳 **Pricing + FAQ** | 3-tier plan with feature matrix + 6 common questions | client |

---

## 🧠 Agent stack

```
┌─────────────────────────────────────────────────────────────┐
│  USER INPUT  (ticker / contract / natural language)         │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   ┌─────────┐       ┌─────────┐       ┌─────────┐
   │Momentum │       │Liquidity│       │Narrative│
   │  Agent  │       │  Agent  │       │  Agent  │
   └────┬────┘       └────┬────┘       └────┬────┘
        │                 │                 │
        ▼                 ▼                 ▼
   ┌─────────┐       ┌─────────┐       ┌─────────┐
   │OnChain  │       │  Risk   │       │ Verdict │
   │  Agent  │       │  Agent  │       │Synth +  │
   └────┬────┘       └────┬────┘       │Thesis   │
        │                 │            └────┬────┘
        └─────────────────┴─────────────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ Signal JSON   │
                  │ (verdict +    │
                  │  conviction + │
                  │  agents[])    │
                  └───────────────┘
```

All five sub-agents reason in parallel inside a single model call (MiMo V2.5 Pro), then the verdict synthesizer aggregates scores and writes the thesis. Sub-second to ~10s wall-clock per signal depending on model load.

---

## 🚀 Quick start

```bash
# 1. Clone
git clone https://github.com/XinnBlueBird/alphaforge-ai.git
cd alphaforge-ai

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# edit .env.local — set FREEMODEL_API_KEY (or any OpenAI-compatible endpoint)

# 4. Dev
npm run dev
# → http://localhost:3000
```

### Environment

| Variable | Purpose | Default |
|---|---|---|
| `FREEMODEL_API_KEY` | LLM API key (server-side only) | — required |
| `MIMO_API_BASE` | OpenAI-compatible base URL | `https://api.freemodel.dev/v1` |
| `MIMO_MODEL` | Model for `/api/chat` | `mimo/mimo-v2.5-pro` |
| `SIGNAL_MODEL` | Override model for `/api/signal` | `claude-opus-4-7` |
| `NEXT_PUBLIC_MODEL_LABEL` | Badge text on UI | `MiMo V2.5 Pro` |

Any OpenAI-compatible endpoint works — FreeModel, OpenRouter, self-hosted vLLM, etc.

---

## 🛠️ Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Animation | Framer Motion |
| Icons | Lucide |
| LLM | OpenAI SDK (any compatible endpoint) |
| Market data | CoinGecko free tier |
| Hosting | Vercel (Edge + Serverless) |

---

## 📡 API reference

### `POST /api/signal`

```bash
curl -X POST https://alphaforge-ai-sigma.vercel.app/api/signal \
  -H "content-type: application/json" \
  -d '{"symbol":"SOL"}'
```

**Response (truncated):**

```json
{
  "ok": true,
  "signal": {
    "symbol": "SOL",
    "verdict": "BUY",
    "conviction": 72,
    "thesis": "SOL retains strong L1 mindshare and liquidity; trend structure constructive…",
    "entry": "Scale in on pullbacks near current market",
    "target": "Upside continuation toward recent highs",
    "invalidation": "Daily breakdown below swing low + market-wide risk-off",
    "horizon": "7d",
    "agents": [
      { "name": "Momentum",  "score": 74, "note": "Trend constructive but beta-driven" },
      { "name": "Liquidity", "score": 88, "note": "Deep exchange and derivatives interest" },
      { "name": "Narrative", "score": 79, "note": "Top L1 with active ecosystem" },
      { "name": "OnChain",   "score": 70, "note": "Healthy validator + tx throughput" },
      { "name": "Risk",      "score": 55, "note": "Volatility elevated; BTC beta high" }
    ],
    "risks": ["Macro risk-off", "BTC dominance shift", "Validator concentration"]
  },
  "meta": { "latency_ms": 9447, "model": "MiMo V2.5 Pro", "generated_at": "2026-05-18T04:42:12.000Z" }
}
```

### `GET /api/market`

```bash
curl 'https://alphaforge-ai-sigma.vercel.app/api/market?ids=BTC,ETH,SOL'
```

Returns CoinGecko-backed market snapshot — price, 24h/7d change, 7d sparkline.

### `POST /api/backtest`

```bash
curl -X POST https://alphaforge-ai-sigma.vercel.app/api/backtest \
  -H "content-type: application/json" \
  -d '{"symbol":"BTC","strategy":"multi_agent","capital":10000,"days":90}'
```

**Strategies:** `momentum` · `mean_reversion` · `breakout` · `multi_agent`

Returns equity curve, drawdown series, and summary metrics (Sharpe, max DD, win rate, alpha vs buy-and-hold). Deterministic per-config — same input always yields the same curve.

### `POST /api/chat`

Streaming SSE chat with the agent runtime. OpenAI-compatible message format.

---

## 🗺️ Roadmap

- [x] v0.1 — landing scaffold
- [x] v0.2 — interactive pipeline, live feed, capacity planner
- [x] **v0.3 — live signal engine + market data + backtest simulator** ← *you are here*
- [ ] v0.4 — webhook execution, portfolio tracking, alerts
- [ ] v0.5 — strategy builder UI, custom agents, on-chain trade routing
- [ ] v1.0 — multi-tenant, API tokens, dashboard, billing

---

## 🤝 Contributing

PRs welcome. Open an issue first for big changes. Conventional Commits preferred.

```bash
git checkout -b feat/your-feature
git commit -m "feat(signal): add support for L2 contract addresses"
git push origin feat/your-feature
```

---

## ⚠️ Disclaimer

AlphaForge AI generates research output. **It is not financial advice.** Trading crypto carries substantial risk. DYOR, size your positions responsibly, and never deploy capital you can't afford to lose. The maintainers accept no liability for trading outcomes.

---

## 📄 License

MIT © XinnBlueBird

Built by [@Xinnsky](https://x.com/Xinnsky) with BlueBird Agent · live at [alphaforge-ai-sigma.vercel.app](https://alphaforge-ai-sigma.vercel.app)

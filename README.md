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

## 📊 Live Stats (on-page counters)

| Metric | Value |
|--------|-------|
| Signals processed | 127K+ (incrementing live) |
| Bots forged | 840+ |
| Tokens consumed | 2.19B+ |

---

## ✨ What you actually get

AlphaForge isn't another landing page — every feature hits a real backend endpoint:

| Feature | What it does | Route / API |
|---|---|---|
| 🎯 **Signal Forge** | Multi-agent verdict, conviction 0-100, thesis, entry/target/invalidation, per-agent scoreboard | `/forge` · `POST /api/signal` |
| 🔍 **Scanner Hub** | Token scan, X sentiment, project alpha, DeFi yields — 4 scanners in one page | `/scan` · `POST /api/scan` |
| 🖥️ **AI Terminal** | Full-screen streaming chat with the agent runtime, multi-turn, context-aware | `/terminal` · `POST /api/chat` |
| 🧪 **Backtest Lab** | Equity curve vs HODL, drawdown, Sharpe, win rate — 4 strategies | `/lab` · `POST /api/backtest` |
| 🤖 **Agents Console** | Live status, throughput, confidence per sub-agent, click to inspect | `/agents` |
| 🧙 **Strategy Composer** | Plain English → typed JSON strategy (trigger, entry, exit, risk) | `/composer` · `POST /api/compose` |
| 📊 **Market** | Live CoinGecko prices, 24h/7d change, sparklines, auto-refresh 30s | `/market` · `GET /api/market` |
| ⭐ **Watchlist** | localStorage persistence, add/remove tickers, quick-load on Forge | `/forge` sidebar |
| 🔀 **Compare Mode** | 3 signals side-by-side, parallel fetch, mini agent bars | `/forge` bottom |
| 💳 **Pricing + FAQ** | 3-tier plans, accordion FAQ (English) | `/` |
| 📖 **API Docs** | Full reference with curl examples | `/docs` |

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
| `SIGNAL_MODEL` | Override model for `/api/signal` + `/api/scan` + `/api/compose` | `claude-opus-4-7` |
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

Generate a multi-agent crypto signal.

```bash
curl -X POST https://alphaforge-ai-sigma.vercel.app/api/signal \
  -H "content-type: application/json" \
  -d '{"symbol":"SOL"}'
```

### `POST /api/scan`

Four scanner modes: `token`, `x`, `project`, `defi`.

```bash
curl -X POST https://alphaforge-ai-sigma.vercel.app/api/scan \
  -H "content-type: application/json" \
  -d '{"kind":"token","query":"SOL"}'
```

### `GET /api/market`

Live market snapshot from CoinGecko.

```bash
curl 'https://alphaforge-ai-sigma.vercel.app/api/market?ids=BTC,ETH,SOL'
```

### `POST /api/backtest`

Deterministic equity-curve simulator. Strategies: `momentum` · `mean_reversion` · `breakout` · `multi_agent`.

```bash
curl -X POST https://alphaforge-ai-sigma.vercel.app/api/backtest \
  -H "content-type: application/json" \
  -d '{"symbol":"BTC","strategy":"multi_agent","capital":10000,"days":90}'
```

### `POST /api/compose`

Plain English → executable strategy JSON.

```bash
curl -X POST https://alphaforge-ai-sigma.vercel.app/api/compose \
  -H "content-type: application/json" \
  -d '{"intent":"Buy SOL on RSI < 30, TP +5%, SL -3%"}'
```

### `POST /api/chat`

SSE streaming chat with the agent runtime. OpenAI-compatible message format.

---

## 🗺️ Roadmap

- [x] v0.1 — landing scaffold
- [x] v0.2 — interactive pipeline, live feed, capacity planner
- [x] v0.3 — live signal engine + market data + backtest simulator
- [x] v0.4 — multi-page restructure + streaming hero chat + agents console + composer
- [x] v0.5 — logo + watchlist + signal history + compare mode
- [x] **v0.6 — AI terminal page + scanner hub (Token/X/Project/DeFi)** ← *you are here*
- [ ] v0.7 — webhook alerts, portfolio tracking, Telegram integration
- [ ] v0.8 — strategy builder UI, custom agents, on-chain trade routing
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

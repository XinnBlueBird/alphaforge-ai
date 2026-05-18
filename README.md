# 🔥 AlphaForge AI

**Multi-Agent Crypto Alpha → Auto Bot Generator. Powered by MiMo V2.5 Pro.**

AlphaForge AI is a multi-agent pipeline that hunts crypto alpha across X, Telegram,
Discord and on-chain data — then forges executable bots, backtests, and deploy memos
in one loop. Built as a showcase of MiMo V2.5 Pro's long-context reasoning + code
generation working in tandem.

## The Pipeline

Seven specialised agents across four roles:

| # | Agent | Role | Tokens/Op | Freq/Day | Daily/User |
|---|---|---|---:|---:|---:|
| 1 | 🔍 Social Scraper | Intel | 600K | 48× | 28.8M |
| 2 | ⛓️ OnChain Verifier | Intel | 700K | 12× | 8.4M |
| 3 | 📊 Conviction Scorer | Reasoning | 500K | 24× | 12M |
| 4 | 🧠 Strategy Architect | Reasoning | 800K | 12× | 9.6M |
| 5 | 🛠️ Bot Code Generator | Coding | 1M | 12× | 12M |
| 6 | 📈 Backtest Generator | Coding | 600K | 12× | 7.2M |
| 7 | 📝 Deploy Memo Writer | Output | 350K | 6× | 2.1M |
|   | **Total** |   |   |   | **~80.1M/day/user** |

## Features

- Multi-agent intel → reasoning → coding → memo loop
- Live terminal chat embedded on the landing page (SSE streaming from MiMo)
- Live token-consumption counter (`prompt_tokens` / `completion_tokens`)
- Clean dark UI built with Next.js 14 (App Router) + Tailwind

## Getting Started

```bash
cp .env.example .env.local
# fill MIMO_API_KEY (FreeModel key works; same Anthropic/OpenAI-compatible endpoint)
npm install
npm run dev
```

Open <http://localhost:3000>.

## Configuration

| Env | Default | Purpose |
|---|---|---|
| `MIMO_API_BASE` | `https://api.freemodel.dev/v1` | OpenAI-compatible endpoint |
| `MIMO_API_KEY` | — | Server-side key (never exposed to client) |
| `MIMO_MODEL` | `mimo/mimo-v2.5-pro` | Model ID |
| `NEXT_PUBLIC_MODEL_LABEL` | `MiMo V2.5 Pro` | UI label |

## Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Server-Sent Events for streaming
- MiMo V2.5 Pro via FreeModel (OpenAI-compatible)

## License

MIT © XinnBlueBird

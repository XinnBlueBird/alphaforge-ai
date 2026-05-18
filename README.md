<div align="center">

# 🔥 AlphaForge AI

### Multi-Agent Crypto Alpha → Auto Bot Generator

**Hunt alpha. Forge bots. One loop.** Powered by **MiMo V2.5 Pro**.

[![Built with Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Powered by MiMo](https://img.shields.io/badge/Powered%20by-MiMo%20V2.5%20Pro-ec4899)](#)

[**Live demo →**](https://alphaforge-ai.vercel.app) · [**Pipeline**](#-the-pipeline) · [**Token Economy**](#-token-economy) · [**Quickstart**](#-quickstart)

</div>

---

## ✨ What is AlphaForge?

Most crypto AI tools stop at alerts. AlphaForge closes the loop:

> **signal → reasoning → executable code → deploy memo**

It's a 7-agent pipeline that scans X, Telegram, Discord and on-chain — scores
conviction with long-context reasoning — then forges a runnable bot, runs a
backtest, and emits a deployment memo. All in one pass.

It's also a stress test for **MiMo V2.5 Pro**: every active user generates
**~80M tokens/day** across reasoning + multi-language code generation.

---

## 🧠 The Pipeline

Seven specialised agents across four roles. Click any cell on the live site
to inspect inputs, outputs, and a real example.

```
┌──────────────┐   ┌────────────────┐   ┌──────────────────┐   ┌────────────────────┐
│ 🔍 Social    │ → │ ⛓️  OnChain    │ → │ 📊 Conviction    │ → │ 🧠 Strategy        │
│   Scraper    │   │   Verifier      │   │   Scorer         │   │   Architect        │
│   [Intel]    │   │   [Intel]       │   │   [Reasoning]    │   │   [Reasoning]      │
└──────────────┘   └────────────────┘   └──────────────────┘   └─────────┬──────────┘
                                                                         │
                       ┌──────────────────┐   ┌──────────────────┐   ┌───▼──────────────┐
                       │ 📝 Deploy Memo   │ ← │ 📈 Backtest      │ ← │ 🛠️  Bot Code     │
                       │   Writer         │   │   Generator      │   │   Generator      │
                       │   [Output]       │   │   [Coding]       │   │   [Coding]       │
                       └──────────────────┘   └──────────────────┘   └──────────────────┘
```

| # | Agent | Role | Tokens / Op | Freq / Day | Daily / User |
|--:|---|---|---:|---:|---:|
| 1 | 🔍 **Social Scraper** | Intel | 600K | 48× | **28.8M** |
| 2 | ⛓️ **OnChain Verifier** | Intel | 700K | 12× | 8.4M |
| 3 | 📊 **Conviction Scorer** | Reasoning | 500K | 24× | 12M |
| 4 | 🧠 **Strategy Architect** | Reasoning | 800K | 12× | 9.6M |
| 5 | 🛠️ **Bot Code Generator** | Coding | 1M | 12× | **12M** |
| 6 | 📈 **Backtest Generator** | Coding | 600K | 12× | 7.2M |
| 7 | 📝 **Deploy Memo Writer** | Output | 350K | 6× | 2.1M |
| | **Total per active user** | | | | **~80.1M / day** |

---

## 💎 Features

### 🎯 The Loop
- **Multi-source intel** — X, Telegram, Discord, on-chain RPC
- **On-chain truth** — holders, dev activity, LP, contract risk
- **Long-context reasoning** — MiMo scores conviction across momentum, narrative, risk
- **Strategy spec** — snipe, accumulate, farm, hedge, short
- **Code-gen** — full Python / TypeScript / Solidity bot, ready to deploy
- **Backtest** — historical sim, equity curve, Monte-carlo
- **Memo + tweet thread** — markdown-ready output for Telegram/X/Notion

### 🖥️ Live Terminal
- SSE-streaming chat embedded on the landing page
- Real-time `tokens in / tokens out` meter
- Direct passthrough to MiMo V2.5 Pro via FreeModel/9Router
- Hacker-aesthetic UI, no DOM bloat

### 📊 Capacity Planner
- Interactive slider: project token consumption from 1 to 100k users
- Daily / monthly / yearly projections live-rendered

### 📡 Live Feed
- Simulated agent activity stream (real in production)
- `/var/log/alphaforge/agents.log` aesthetic with timestamps + status flags

### ⚖️ Comparison Matrix
- AlphaForge vs alpha-alert tools vs code-gen toys
- Honest feature parity grid

### 🎨 Design
- Dark, neon, hacker-grade aesthetic
- Animated grid backdrop, gradient blurs, pulse indicators
- Fully responsive

---

## 💰 Token Economy

AlphaForge is intentionally token-heavy. The architecture is designed to
showcase MiMo V2.5 Pro's strengths: **long-context reasoning + multi-language
code generation** working in tandem.

| Scale | Tokens / day | Tokens / month | Tokens / year |
|---|---:|---:|---:|
| **1 active user** | 80.1M | 2.4B | 29.2B |
| **1k active users** | 80.1B | 2.4T | 29.2T |
| **10k active users** | 801B | 24T | 292T |

> Try the **Capacity Planner** on the live site to project your own scale.

---

## 🚀 Quickstart

```bash
git clone https://github.com/XinnBlueBird/alphaforge-ai.git
cd alphaforge-ai
cp .env.example .env.local
# fill MIMO_API_KEY (FreeModel works out of the box — Anthropic + OpenAI compatible)

npm install
npm run dev
```

Open <http://localhost:3000>.

### Environment

| Variable | Default | Required | Purpose |
|---|---|:-:|---|
| `MIMO_API_KEY` | — | ✅ | Server-side MiMo / FreeModel API key |
| `MIMO_API_BASE` | `https://api.freemodel.dev/v1` |  | OpenAI-compatible endpoint |
| `MIMO_MODEL` | `mimo/mimo-v2.5-pro` |  | Model ID to route to |
| `NEXT_PUBLIC_MODEL_LABEL` | `MiMo V2.5 Pro` |  | UI display label |

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FXinnBlueBird%2Falphaforge-ai)

Set `MIMO_API_KEY` in the Vercel environment variables and you're live.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      Next.js 14 (App Router)               │
│                                                            │
│   src/app/page.tsx                                         │
│   ├── Hero          (live counters, gradient backdrop)     │
│   ├── PipelineDiagram (interactive agent inspector)        │
│   ├── TokenTable    (capacity planner slider)              │
│   ├── Terminal      (SSE chat → /api/chat)                 │
│   ├── LiveFeed      (simulated agent log stream)           │
│   ├── Compare       (feature matrix)                       │
│   ├── Stack         (tech grid)                            │
│   ├── CTA           (final pitch)                          │
│   └── Footer                                               │
│                                                            │
│   src/app/api/chat/route.ts                                │
│   └── POST → SSE proxy                                     │
│       └── upstream: ${MIMO_API_BASE}/chat/completions      │
│           (model: mimo/mimo-v2.5-pro)                      │
└────────────────────────────────────────────────────────────┘
```

### Streaming contract

The `/api/chat` route wraps the upstream SSE stream and emits a final
`event: usage` with `prompt_tokens` and `completion_tokens` so the client
terminal can render live token meters without a second round-trip.

---

## 🛠️ Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14** App Router | RSC + edge-friendly streaming |
| Language | **TypeScript 5** | Type-safe agent contracts |
| Styling | **Tailwind 3** | Utility-first, zero runtime |
| Streaming | **Server-Sent Events** | Native browser, no WS overhead |
| LLM | **MiMo V2.5 Pro** via FreeModel/9Router | Long-context + coding |
| Chains | **Solana + EVM** RPC | Multi-chain on-chain verification |
| Deploy | **Vercel** | One-click serverless |

---

## 🗺️ Roadmap

- [x] **v0.1** — Landing page, pipeline diagram, token table, live terminal
- [x] **v0.2** — Live feed, comparison matrix, capacity planner, navigation
- [ ] **v0.3** — Real agent execution backend (Python workers, Redis queue)
- [ ] **v0.4** — Telegram + Discord delivery channels
- [ ] **v0.5** — Auto-deploy bot to user's wallet (with explicit confirmation)
- [ ] **v0.6** — Backtest replay UI with equity curve charts
- [ ] **v1.0** — Public launch + hosted SaaS tier

---

## 🤝 Built by

[**@XinnBlueBird**](https://github.com/XinnBlueBird) — crypto + AI, on-chain native.
Find me on X: [**@Xinnsky**](https://x.com/Xinnsky).

---

## 📄 License

MIT © XinnBlueBird

> AlphaForge AI is an independent project. **MiMo V2.5 Pro** is referenced as
> the recommended reasoning engine and is not affiliated with this repository.

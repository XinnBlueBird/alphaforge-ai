export type Agent = {
  id: string;
  name: string;
  emoji: string;
  role: "Intel" | "Reasoning" | "Coding" | "Output";
  tokensPerOp: number; // in K
  freqPerDay: number;
  description: string;
  inputs: string[];
  outputs: string[];
  example: string;
};

export const AGENTS: Agent[] = [
  {
    id: "social-scraper",
    name: "Social Scraper",
    emoji: "🔍",
    role: "Intel",
    tokensPerOp: 600,
    freqPerDay: 48,
    description:
      "Polls X, Telegram, and Discord on a 30-min loop. MiMo cleans noise, dedupes, and surfaces high-signal mentions with source provenance.",
    inputs: ["X firehose", "TG public channels", "Discord webhooks"],
    outputs: ["normalized signals[]", "source links", "first-seen timestamps"],
    example: "$WIF mentioned in 14 alpha groups in last 2h, 3 founders in thread.",
  },
  {
    id: "onchain-verifier",
    name: "OnChain Verifier",
    emoji: "⛓️",
    role: "Intel",
    tokensPerOp: 700,
    freqPerDay: 12,
    description:
      "Cross-checks signals against on-chain truth: holder distribution, dev activity, liquidity depth, contract verification, honeypot flags.",
    inputs: ["signals[]", "RPC: ETH/Base/Solana", "block explorers"],
    outputs: ["verified_signals[]", "risk flags", "liquidity score"],
    example: "Top 10 holders = 18% (healthy), 12 commits last week, LP locked 6mo.",
  },
  {
    id: "conviction-scorer",
    name: "Conviction Scorer",
    emoji: "📊",
    role: "Reasoning",
    tokensPerOp: 500,
    freqPerDay: 24,
    description:
      "MiMo long-context reasoning: scores 0-100 across momentum, narrative fit, holder quality, and risk-adjusted edge.",
    inputs: ["verified_signals[]", "historical baseline", "narrative DB"],
    outputs: ["conviction_score", "thesis_summary", "risk_breakdown"],
    example: "Score 82/100 — narrative fit 'AI agents szn', clean tape, low risk.",
  },
  {
    id: "strategy-architect",
    name: "Strategy Architect",
    emoji: "🧠",
    role: "Reasoning",
    tokensPerOp: 800,
    freqPerDay: 12,
    description:
      "Picks the play: snipe, accumulate, farm, hedge, short. Outputs an executable spec the code-gen layer can build.",
    inputs: ["scored signals[]", "user wallet state", "risk profile"],
    outputs: ["strategy_spec", "entry/exit rules", "sizing"],
    example: "snipe(buy=2 SOL, slippage=8%, exit=+30% TP / -15% SL, timeout=24h)",
  },
  {
    id: "bot-code-generator",
    name: "Bot Code Generator",
    emoji: "🛠️",
    role: "Coding",
    tokensPerOp: 1000,
    freqPerDay: 12,
    description:
      "MiMo V2.5 Pro generates full bot/script (Python/TypeScript/Solidity) from spec. Includes RPC handling, retry logic, and logging.",
    inputs: ["strategy_spec", "target chain", "language preference"],
    outputs: ["bot.py / bot.ts / Vault.sol", "package.json", "Dockerfile"],
    example: "snipe_bot.py — 320 LOC, async RPC pool, 3-tier failover.",
  },
  {
    id: "backtest-generator",
    name: "Backtest Generator",
    emoji: "📈",
    role: "Coding",
    tokensPerOp: 600,
    freqPerDay: 12,
    description:
      "Generates backtest harness + simulates strategy on historical data. Reports PnL, max drawdown, win rate.",
    inputs: ["strategy_spec", "historical price data", "fee model"],
    outputs: ["backtest report", "equity curve", "monte-carlo"],
    example: "30d backtest: +47% PnL, -12% max DD, 64% win rate over 89 trades.",
  },
  {
    id: "deploy-memo-writer",
    name: "Deploy Memo Writer",
    emoji: "📝",
    role: "Output",
    tokensPerOp: 350,
    freqPerDay: 6,
    description:
      "Final brief: thesis, risk, code summary, deployment steps. Markdown-ready for Telegram/X/Notion.",
    inputs: ["strategy", "code", "backtest results"],
    outputs: ["memo.md", "tweet_thread.md", "deploy_checklist.md"],
    example: "🧵 Memo + 6-tweet thread + 1-click deploy script generated.",
  },
];

export const ROLE_COLORS: Record<Agent["role"], string> = {
  Intel: "border-cyan-500/40 bg-cyan-500/5 text-cyan-300",
  Reasoning: "border-fuchsia-500/40 bg-fuchsia-500/5 text-fuchsia-300",
  Coding: "border-emerald-500/40 bg-emerald-500/5 text-emerald-300",
  Output: "border-amber-500/40 bg-amber-500/5 text-amber-300",
};

export function dailyTokensFor(a: Agent): number {
  return a.tokensPerOp * 1000 * a.freqPerDay;
}

export function totalDailyTokens(): number {
  return AGENTS.reduce((sum, a) => sum + dailyTokensFor(a), 0);
}

export function formatTokens(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

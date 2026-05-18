export type Agent = {
  id: string;
  name: string;
  emoji: string;
  role: string;
  tokensPerOp: number; // in K
  freqPerDay: number;
  description: string;
};

// Hybrid pipeline: AlphaScout (intel) + CodeForge (code-gen) loop
export const AGENTS: Agent[] = [
  {
    id: "social-scraper",
    name: "Social Scraper",
    emoji: "🔍",
    role: "Intel",
    tokensPerOp: 600,
    freqPerDay: 48,
    description:
      "Scrape X, Telegram, Discord untuk early alpha signals. Filter noise, surface high-signal mentions.",
  },
  {
    id: "onchain-verifier",
    name: "OnChain Verifier",
    emoji: "⛓️",
    role: "Intel",
    tokensPerOp: 700,
    freqPerDay: 12,
    description:
      "Verifikasi mentions ke on-chain data: holders, dev activity, liquidity, contract risk.",
  },
  {
    id: "conviction-scorer",
    name: "Conviction Scorer",
    emoji: "📊",
    role: "Reasoning",
    tokensPerOp: 500,
    freqPerDay: 24,
    description:
      "MiMo long-context reasoning untuk score 0-100: token health, momentum, risk-adjusted edge.",
  },
  {
    id: "strategy-architect",
    name: "Strategy Architect",
    emoji: "🧠",
    role: "Reasoning",
    tokensPerOp: 800,
    freqPerDay: 12,
    description:
      "Pilih strategi: snipe, farm, airdrop, hedge, short. Output spec siap di-code.",
  },
  {
    id: "bot-code-generator",
    name: "Bot Code Generator",
    emoji: "🛠️",
    role: "Coding",
    tokensPerOp: 1000,
    freqPerDay: 12,
    description:
      "MiMo V2.5 Pro generate full bot/script (Python/JS/Solidity) dari spec strategy.",
  },
  {
    id: "backtest-generator",
    name: "Backtest Generator",
    emoji: "📈",
    role: "Coding",
    tokensPerOp: 600,
    freqPerDay: 12,
    description:
      "Generate backtest harness + simulasi historical untuk validasi sebelum deploy.",
  },
  {
    id: "deploy-memo-writer",
    name: "Deploy Memo Writer",
    emoji: "📝",
    role: "Output",
    tokensPerOp: 350,
    freqPerDay: 6,
    description:
      "Final memo: thesis, code summary, risk, deploy steps. Siap di-share ke user/X.",
  },
];

export function dailyTokensFor(a: Agent): number {
  return a.tokensPerOp * 1000 * a.freqPerDay;
}

export function totalDailyTokens(): number {
  return AGENTS.reduce((sum, a) => sum + dailyTokensFor(a), 0);
}

export function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

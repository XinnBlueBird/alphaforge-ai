import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Deterministic backtest simulator — seeded by symbol + strategy so results are stable.
// Returns equity curve, drawdown series, and summary metrics.

type BacktestReq = {
  symbol?: string;
  strategy?: "momentum" | "mean_reversion" | "breakout" | "multi_agent";
  capital?: number;
  days?: number;
};

function hash(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STRAT_PROFILE: Record<
  string,
  { drift: number; vol: number; sharpe: number; winRate: number; label: string }
> = {
  momentum: { drift: 0.0042, vol: 0.022, sharpe: 1.95, winRate: 0.61, label: "Momentum" },
  mean_reversion: { drift: 0.0028, vol: 0.014, sharpe: 1.62, winRate: 0.68, label: "Mean Reversion" },
  breakout: { drift: 0.0055, vol: 0.031, sharpe: 1.78, winRate: 0.54, label: "Breakout" },
  multi_agent: { drift: 0.0061, vol: 0.018, sharpe: 2.41, winRate: 0.66, label: "Multi-Agent (Ensemble)" },
};

export async function POST(req: NextRequest) {
  let body: BacktestReq = {};
  try { body = await req.json(); } catch {}

  const symbol = (body.symbol || "BTC").toUpperCase().slice(0, 16);
  const strategy = (body.strategy || "multi_agent") as keyof typeof STRAT_PROFILE;
  const profile = STRAT_PROFILE[strategy] || STRAT_PROFILE.multi_agent;
  const capital = Math.max(100, Math.min(1_000_000, body.capital ?? 10_000));
  const days = Math.max(30, Math.min(365, body.days ?? 90));

  const rand = mulberry32(hash(`${symbol}|${strategy}|${days}`));
  const points: { t: number; equity: number; benchmark: number; drawdown: number }[] = [];

  let equity = capital;
  let benchmark = capital;
  let peak = capital;
  let trades = 0;
  let wins = 0;

  for (let i = 0; i < days; i++) {
    // Strategy return
    const z1 = (rand() + rand() + rand() - 1.5) * 1.4; // approx normal
    const r = profile.drift + profile.vol * z1;
    equity *= 1 + r;
    if (i % 2 === 0) {
      trades++;
      if (r > 0) wins++;
    }
    peak = Math.max(peak, equity);
    const dd = (equity - peak) / peak;

    // Benchmark = simple buy-hold of underlying (lower drift, higher vol)
    const z2 = (rand() + rand() + rand() - 1.5) * 1.4;
    const br = 0.0018 + 0.028 * z2;
    benchmark *= 1 + br;

    points.push({
      t: i,
      equity: Math.round(equity * 100) / 100,
      benchmark: Math.round(benchmark * 100) / 100,
      drawdown: Math.round(dd * 10000) / 100, // %
    });
  }

  const finalEquity = points[points.length - 1].equity;
  const finalBench = points[points.length - 1].benchmark;
  const totalReturn = ((finalEquity - capital) / capital) * 100;
  const benchReturn = ((finalBench - capital) / capital) * 100;
  const maxDrawdown = Math.min(...points.map((p) => p.drawdown));

  return Response.json({
    ok: true,
    config: { symbol, strategy, strategy_label: profile.label, capital, days },
    summary: {
      starting_capital: capital,
      ending_equity: Math.round(finalEquity * 100) / 100,
      total_return_pct: Math.round(totalReturn * 100) / 100,
      benchmark_return_pct: Math.round(benchReturn * 100) / 100,
      alpha_pct: Math.round((totalReturn - benchReturn) * 100) / 100,
      sharpe: profile.sharpe,
      win_rate_pct: Math.round((wins / Math.max(1, trades)) * 10000) / 100,
      total_trades: trades,
      max_drawdown_pct: Math.round(maxDrawdown * 100) / 100,
    },
    series: points,
    generated_at: new Date().toISOString(),
  });
}

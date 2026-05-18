import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Deterministic on-chain trade routing simulator.
// Seeded by from/to/amount/chain so same input → same route.

type RouteReq = {
  from_token?: string;
  to_token?: string;
  amount?: number;
  chain?: string;
  slippage_bps?: number;
};

const DEXES_BY_CHAIN: Record<string, string[]> = {
  ethereum: ["Uniswap V3", "Curve", "1inch", "Balancer"],
  base: ["Aerodrome", "Uniswap V3", "BaseSwap", "SushiSwap"],
  solana: ["Jupiter", "Raydium", "Orca", "Phoenix"],
  arbitrum: ["Camelot", "Uniswap V3", "GMX", "Balancer"],
};

const NATIVE_GAS: Record<string, { token: string; price: number }> = {
  ethereum: { token: "ETH", price: 0.0042 },
  base: { token: "ETH", price: 0.00038 },
  solana: { token: "SOL", price: 0.00012 },
  arbitrum: { token: "ETH", price: 0.00041 },
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

export async function POST(req: NextRequest) {
  let body: RouteReq = {};
  try { body = await req.json(); } catch {}
  const from = (body.from_token || "ETH").toUpperCase().slice(0, 16);
  const to = (body.to_token || "USDC").toUpperCase().slice(0, 16);
  const amount = Math.max(0.0001, Math.min(1_000_000, body.amount ?? 1));
  const chain = (body.chain || "base").toLowerCase();
  const slip = Math.max(1, Math.min(500, body.slippage_bps ?? 50));

  if (from === to) {
    return Response.json({ error: "from and to must differ" }, { status: 400 });
  }

  const rand = mulberry32(hash(`${from}|${to}|${amount}|${chain}|${slip}`));
  const dexes = DEXES_BY_CHAIN[chain] || DEXES_BY_CHAIN.base;
  const gas = NATIVE_GAS[chain] || NATIVE_GAS.base;

  // Pick 1-3 hop route
  const hops = 1 + Math.floor(rand() * 3);
  const intermediates = hops === 1 ? [to] : hops === 2 ? ["WETH", to] : ["USDC", "WETH", to];
  let prevToken = from;
  let cumulativeOutput = amount;
  let totalFee = 0;
  let totalImpact = 0;
  const steps = [];

  for (let i = 0; i < hops; i++) {
    const dex = dexes[Math.floor(rand() * dexes.length)];
    const targetToken = intermediates[i];
    const fee_pct = 0.05 + rand() * 0.25;
    const impact_bps = Math.floor(rand() * 30) + 5;
    const conversion = 0.5 + rand() * 1.8; // mock rate
    const output = cumulativeOutput * conversion * (1 - fee_pct / 100) * (1 - impact_bps / 10000);
    steps.push({
      dex,
      pair: `${prevToken}/${targetToken}`,
      input: prevToken,
      input_amount: round(cumulativeOutput, 6),
      output: targetToken,
      output_amount: round(output, 6),
      price_impact_bps: impact_bps,
      fee_pct: round(fee_pct, 3),
    });
    totalFee += fee_pct;
    totalImpact += impact_bps;
    prevToken = targetToken;
    cumulativeOutput = output;
  }

  const gas_native = round(gas.price * (1 + rand() * 0.4), 6);
  const exec_time = Math.floor(800 + rand() * 3500);

  return Response.json({
    ok: true,
    config: { from, to, amount, chain, slippage_bps: slip },
    route: {
      hops,
      steps,
      total_output: round(cumulativeOutput, 6),
      total_fee_pct: round(totalFee, 3),
      total_price_impact_bps: totalImpact,
      estimated_gas: { token: gas.token, amount: gas_native },
      execution_time_ms: exec_time,
    },
    generated_at: new Date().toISOString(),
  });
}

function round(n: number, p = 4) { const k = 10 ** p; return Math.round(n * k) / k; }

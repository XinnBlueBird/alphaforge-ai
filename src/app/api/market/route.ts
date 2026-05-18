import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Live crypto market data via CoinGecko (free, no key required).
// Symbols accepted as comma-separated CoinGecko IDs OR tickers (best-effort map).

const TICKER_TO_ID: Record<string, string> = {
  btc: "bitcoin",
  eth: "ethereum",
  sol: "solana",
  bnb: "binancecoin",
  xrp: "ripple",
  ada: "cardano",
  doge: "dogecoin",
  ton: "the-open-network",
  trx: "tron",
  avax: "avalanche-2",
  link: "chainlink",
  matic: "matic-network",
  dot: "polkadot",
  near: "near",
  apt: "aptos",
  arb: "arbitrum",
  op: "optimism",
  sui: "sui",
  inj: "injective-protocol",
  pepe: "pepe",
  wif: "dogwifcoin",
  bonk: "bonk",
  jup: "jupiter-exchange-solana",
};

const DEFAULT = "bitcoin,ethereum,solana,arbitrum,optimism,jupiter-exchange-solana";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const raw = (url.searchParams.get("ids") || DEFAULT).toLowerCase();
  const ids = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => TICKER_TO_ID[s] || s)
    .slice(0, 20)
    .join(",");

  const cgUrl =
    `https://api.coingecko.com/api/v3/coins/markets` +
    `?vs_currency=usd&ids=${encodeURIComponent(ids)}` +
    `&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h,7d`;

  try {
    const res = await fetch(cgUrl, {
      headers: { accept: "application/json" },
      next: { revalidate: 30 },
    });
    if (!res.ok) {
      return Response.json(
        { error: `coingecko ${res.status}` },
        { status: 502 },
      );
    }
    const data = (await res.json()) as Array<Record<string, unknown>>;
    const slim = data.map((d) => ({
      id: d.id,
      symbol: (d.symbol as string)?.toUpperCase(),
      name: d.name,
      image: d.image,
      price: d.current_price,
      market_cap: d.market_cap,
      volume_24h: d.total_volume,
      change_24h: d.price_change_percentage_24h,
      change_7d: d.price_change_percentage_7d_in_currency,
      sparkline: (d.sparkline_in_7d as { price?: number[] })?.price?.slice(-48) || [],
    }));
    return Response.json(
      { ok: true, data: slim, fetched_at: new Date().toISOString() },
      { headers: { "cache-control": "public, max-age=30, stale-while-revalidate=60" } },
    );
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 502 });
  }
}

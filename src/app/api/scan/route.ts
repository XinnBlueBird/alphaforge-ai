import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const PROMPTS: Record<string, string> = {
  token: `You are AlphaForge AI's Token Scanner. Given a token symbol or contract address, return STRICT JSON ONLY (no prose, no markdown).

Schema:
{
  "type": "token",
  "symbol": "string",
  "headline": "string (one-line vibe summary)",
  "score": 0-100,
  "verdict": "ALPHA | NEUTRAL | AVOID",
  "metrics": [
    {"label": "Liquidity",   "value": "string", "tone": "good|warn|bad"},
    {"label": "Holders",     "value": "string", "tone": "good|warn|bad"},
    {"label": "Volume 24h",  "value": "string", "tone": "good|warn|bad"},
    {"label": "Dev Activity","value": "string", "tone": "good|warn|bad"},
    {"label": "Sentiment",   "value": "string", "tone": "good|warn|bad"}
  ],
  "narrative": "string (2-3 sentences, current narrative context)",
  "redflags": ["string", "string"],
  "playbook": "string (suggested play in one sentence)"
}`,

  x: `You are AlphaForge AI's X (Twitter) Sentiment Scanner. Given a token / cashtag / topic, return STRICT JSON ONLY.

Schema:
{
  "type": "x",
  "topic": "string",
  "headline": "string",
  "buzz_score": 0-100,
  "sentiment": "BULLISH | NEUTRAL | BEARISH",
  "kol_take": "string (what top KOLs are saying, 2-3 sentences)",
  "trend_direction": "rising | flat | cooling",
  "tweet_examples": [
    {"author": "string (@handle style)", "text": "string", "vibe": "bullish|bearish|neutral"},
    {"author": "string", "text": "string", "vibe": "bullish|bearish|neutral"},
    {"author": "string", "text": "string", "vibe": "bullish|bearish|neutral"}
  ],
  "engagement": {"posts_24h": "string", "impressions": "string", "ratio": "string"},
  "verdict": "string"
}`,

  project: `You are AlphaForge AI's Project Alpha Scanner. Given a project name, ticker, or thesis tag, surface the alpha edge.

Return STRICT JSON ONLY:
{
  "type": "project",
  "project": "string",
  "category": "string (e.g. L2, AI x crypto, RWA, DePIN)",
  "alpha_score": 0-100,
  "stage": "stealth | testnet | mainnet | mature",
  "thesis": "string (3 sentences)",
  "why_now": "string (1-2 sentences, the catalyst)",
  "moat": ["string", "string"],
  "tokenomics": "string",
  "team": "string (anon|doxxed, notable backgrounds)",
  "fundraise": "string (round, lead investor if known)",
  "risks": ["string", "string"],
  "next_catalyst": "string"
}`,

  defi: `You are AlphaForge AI's DeFi Strategist. Given a chain or protocol, surface yields, risks, and opportunities.

Return STRICT JSON ONLY:
{
  "type": "defi",
  "target": "string",
  "headline": "string",
  "tvl": "string",
  "best_yields": [
    {"pool": "string", "apy": "string", "risk": "low|med|high", "note": "string"},
    {"pool": "string", "apy": "string", "risk": "low|med|high", "note": "string"},
    {"pool": "string", "apy": "string", "risk": "low|med|high", "note": "string"}
  ],
  "stable_strategies": ["string", "string"],
  "leveraged_plays": ["string", "string"],
  "incentive_programs": ["string", "string"],
  "smart_money_flow": "string (2 sentences on where size is moving)",
  "risk_summary": "string"
}`,
};

type ScanReq = { kind?: keyof typeof PROMPTS; query?: string };

export async function POST(req: NextRequest) {
  let body: ScanReq = {};
  try { body = await req.json(); } catch {}
  const kind = body.kind || "token";
  const query = (body.query || "").trim().slice(0, 200);
  if (!query) return json({ error: "query required" }, 400);
  const sys = PROMPTS[kind];
  if (!sys) return json({ error: "unknown kind" }, 400);

  const apiBase = process.env.MIMO_API_BASE || "https://api.freemodel.dev/v1";
  const apiKey = process.env.FREEMODEL_API_KEY || process.env.MIMO_API_KEY;
  const model = process.env.SIGNAL_MODEL || process.env.MIMO_MODEL || "claude-opus-4-7";
  if (!apiKey) return json({ error: "API key not configured" }, 500);

  const start = Date.now();
  const upstream = await fetch(`${apiBase}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      temperature: 0.45,
      max_tokens: 1500,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: `Query: ${query}\n\nReturn the JSON.` },
      ],
      response_format: { type: "json_object" },
    }),
  });

  const elapsed = Date.now() - start;

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return json({ error: `upstream ${upstream.status}`, detail: text.slice(0, 300) }, 502);
  }

  const data = await upstream.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) return json({ error: "Empty response" }, 502);

  let parsed: Record<string, unknown>;
  try { parsed = JSON.parse(content); }
  catch {
    const m = content.match(/\{[\s\S]*\}/);
    if (!m) return json({ error: "Non-JSON response" }, 502);
    try { parsed = JSON.parse(m[0]); }
    catch { return json({ error: "Non-JSON response" }, 502); }
  }

  return json({
    ok: true,
    result: parsed,
    meta: { kind, latency_ms: elapsed, model: "MiMo V2.5 Pro", generated_at: new Date().toISOString() },
  });
}

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SIGNAL_SYSTEM = `You are AlphaForge AI — an institutional-grade multi-agent crypto signal engine.

Given a token symbol or contract address, produce a structured trading signal as STRICT JSON ONLY. No prose, no markdown fences.

Schema:
{
  "symbol": "string",
  "verdict": "STRONG_BUY | BUY | NEUTRAL | SELL | STRONG_SELL",
  "conviction": 0-100,
  "thesis": "string (≤180 chars, the 'why' in one breath)",
  "entry": "string (price or range)",
  "target": "string",
  "invalidation": "string",
  "horizon": "string (e.g. '24h', '7d', '30d')",
  "agents": [
    { "name": "Momentum", "score": 0-100, "note": "string ≤80 chars" },
    { "name": "Liquidity", "score": 0-100, "note": "string ≤80 chars" },
    { "name": "Narrative", "score": 0-100, "note": "string ≤80 chars" },
    { "name": "Risk", "score": 0-100, "note": "string ≤80 chars" },
    { "name": "OnChain", "score": 0-100, "note": "string ≤80 chars" }
  ],
  "risks": ["string", "string", "string"]
}

Be honest about uncertainty. Reflect current market context as you understand it. Never fabricate exact on-chain numbers — give qualitative reads if you don't know precise figures.`;

type SignalReq = { symbol?: string };

export async function POST(req: NextRequest) {
  let body: SignalReq;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const symbol = (body.symbol || "").trim().slice(0, 64);
  if (!symbol) return json({ error: "symbol required" }, 400);

  const apiBase = process.env.MIMO_API_BASE || "https://api.freemodel.dev/v1";
  const apiKey = process.env.FREEMODEL_API_KEY || process.env.MIMO_API_KEY;
  const model = process.env.SIGNAL_MODEL || process.env.MIMO_MODEL || "claude-opus-4-7";

  if (!apiKey) return json({ error: "API key not configured" }, 500);

  const payload = {
    model,
    temperature: 0.4,
    max_tokens: 1200,
    messages: [
      { role: "system", content: SIGNAL_SYSTEM },
      { role: "user", content: `Token: ${symbol}\n\nReturn the JSON signal.` },
    ],
    response_format: { type: "json_object" },
  };

  const start = Date.now();
  const upstream = await fetch(`${apiBase}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const elapsed = Date.now() - start;

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return json(
      { error: `upstream ${upstream.status}`, detail: text.slice(0, 300) },
      502,
    );
  }

  const data = await upstream.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) return json({ error: "Empty response" }, 502);

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content);
  } catch {
    // Try to extract JSON between { … }
    const m = content.match(/\{[\s\S]*\}/);
    if (!m) return json({ error: "Model returned non-JSON", raw: content.slice(0, 400) }, 502);
    try { parsed = JSON.parse(m[0]); }
    catch { return json({ error: "Model returned non-JSON", raw: content.slice(0, 400) }, 502); }
  }

  return json({
    ok: true,
    signal: parsed,
    meta: {
      latency_ms: elapsed,
      generated_at: new Date().toISOString(),
      // Public-facing model label — keep mimo branding
      model: "MiMo V2.5 Pro",
    },
  });
}

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const COMPOSE_SYSTEM = `You are AlphaForge AI's Strategy Composer.

Convert the user's plain-English trading idea into STRICT JSON ONLY (no prose, no markdown fences).

Schema:
{
  "name": "string (short title, e.g. 'SOL RSI dip-buy')",
  "symbol": "string (ticker)",
  "trigger": {
    "description": "string (one-line plain English)",
    "conditions": ["string", "string"]
  },
  "entry": {
    "type": "market | limit | dca | trailing",
    "size_pct": 1-100,
    "max_slippage_bps": 1-500
  },
  "exit": {
    "take_profit": "string (e.g. '+5%' or 'price > 230')",
    "stop_loss": "string",
    "max_hold_hours": 1-720
  },
  "risk": {
    "max_position_pct": 1-100,
    "max_drawdown_pct": 1-50,
    "cooldown_min": 0-1440
  },
  "notes": ["string", "string"]
}

Use sensible defaults if user is vague. Default size_pct=10, max_slippage_bps=50, max_position_pct=20, max_drawdown_pct=10, cooldown_min=60, max_hold_hours=72.`;

type ComposeReq = { intent?: string };

export async function POST(req: NextRequest) {
  let body: ComposeReq = {};
  try { body = await req.json(); } catch {}
  const intent = (body.intent || "").trim().slice(0, 1000);
  if (!intent) return json({ error: "intent required" }, 400);

  const apiBase = process.env.MIMO_API_BASE || "https://api.xiaomimimo.com/v1";
  const apiKey = process.env.MIMO_API_KEY || process.env.FREEMODEL_API_KEY;
  const model = process.env.SIGNAL_MODEL || process.env.MIMO_MODEL || "mimo-v2.5-pro";
  if (!apiKey) return json({ error: "API key not configured" }, 500);

  const upstream = await fetch(`${apiBase}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", "api-key": apiKey },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: 1000,
      messages: [
        { role: "system", content: COMPOSE_SYSTEM },
        { role: "user", content: `Idea: ${intent}\n\nReturn the strategy JSON.` },
      ],
      response_format: { type: "json_object" },
    }),
  });

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

  return json({ ok: true, strategy: parsed });
}

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// In-memory alert store. In production this would be Redis/DB.
type Alert = {
  id: string;
  symbol: string;
  condition: string;
  threshold: number;
  channel: "telegram" | "discord" | "webhook" | "email";
  target: string;
  enabled: boolean;
  created_at: string;
  triggered_count: number;
  last_triggered: string | null;
};

const ALERTS = new Map<string, Alert>();

// Seed with a few demo alerts
if (ALERTS.size === 0) {
  ["alert_demo_btc", "alert_demo_eth"].forEach((id, i) => {
    ALERTS.set(id, {
      id,
      symbol: ["BTC", "ETH"][i],
      condition: ["price_above", "verdict_change"][i],
      threshold: [120000, 0][i],
      channel: ["telegram", "webhook"][i] as Alert["channel"],
      target: ["@xinnsky", "https://example.com/hook"][i],
      enabled: true,
      created_at: new Date().toISOString(),
      triggered_count: [3, 1][i],
      last_triggered: null,
    });
  });
}

export async function GET() {
  return Response.json({ ok: true, alerts: Array.from(ALERTS.values()) });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { symbol, condition, threshold, channel, target } = body;
  if (!symbol || !condition || !channel || !target) {
    return Response.json({ error: "missing required fields" }, { status: 400 });
  }
  const id = `alert_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const alert: Alert = {
    id,
    symbol: String(symbol).toUpperCase().slice(0, 16),
    condition: String(condition).slice(0, 32),
    threshold: Number(threshold) || 0,
    channel,
    target: String(target).slice(0, 200),
    enabled: true,
    created_at: new Date().toISOString(),
    triggered_count: 0,
    last_triggered: null,
  };
  ALERTS.set(id, alert);
  return Response.json({ ok: true, alert });
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  ALERTS.delete(id);
  return Response.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { id, enabled } = body;
  const a = ALERTS.get(id);
  if (!a) return Response.json({ error: "not found" }, { status: 404 });
  a.enabled = !!enabled;
  ALERTS.set(id, a);
  return Response.json({ ok: true, alert: a });
}

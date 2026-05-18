import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Mock Telegram alert sender.
// In production, this would call the Telegram Bot API:
//   POST https://api.telegram.org/bot<BOT_TOKEN>/sendMessage
//   body: { chat_id, text, parse_mode: "MarkdownV2" }
// using process.env.TELEGRAM_BOT_TOKEN. We deliberately do NOT make a real outbound
// call here so the demo runs without secrets.

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { chat_id, message } = body as { chat_id?: string; message?: string };

  if (!chat_id || !message) {
    return Response.json(
      { ok: false, error: "chat_id and message are required" },
      { status: 400 },
    );
  }

  const preview = String(message).slice(0, 4096);

  return Response.json({
    ok: true,
    sent: true,
    chat_id,
    preview,
    note: "Mock send — wire process.env.TELEGRAM_BOT_TOKEN and call api.telegram.org/bot<TOKEN>/sendMessage in production.",
    sent_at: new Date().toISOString(),
  });
}

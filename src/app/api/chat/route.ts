import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are AlphaForge AI's terminal assistant — a multi-agent crypto alpha & bot generator.
You operate inside a hacker-style terminal embedded on the AlphaForge landing page.
Be concise, direct, and lean toward actionable output: alpha leads, conviction scores, code snippets, deploy memos.
When asked to write code, output runnable Python or TypeScript with comments.
Never claim a transaction or signal is verified unless the user provided the data.
Reply in the user's language (Indonesian or English). Avoid filler. No corporate hype.`;

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as { messages: ChatMessage[] };

  const apiBase = process.env.MIMO_API_BASE || "https://api.freemodel.dev/v1";
  const apiKey = process.env.FREEMODEL_API_KEY || process.env.MIMO_API_KEY;
  const model = process.env.MIMO_MODEL || "mimo/mimo-v2.5-pro";

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "API key not configured on server." }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }

  const payload = {
    model,
    stream: true,
    temperature: 0.7,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.filter((m) => m.role !== "system"),
    ],
  };

  const upstream = await fetch(`${apiBase}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    return new Response(
      JSON.stringify({ error: `upstream ${upstream.status}: ${text.slice(0, 500)}` }),
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }

  // Pass through SSE stream + emit a final "usage" event when done.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      let buffer = "";
      let usage: unknown = null;

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // Parse SSE lines to extract usage if present
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) {
              controller.enqueue(encoder.encode(line + "\n"));
              continue;
            }
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") {
              if (usage) {
                controller.enqueue(
                  encoder.encode(`event: usage\ndata: ${JSON.stringify(usage)}\n\n`),
                );
              }
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              continue;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed?.usage) usage = parsed.usage;
            } catch {
              // ignore
            }
            controller.enqueue(encoder.encode(line + "\n"));
          }
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            `event: error\ndata: ${JSON.stringify({ error: String(err) })}\n\n`,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
    },
  });
}

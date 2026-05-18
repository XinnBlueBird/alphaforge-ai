import AgentsConsole from "@/components/AgentsConsole";
import { Cpu } from "lucide-react";

export const metadata = { title: "Agents Console · AlphaForge AI" };

export default function AgentsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
          <Cpu className="h-3 w-3" /> Agents Console
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          See every agent in the{" "}
          <span className="bg-gradient-to-r from-amber-400 to-fuchsia-400 bg-clip-text text-transparent">
            forge runtime.
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Live status, throughput, last decision, and confidence per sub-agent. Click any agent to
          inspect its inputs, prompt template, and recent calls.
        </p>
      </div>
      <AgentsConsole />
    </main>
  );
}

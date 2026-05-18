import CustomAgents from "@/components/CustomAgents";
import { Bot } from "lucide-react";

export const metadata = { title: "Custom Agents · AlphaForge AI" };

export default function CustomAgentsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-300">
          <Bot className="h-3 w-3" /> Custom Agents
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Your agents,{" "}
          <span className="bg-gradient-to-r from-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
            your rules.
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Create custom sub-agents with their own system prompts, model preferences, and roles.
          Test them live against the runtime.
        </p>
      </div>
      <CustomAgents />
    </main>
  );
}

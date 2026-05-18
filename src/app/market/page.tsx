import MarketTicker from "@/components/MarketTicker";
import { TrendingUp } from "lucide-react";

export const metadata = { title: "Market · AlphaForge AI" };

export default function MarketPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
          <TrendingUp className="h-3 w-3" /> Market
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          What the agents are{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-emerald-300 bg-clip-text text-transparent">
            watching now.
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Live snapshot from CoinGecko. Auto-refreshes every 30 seconds. Click any ticker to launch
          a Forge signal on it.
        </p>
      </div>
      <MarketTicker />
    </main>
  );
}

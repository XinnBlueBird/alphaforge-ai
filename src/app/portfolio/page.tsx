import PortfolioTracker from "@/components/PortfolioTracker";
import { Briefcase } from "lucide-react";

export const metadata = { title: "Portfolio Tracker · AlphaForge AI" };

export default function PortfolioPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
          <Briefcase className="h-3 w-3" /> Portfolio
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Portfolio{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-emerald-300 bg-clip-text text-transparent">
            Tracker.
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Track your crypto positions with live prices. Computed P&L, allocation pie,
          and per-position breakdown — stored locally, no account required.
        </p>
      </div>
      <PortfolioTracker />
    </main>
  );
}

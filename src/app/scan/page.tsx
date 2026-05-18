import ScannerHub from "@/components/ScannerHub";
import { Search } from "lucide-react";

export const metadata = { title: "Scan · AlphaForge AI" };

export default function ScanPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-300">
          <Search className="h-3 w-3" /> Scanner Hub
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Four scanners.{" "}
          <span className="bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-amber-300 bg-clip-text text-transparent">
            One alpha hub.
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Token, X sentiment, project alpha, DeFi yields — each backed by the same multi-agent
          runtime. Switch tabs, type a query, get a structured read in seconds.
        </p>
      </div>
      <ScannerHub />
    </main>
  );
}

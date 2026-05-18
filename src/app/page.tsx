import Hero from "@/components/Hero";
import SignalGenerator from "@/components/SignalGenerator";
import MarketTicker from "@/components/MarketTicker";
import BacktestSim from "@/components/BacktestSim";
import PipelineDiagram from "@/components/PipelineDiagram";
import TokenTable from "@/components/TokenTable";
import Terminal from "@/components/Terminal";
import LiveFeed from "@/components/LiveFeed";
import Compare from "@/components/Compare";
import Stack from "@/components/Stack";
import PricingAndFAQ from "@/components/PricingAndFAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <SignalGenerator />
      <MarketTicker />
      <BacktestSim />
      <PipelineDiagram />
      <Terminal />
      <LiveFeed />
      <TokenTable />
      <Compare />
      <Stack />
      <PricingAndFAQ />
      <CTA />
      <Footer />
    </main>
  );
}

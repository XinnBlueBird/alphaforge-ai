import Hero from "@/components/Hero";
import PipelineDiagram from "@/components/PipelineDiagram";
import TokenTable from "@/components/TokenTable";
import Terminal from "@/components/Terminal";
import LiveFeed from "@/components/LiveFeed";
import Compare from "@/components/Compare";
import Stack from "@/components/Stack";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <PipelineDiagram />
      <TokenTable />
      <Terminal />
      <LiveFeed />
      <Compare />
      <Stack />
      <CTA />
      <Footer />
    </main>
  );
}

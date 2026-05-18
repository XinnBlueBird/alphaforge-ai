import Hero from "@/components/Hero";
import PipelineDiagram from "@/components/PipelineDiagram";
import TokenTable from "@/components/TokenTable";
import Terminal from "@/components/Terminal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <PipelineDiagram />
      <TokenTable />
      <Terminal />
      <Footer />
    </main>
  );
}

import Hero from "@/components/Hero";
import PricingAndFAQ from "@/components/PricingAndFAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import FeaturesGrid from "@/components/FeaturesGrid";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeaturesGrid />
      <PricingAndFAQ />
      <CTA />
      <Footer />
    </main>
  );
}

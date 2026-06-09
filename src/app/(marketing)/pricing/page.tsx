import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { PricingSection } from "@/components/landing/pricing-section";
import { WhatsAppFloat } from "@/components/landing/whatsapp-float";

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-20 pb-24 md:pb-0">
      <Navbar forceSolid />
      <PricingSection />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}

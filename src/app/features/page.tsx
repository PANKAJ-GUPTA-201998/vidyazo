import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { FeaturesSection } from "@/components/landing/features-section";
import { WhatsAppFloat } from "@/components/landing/whatsapp-float";

export default function FeaturesPage() {
  return (
    <main className="min-h-screen pt-20 pb-24 md:pb-0">
      <Navbar forceSolid />
      <FeaturesSection />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { HowItWorks } from "@/components/landing/how-it-works";
import { WhatsAppFloat } from "@/components/landing/whatsapp-float";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen pt-20 pb-24 md:pb-0">
      <Navbar forceSolid />
      <HowItWorks />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}

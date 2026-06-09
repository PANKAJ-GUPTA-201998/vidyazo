import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { SubjectsSection } from "@/components/landing/subjects-section";
import { WhatsAppFloat } from "@/components/landing/whatsapp-float";

export default function SubjectsPage() {
  return (
    <main className="min-h-screen pt-20 pb-24 md:pb-0">
      <Navbar forceSolid />
      <SubjectsSection />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}

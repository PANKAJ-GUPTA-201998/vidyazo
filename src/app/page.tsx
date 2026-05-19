import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { StatsSection } from "@/components/landing/stats-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { TeachersSection } from "@/components/landing/teachers-section";
import { ResultsSection } from "@/components/landing/results-section";
import { SubjectsSection } from "@/components/landing/subjects-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ReportPreview } from "@/components/landing/report-preview";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQSection } from "@/components/landing/faq-section";
import { Footer } from "@/components/landing/footer";
import { WhatsAppFloat } from "@/components/landing/whatsapp-float";

export default function LandingPage() {
  return (
    <main className="min-h-screen pb-24 md:pb-0">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <SubjectsSection />
      <FeaturesSection />
      <TeachersSection />
      <ResultsSection />
      <HowItWorks />
      <ReportPreview />
      <PricingSection />
      <FAQSection />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}

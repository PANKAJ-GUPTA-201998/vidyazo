import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { ReportPreview } from "@/components/landing/report-preview";

export default function ReportsPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar forceSolid />
      <ReportPreview />
      <Footer />
    </main>
  );
}

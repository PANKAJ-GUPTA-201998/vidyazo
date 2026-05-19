import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_LINK } from "@/lib/constants";
import { WhatsAppFloat } from "@/components/landing/whatsapp-float";

export default function DirectAdmissionPage() {
  const courses = ["B.Tech", "MBA", "MBBS", "BBA", "BCA", "BA", "B.Com", "LLB", "BJMC", "B.Pharma"];

  return (
    <main className="min-h-screen pt-20 bg-gray-50 pb-24 md:pb-0">
      <Navbar forceSolid />
      
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-8">
            <GraduationCap className="w-10 h-10 text-blue-600" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1a1a2e] mb-6 tracking-tight">
            Direct Admission <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Top Colleges in India
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Hassle-free admissions to premium institutions. Secure your seat today with our expert guidance.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {courses.map(course => (
              <span key={course} className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 shadow-sm">
                {course}
              </span>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100 max-w-2xl mx-auto text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why apply through Vidyazo?</h3>
            
            <ul className="space-y-4 mb-8">
              {[
                "100% Confirmed Seat Allocation",
                "Expert Career Counseling & Guidance",
                "No Hidden Charges or Agent Fees",
                "Assistance with College Selection",
                "End-to-End Documentation Support"
              ].map(benefit => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>

            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-transform duration-300 shadow-lg shadow-blue-600/20 text-white">
                Chat on WhatsApp Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <p className="text-center text-xs text-gray-400 mt-4">Average response time: &lt; 5 minutes</p>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}

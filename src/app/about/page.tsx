import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { TeachersSection } from "@/components/landing/teachers-section";
import { WhatsAppFloat } from "@/components/landing/whatsapp-float";
import { Heart, Target, Users, BookOpen, TrendingUp, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_LINK } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Vidyazo | Our Story & Mission",
  description: "Learn about Vidyazo — India's growing online tuition platform for Class 6-12 students. Meet our team and our mission.",
};

const stats = [
  { label: "Active Students", value: "10,000+", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Classes Conducted", value: "50,000+", icon: BookOpen, color: "text-green-500", bg: "bg-green-50" },
  { label: "Avg Score Improvement", value: "+15%", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50" },
  { label: "Boards Covered", value: "6+", icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-50" },
];

const mission = [
  {
    icon: Target,
    title: "Affordable Quality Education",
    description: "Every student deserves great teachers — not just those who can afford expensive coaching.",
  },
  {
    icon: Heart,
    title: "Parent-First Transparency",
    description: "Parents know exactly how their child is doing. No surprises, no hidden problems.",
  },
  {
    icon: TrendingUp,
    title: "Results, Not Just Classes",
    description: "We measure success by score improvements, not just hours taught.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-20 pb-24 md:pb-0">
      <Navbar forceSolid />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-[#e94560]/20 flex items-center justify-center mx-auto mb-8 border-2 border-[#e94560]/30">
            <span className="text-4xl">👨‍🏫</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
            Started by a Student,{" "}
            <span className="bg-gradient-to-r from-[#e94560] to-[#ff6b81] bg-clip-text text-transparent">
              Built for Students
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Vidyazo was born from a simple idea — every student in India, no matter which city or board, deserves access to the best teachers and personalized learning.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#e94560]/10 text-[#e94560] text-sm font-medium mb-4">
              Our Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e] mb-4">
              Why Vidyazo?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mission.map((item) => (
              <div key={item.title} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="w-14 h-14 rounded-xl bg-[#e94560]/10 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-[#e94560]" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Teachers */}
      <TeachersSection />

      {/* Numbers */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e]">
              Our Numbers Speak
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className={`${stat.bg} rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300`}>
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <p className="text-3xl font-extrabold text-[#1a1a2e] mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#e94560] to-[#ff6b81]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Want to Know More?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Chat directly with our founder on WhatsApp
          </p>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
            <Button className="bg-white text-[#e94560] px-8 py-6 text-lg font-bold rounded-xl hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer">
              Chat on WhatsApp
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}

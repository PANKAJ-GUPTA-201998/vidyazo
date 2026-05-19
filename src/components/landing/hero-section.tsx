"use client";

import Image from "next/image";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_LINK } from "@/lib/constants";
import { useLanguage } from "@/contexts/language-context";

export function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center gradient-hero overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#e94560]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0f3460]/30 rounded-full blur-3xl animate-float stagger-3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e94560]/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Left Column - Text */}
          <div className="flex-1 text-center lg:text-left pt-10 lg:pt-0">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white/80 text-sm mb-8 animate-slide-up">
          <Sparkles className="w-4 h-4 text-[#e94560]" />
          <span>{t("hero.badge")}</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight animate-slide-up stagger-1">
          {t("hero.heading1")}{" "}
          <span className="relative">
            <span className="relative z-10 bg-gradient-to-r from-[#e94560] to-[#ff6b81] bg-clip-text text-transparent">
              {t("hero.heading2")}
            </span>
            <span className="absolute bottom-0 left-0 w-full h-3 bg-[#e94560]/20 rounded-full" />
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up stagger-2">
          {t("hero.subtitle")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-up stagger-3">
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="gradient-accent text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-[#e94560]/30 hover:shadow-[#e94560]/50 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              {t("hero.ctaPrimary")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </a>
          <a href="#pricing">
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white bg-white/5 hover:bg-white/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm transition-all duration-300 cursor-pointer"
            >
              {t("hero.ctaSecondary")}
            </Button>
          </a>
        </div>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 animate-slide-up stagger-4">
          <div className="flex items-center -space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1a1a2e] bg-gray-200 overflow-hidden relative">
                <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Student" fill sizes="40px" className="object-cover" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-[#1a1a2e] bg-[#e94560] flex items-center justify-center text-white text-xs font-bold z-10">
              10k+
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1 text-yellow-400">
              {Array(5).fill(0).map((_, i) => <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
            </div>
            <p className="text-sm text-white/70">Loved by parents & students</p>
          </div>
        </div>
        </div>

        {/* Right Column - Image */}
        <div className="flex-1 w-full max-w-xl lg:max-w-none relative animate-slide-up stagger-5">
          <div className="relative rounded-2xl overflow-hidden glass border border-white/10 shadow-2xl shadow-[#e94560]/20 aspect-square lg:aspect-auto lg:h-[600px] w-full transform transition-transform hover:scale-[1.02] duration-500">
            <Image 
              src="/images/hero-student.png" 
              alt="Student using Vidyazo" 
              fill 
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {/* Floating UI Elements */}
            <div className="absolute top-8 left-8 glass rounded-xl p-4 border border-white/20 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Algebra Test</p>
                  <p className="text-white/70 text-xs">Score: 95% (+12%)</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-8 right-8 glass rounded-xl p-4 border border-white/20 animate-float stagger-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e94560]/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#e94560]" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Smart Feedback</p>
                  <p className="text-white/70 text-xs">Concept clear!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

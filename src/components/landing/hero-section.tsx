"use client";

import Image from "next/image";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_LINK } from "@/lib/constants";
import { useLanguage } from "@/contexts/language-context";

export function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center gradient-hero overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-4 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-[#e94560]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-4 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-[#0f3460]/30 rounded-full blur-3xl animate-float stagger-3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-[#e94560]/5 rounded-full blur-3xl" />
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-24 sm:py-20 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-8">
          
          {/* Left Column - Text */}
          <div className="flex-1 text-center lg:text-left pt-4 lg:pt-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass text-white/80 text-xs sm:text-sm mb-6 sm:mb-8 animate-slide-up">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e94560]" />
              <span>{t("hero.badge")}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 sm:mb-6 leading-tight animate-slide-up stagger-1">
              {t("hero.heading1")}{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-[#e94560] to-[#ff6b81] bg-clip-text text-transparent">
                  {t("hero.heading2")}
                </span>
                <span className="absolute bottom-0 left-0 w-full h-2 sm:h-3 bg-[#e94560]/20 rounded-full" />
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl md:text-2xl text-white/70 mb-8 sm:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-slide-up stagger-2 px-2 sm:px-0">
              {t("hero.subtitle")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 animate-slide-up stagger-3 px-4 sm:px-0">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gradient-accent text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-xl shadow-lg shadow-[#e94560]/30 hover:shadow-[#e94560]/50 hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  {t("hero.ctaPrimary")}
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </a>
              <a href="#pricing" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/20 text-white bg-white/5 hover:bg-white/10 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl backdrop-blur-sm transition-all duration-300 cursor-pointer"
                >
                  {t("hero.ctaSecondary")}
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 animate-slide-up stagger-4">
              <div className="flex items-center -space-x-3 sm:-space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#1a1a2e] bg-gray-200 overflow-hidden relative">
                    <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Student" fill sizes="40px" className="object-cover" />
                  </div>
                ))}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#1a1a2e] bg-[#e94560] flex items-center justify-center text-white text-[10px] sm:text-xs font-bold z-10">
                  600+
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-0.5 sm:gap-1 text-yellow-400">
                  {Array(5).fill(0).map((_, i) => <svg key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                </div>
                <p className="text-xs sm:text-sm text-white/70">Loved by parents & students</p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="flex-1 w-full max-w-sm sm:max-w-md lg:max-w-none relative animate-slide-up stagger-5">
            <div className="relative rounded-2xl overflow-hidden glass border border-white/10 shadow-2xl shadow-[#e94560]/20 lg:h-[560px] w-full p-6 sm:p-8 flex flex-col justify-center">
              {/* Background Image */}
              <Image 
                src="/images/transparent-hero-bg.png" 
                alt="Abstract Background" 
                fill 
                className="object-cover opacity-70 mix-blend-overlay"
                priority
                unoptimized
              />
              
              <div className="relative z-10 w-full max-w-sm mx-auto backdrop-blur-md bg-[#1a1a2e]/40 p-6 rounded-2xl border border-white/10">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Book a Free Trial</h3>
                  <p className="text-white/70 text-sm">Experience the Vidyazo difference today.</p>
                </div>
                
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter your name" 
                      className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#e94560] transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="flex items-center justify-center px-4 rounded-xl bg-white/10 border border-white/20 text-white/80 font-medium text-sm">
                        +91
                      </div>
                      <input 
                        type="tel" 
                        placeholder="10-digit number" 
                        className="flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#e94560] transition-all"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">Class / Grade</label>
                    <select className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#e94560] transition-all appearance-none [&>option]:text-gray-900">
                      <option value="" disabled selected>Select Class</option>
                      {[6, 7, 8, 9, 10, 11, 12].map(c => (
                        <option key={c} value={c}>Class {c}</option>
                      ))}
                    </select>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 mt-4 gradient-accent text-white rounded-xl text-base font-semibold hover:shadow-lg hover:shadow-[#e94560]/30 transition-all duration-300"
                  >
                    Request Callback
                  </Button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

"use client";

import Image from "next/image";
import { Users, ClipboardCheck, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Users,
    title: "Join a Batch or Book 1-on-1",
    description:
      "Choose your class, board, and a plan that fits your learning style and budget",
    color: "#3b82f6",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "Attend Classes + Take Weekly Tests",
    description:
      "Join live classes, clear doubts, and test your knowledge every Sunday",
    color: "#e94560",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Get Reports + Improve Every Week",
    description:
      "We analyze your performance and send progress reports to your parents",
    color: "#10b981",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-[#f8f9fa]" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1a1a2e]/10 text-[#1a1a2e] text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4">
            Simple{" "}
            <span className="bg-gradient-to-r from-[#e94560] to-[#ff6b81] bg-clip-text text-transparent">
              3 Steps
            </span>{" "}
            to Start
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Getting started with Vidyazo is as easy as 1-2-3
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left Column - Steps */}
          <div className="flex-1 space-y-8 sm:space-y-12 w-full">
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex gap-4 sm:gap-6 group">
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10 transition-transform group-hover:scale-110 duration-300 shadow-xl"
                    style={{ backgroundColor: step.color }}
                  >
                    <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  {index !== steps.length - 1 && (
                    <div className="w-1 h-full mt-4 rounded-full opacity-20" style={{ backgroundColor: step.color }} />
                  )}
                </div>
                <div className="pt-1 sm:pt-2">
                  <h3 className="text-lg sm:text-2xl font-bold text-[#1a1a2e] mb-2">
                    <span className="text-xs font-black tracking-widest uppercase mr-2 opacity-50" style={{ color: step.color }}>Step {step.number}</span>
                    <br className="sm:hidden" />
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Image */}
          <div className="flex-1 w-full relative">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200 aspect-square lg:aspect-[4/5] transform lg:rotate-2 hover:rotate-0 transition-transform duration-500 border-8 border-white">
              <Image 
                src="/images/parent-child-report.png" 
                alt="Parent and child happy with Vidyazo report" 
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-xl font-bold mb-2">&quot;Vidyazo completely changed how my child studies!&quot;</p>
                <p className="text-sm opacity-90">— Indian Parent</p>
              </div>
            </div>
            {/* Floating Element */}
            <div className="absolute -left-8 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden lg:block animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Score Improved</p>
                  <p className="text-xs text-gray-500">+15% this week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { TrendingUp, TrendingDown, BookOpen, Award } from "lucide-react";

export function ReportPreview() {
  return (
    <section className="py-20 sm:py-28 bg-[#f8f9fa]" id="report-preview">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Column - Text and Image */}
          <div className="flex-1 w-full text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#e94560]/10 text-[#e94560] text-sm font-medium mb-4">
              Progress Reports
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-6">
              Every Week, Parents Get{" "}
              <span className="bg-gradient-to-r from-[#e94560] to-[#ff6b81] bg-clip-text text-transparent">
                This
              </span>
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 mb-10">
              We track your child&apos;s progress, identify weak areas, and send a highly personalized performance report directly to your WhatsApp.
            </p>
            
            <div className="relative w-full max-w-md mx-auto lg:mx-0 h-[250px] sm:h-[350px] rounded-3xl overflow-hidden shadow-2xl group">
              <Image 
                src="/images/success.png" 
                alt="Student Success Path" 
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-xl font-bold">10x Faster Progress</p>
                <p className="text-white/80 text-sm mt-1">When students know exactly what to focus on.</p>
              </div>
            </div>
          </div>

          {/* Right Column - Mock Report Card */}
          <div className="flex-1 w-full max-w-lg mx-auto lg:mx-0">
            <div className="bg-white rounded-3xl shadow-2xl shadow-[#e94560]/10 overflow-hidden border border-gray-100 transform transition-transform hover:-translate-y-2 duration-500">
            {/* Report Header */}
            <div className="gradient-hero p-5 sm:p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">Weekly Report</h3>
                  <p className="text-white/60 text-xs sm:text-sm">
                    Week of 28 Apr - 4 May 2026
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#e94560] flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  R
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base">Rohit Sharma</p>
                  <p className="text-white/60 text-xs sm:text-sm">Class 10 • CBSE</p>
                </div>
              </div>
            </div>

            {/* Score Section */}
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-5 sm:mb-6 p-3 sm:p-4 bg-green-50 rounded-2xl">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">Overall Score</p>
                  <p className="text-3xl sm:text-4xl font-extrabold text-green-600">
                    85%
                  </p>
                </div>
                <div className="flex items-center gap-1 text-green-600 bg-green-100 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">+12% from last week</span>
                </div>
              </div>

              {/* Topic Breakdown */}
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                Subject Performance
              </h4>
              <div className="space-y-3 mb-6">
                {[
                  {
                    topic: "Mathematics",
                    score: 90,
                    color: "bg-blue-500",
                    bgColor: "bg-blue-100",
                  },
                  {
                    topic: "English",
                    score: 75,
                    color: "bg-orange-500",
                    bgColor: "bg-orange-100",
                  },
                  {
                    topic: "Sanskrit",
                    score: 95,
                    color: "bg-green-500",
                    bgColor: "bg-green-100",
                  },
                ].map((item) => (
                  <div key={item.topic}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-700 font-medium">
                        {item.topic}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {item.score}%
                      </span>
                    </div>
                    <div className={`h-2.5 rounded-full ${item.bgColor}`}>
                      <div
                        className={`h-2.5 rounded-full ${item.color} transition-all duration-1000`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Weak & Strong Topics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-[10px] sm:text-xs font-semibold text-red-600 uppercase">
                      Weak Areas
                    </span>
                  </div>
                  <div className="space-y-1.5 sm:space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-xs font-medium">
                      English Grammar
                    </span>
                    <br className="hidden sm:block" />
                    <span className="inline-block px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-xs font-medium">
                      Maths: Trigonometry
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-[10px] sm:text-xs font-semibold text-green-600 uppercase">
                      Strong Areas
                    </span>
                  </div>
                  <div className="space-y-1.5 sm:space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-green-100 text-green-700 text-xs font-medium">
                      Sanskrit Vyakaranam
                    </span>
                    <br className="hidden sm:block" />
                    <span className="inline-block px-2 py-0.5 rounded-md bg-green-100 text-green-700 text-xs font-medium">
                      Maths: Algebra
                    </span>
                  </div>
                </div>
              </div>

              {/* Teacher Note */}
              <div className="p-3 sm:p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-[10px] sm:text-xs font-semibold text-blue-600 uppercase">
                    Teacher&apos;s Note
                  </span>
                </div>
                <p className="text-sm sm:text-base text-blue-800 leading-relaxed font-medium">
                  &quot;Rohit did very well this week! 📈 There&apos;s significant improvement in Algebra. A little more practice is needed in Trigonometry. Overall great progress!&quot;
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}

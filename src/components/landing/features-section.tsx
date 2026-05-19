"use client";

import Image from "next/image";
import {
  Video,
  Brain,
  PlayCircle,
  MessageCircle,
  BarChart3,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Live Interactive Classes",
    description:
      "Engage in real-time with expert teachers via Google Meet sessions",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Brain,
    title: "Weekly Test & Analysis",
    description:
      "Smart MCQ tests with topic-wise analysis",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: PlayCircle,
    title: "Recorded Class Access",
    description: "Missed a class? Watch recordings anytime, anywhere",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Doubt Support",
    description: "Get your doubts solved directly on WhatsApp (8-9 PM)",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: BarChart3,
    title: "Parent Progress Reports",
    description:
      "Weekly progress reports sent to parents via WhatsApp",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    icon: Target,
    title: "Personal Study Focus",
    description:
      "We identify weak areas and create a personalized study plan",
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-50",
    iconColor: "text-rose-600",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28 bg-white" id="features">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#e94560]/10 text-[#e94560] text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-[#e94560] to-[#ff6b81] bg-clip-text text-transparent">
              Excel
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            A complete learning ecosystem designed for Indian students
          </p>
        </div>

        {/* Top Banner Image */}
        <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden mb-16 shadow-2xl group">
          <Image 
            src="/images/ai_brain.png" 
            alt="Smart Education" 
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] to-transparent opacity-80" />
          <div className="absolute bottom-8 left-8 right-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Smart Learning Engine</h3>
            <p className="text-white/80 max-w-2xl">Our proprietary system tracks your learning patterns, identifies knowledge gaps, and dynamically adapts your coursework to ensure you master every concept faster than traditional methods.</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-[#1a1a2e] mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover accent line */}
              <div
                className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${feature.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

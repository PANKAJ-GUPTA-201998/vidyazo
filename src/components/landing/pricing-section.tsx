"use client";

import { useState } from "react";
import { Check, Star, Shield, Users, ChevronDown, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_LINK } from "@/lib/constants";

const monthlyPlans = [
  {
    name: "Batch Plan",
    price: "899",
    period: "/month",
    popular: false,
    features: [
      "3 classes/week",
      "MCQ weekly test",
      "Parent progress dashboard (Portal)",
      "Monthly PTM",
    ],
    cta: "Join Batch",
  },
  {
    name: "Hybrid Plan",
    price: "1,499",
    period: "/month",
    popular: true,
    features: [
      "5 classes/week",
      "Weekly test",
      "WhatsApp doubt support",
      "Parent portal details",
      "Monthly PTM",
      "1 personal session/month",
    ],
    cta: "Get Hybrid",
  },
  {
    name: "1-on-1 Plan",
    price: "2,999",
    period: "/month",
    popular: false,
    features: [
      "5 classes/week",
      "2x weekly test",
      "WhatsApp doubt support",
      "Parent portal details",
      "Monthly PTM",
      "Daily personal session",
    ],
    cta: "Book 1-on-1",
  },
];

const annualPlans = [
  {
    name: "Batch Plan",
    price: "9,999",
    period: "/year",
    popular: false,
    saving: "789",
    features: [
      "3 classes/week",
      "MCQ weekly test",
      "Parent progress dashboard (Portal)",
      "Monthly PTM",
    ],
    cta: "Join Batch",
  },
  {
    name: "Hybrid Plan",
    price: "16,499",
    period: "/year",
    popular: true,
    saving: "1,489",
    badge: "Best Value",
    features: [
      "5 classes/week",
      "Weekly test",
      "WhatsApp doubt support",
      "Parent portal details",
      "Monthly PTM",
      "1 personal session/month",
    ],
    cta: "Get Hybrid",
  },
  {
    name: "1-on-1 Plan",
    price: "32,999",
    period: "/year",
    popular: false,
    saving: "2,989",
    features: [
      "5 classes/week",
      "2x weekly test",
      "WhatsApp doubt support",
      "Parent portal details",
      "Monthly PTM",
      "Daily personal session",
    ],
    cta: "Book 1-on-1",
  },
];

const refundSteps = [
  { period: "First 7 days", policy: "Full refund, no questions asked ✅" },
  { period: "Day 8 - 15", policy: "Full refund if less than 3 classes attended" },
  { period: "After 15 days", policy: "No refund (pro-rated credit for next month)" },
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const plans = isAnnual ? annualPlans : monthlyPlans;

  return (
    <section className="py-20 sm:py-28 bg-white" id="pricing">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Trial Banner */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-4 sm:gap-6 px-6 py-3 rounded-full bg-green-50 border border-green-200 flex-wrap justify-center">
            <span className="flex items-center gap-1.5 text-green-700 text-sm font-semibold">
              <Check className="w-4 h-4" /> 7-day free trial
            </span>
            <span className="flex items-center gap-1.5 text-green-700 text-sm font-semibold">
              <Check className="w-4 h-4" /> 15-day money-back guarantee
            </span>
            <span className="flex items-center gap-1.5 text-green-700 text-sm font-semibold">
              <Check className="w-4 h-4" /> No hidden fees
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#e94560]/10 text-[#e94560] text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-[#e94560] to-[#ff6b81] bg-clip-text text-transparent">
              Plan
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Affordable plans designed for every student&apos;s needs
          </p>
        </div>

        {/* Monthly / Annual Toggle */}
        <div className="flex justify-center mb-10">
          <div className="relative flex items-center bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                !isAnnual
                  ? "bg-white text-[#1a1a2e] shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                isAnnual
                  ? "bg-white text-[#1a1a2e] shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Annual
              <span className="ml-1.5 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                Save up to 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name + plan.period}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                plan.popular
                  ? "shadow-2xl shadow-[#e94560]/20 scale-[1.02] md:scale-105 border-2 border-[#e94560]/20"
                  : "shadow-lg border border-gray-100 hover:shadow-xl"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#e94560] to-[#ff6b81] text-white text-center py-2 text-sm font-semibold flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  {isAnnual ? "BEST VALUE" : "MOST POPULAR"}
                </div>
              )}

              <div
                className={`p-8 ${plan.popular ? "pt-14" : ""} bg-white h-full flex flex-col`}
              >
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  {plan.name}
                </h3>

                <div className="mb-2">
                  <span className="text-5xl font-extrabold text-[#1a1a2e]">
                    ₹{plan.price}
                  </span>
                  <span className="text-gray-400 text-lg">{plan.period}</span>
                </div>

                {/* Saving badge for annual */}
                {"saving" in plan && plan.saving && (
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200">
                      💰 Save ₹{plan.saving}
                    </span>
                  </div>
                )}

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          plan.popular
                            ? "bg-[#e94560]/10 text-[#e94560]"
                            : "bg-[#1a1a2e]/10 text-[#1a1a2e]"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="block">
                  <Button
                    className={`w-full py-6 text-base font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                      plan.popular
                        ? "gradient-accent text-white shadow-lg shadow-[#e94560]/30 hover:shadow-[#e94560]/50 hover:scale-[1.02]"
                        : "bg-[#1a1a2e] text-white hover:bg-[#16213e] hover:scale-[1.02]"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Shield className="w-5 h-5 text-green-500" />
            <span className="font-medium">Razorpay Secured</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="font-medium">10,000+ Students</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <BadgeCheck className="w-5 h-5 text-purple-500" />
            <span className="font-medium">Google Verified</span>
          </div>
        </div>

        {/* Refund Policy Accordion */}
        <div className="mt-10 max-w-2xl mx-auto">
          <button
            onClick={() => setRefundOpen(!refundOpen)}
            className="w-full flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span className="font-semibold text-[#1a1a2e]">
              📋 Refund Policy
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                refundOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              refundOpen ? "max-h-80 mt-2" : "max-h-0"
            }`}
          >
            <div className="p-5 rounded-2xl bg-white border border-gray-100 space-y-4">
              {refundSteps.map((step) => (
                <div key={step.period} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#e94560] mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-[#1a1a2e]">
                      {step.period}
                    </p>
                    <p className="text-sm text-gray-500">{step.policy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

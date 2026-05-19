"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What are the class timings?",
    answer:
      "Batch classes are held between 6-8 PM in the evening, from Monday to Friday. The exact timing is decided based on the batch. For 1-on-1 classes, the timings are flexible and will be scheduled according to your convenience.",
  },
  {
    question: "Is the demo class free?",
    answer:
      "Yes! The first demo class is completely free. Send us a message on WhatsApp, and we will schedule it for you. You will get a real class experience during the demo.",
  },
  {
    question: "How can I make the payment?",
    answer:
      "Payments are processed securely through Razorpay — UPI, debit cards, and net banking are all supported. Simply click the 'Pay' button on your dashboard. We also accept direct UPI transfers.",
  },
  {
    question: "Will I get recordings if I miss a class?",
    answer:
      "Absolutely! The recording of every class is available on your dashboard. If you miss a class on any given day, you can watch the recording later. Recordings remain available for 30 days.",
  },
  {
    question: "Which education boards are supported?",
    answer:
      "We currently support CBSE, ICSE, UP Board, MP Board, Bihar Board, and Maharashtra Board. The syllabus is fully aligned with the respective board's curriculum.",
  },
  {
    question: "What is the refund policy?",
    answer:
      "If you are not satisfied within the first week, you will receive a full refund. After that, a pro-rata refund policy applies. There are absolutely no hidden charges.",
  },
  {
    question: "How will parents receive updates?",
    answer:
      "A weekly progress report is sent via WhatsApp every Monday! It includes the student's score, weak topics, strong topics, and improvement tips. Plus, parents can access the full dashboard anytime via a magic link.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 sm:py-28 bg-white" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#e94560]/10 text-[#e94560] text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4">
            Common{" "}
            <span className="bg-gradient-to-r from-[#e94560] to-[#ff6b81] bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-gray-500">
            Jo bhi doubts hain, yahan mil jayenge answers
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:border-gray-200"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
              >
                <span className="text-[#1a1a2e] font-semibold pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-60" : "max-h-0"
                }`}
              >
                <p className="px-5 pb-5 text-gray-500 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

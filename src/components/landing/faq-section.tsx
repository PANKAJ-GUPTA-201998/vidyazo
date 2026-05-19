"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Class timing kya hai?",
    answer:
      "Batch classes evening 6-8 PM ke beech hoti hain, Monday se Friday. Exact timing batch ke hisaab se decide hota hai. 1-on-1 classes ka timing flexible hai — aapki convenience ke hisaab se schedule hoga.",
  },
  {
    question: "Demo class free hai?",
    answer:
      "Haan! Pehli demo class bilkul free hai. WhatsApp pe message karo aur hum aapko schedule kar denge. Demo mein aapko actual class experience milega.",
  },
  {
    question: "Payment kaise karu?",
    answer:
      "Payment Razorpay ke through hota hai — UPI, debit card, net banking sab chalega. Dashboard pe jaake \"Pay\" button press karo. Cash ya direct UPI transfer bhi accept karte hain.",
  },
  {
    question: "Recording milegi agar class miss ho?",
    answer:
      "Bilkul! Har class ki recording dashboard pe available hoti hai. Agar kisi din class miss ho gayi, toh recording dekh sakte ho. Recording 30 din tak available rehti hai.",
  },
  {
    question: "Kaunsa board support hai?",
    answer:
      "Abhi CBSE, ICSE, UP Board, MP Board, Bihar Board, aur Maharashtra Board support karte hain. Syllabus har board ke hisaab se cover hota hai.",
  },
  {
    question: "Refund policy kya hai?",
    answer:
      "Agar first week mein satisfy nahi hue, toh full refund mil jayega. Uske baad pro-rata refund policy apply hogi. Koi hidden charges nahi hain.",
  },
  {
    question: "Parent ko updates kaise milenge?",
    answer:
      "Har Monday ko weekly report WhatsApp pe aata hai — Hindi mein! Isme bacche ka score, weak topics, strong topics, aur improvement tips sab hota hai. Plus, magic link se dashboard bhi dekh sakte hain.",
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

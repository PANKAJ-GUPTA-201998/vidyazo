"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { WhatsAppFloat } from "@/components/landing/whatsapp-float";
import {
  GraduationCap,
  FlaskConical,
  Atom,
  BookOpen,
  Shield,
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const exams = [
  {
    name: "JEE Mains",
    icon: Atom,
    description: "Engineering entrance — IITs, NITs, IIITs",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    name: "JEE Advanced",
    icon: Atom,
    description: "Top IIT admission — India's toughest exam",
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    name: "NEET",
    icon: FlaskConical,
    description: "Medical entrance — MBBS & BDS colleges",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    name: "CUET",
    icon: BookOpen,
    description: "Central university entrance — All subjects",
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    name: "UP TET",
    icon: Shield,
    description: "Teacher eligibility test — UP Board",
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    name: "State Board Entrance",
    icon: GraduationCap,
    description: "State-level polytechnic & diploma exams",
    color: "from-teal-500 to-cyan-600",
    bgColor: "bg-teal-50",
    iconColor: "text-teal-600",
  },
];

export default function CompetitiveExamsPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    exam_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!formData.full_name || !formData.phone || !formData.exam_type) {
      toast.error("Please fill all fields");
      return;
    }
    if (formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("exam_waitlist").insert({
        full_name: formData.full_name,
        phone: `+91${formData.phone}`,
        exam_type: formData.exam_type,
      });

      if (error) throw error;
      setSubmitted(true);
      toast.success("You're on the waitlist! We'll notify you soon 🎉");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-20 pb-24 md:pb-0">
      <Navbar forceSolid />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-semibold mb-8">
            <Clock className="w-4 h-4" />
            Launching Soon — Join the Waitlist!
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
            Crack{" "}
            <span className="bg-gradient-to-r from-[#e94560] to-[#ff6b81] bg-clip-text text-transparent">
              JEE, NEET, CUET
            </span>{" "}
            & More
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
            Expert-led preparation for India&apos;s top competitive exams. Get notified when we launch!
          </p>
        </div>
      </section>

      {/* Exam Cards */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e] mb-4">
              Exams We&apos;re Preparing For
            </h2>
            <p className="text-gray-500 text-lg">
              India&apos;s most important competitive exams — all in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div
                key={exam.name}
                className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${exam.color}`} />
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${exam.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <exam.icon className={`w-6 h-6 ${exam.iconColor}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-[#1a1a2e]">{exam.name}</h3>
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                        SOON
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{exam.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Form */}
      <section className="py-20 bg-white" id="waitlist">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <Award className="w-12 h-12 text-[#e94560] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-3">
              Join the Waitlist
            </h2>
            <p className="text-gray-500">
              Be the first to know when we launch. Early members get exclusive discounts!
            </p>
          </div>

          {submitted ? (
            <div className="text-center p-8 bg-green-50 rounded-2xl border border-green-200">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">
                You&apos;re on the list! 🎉
              </h3>
              <p className="text-green-600">
                We&apos;ll notify you on WhatsApp when {formData.exam_type} prep launches.
              </p>
            </div>
          ) : (
            <div className="space-y-4 bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Input
                  placeholder="Enter your name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="h-12 rounded-xl border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-4 rounded-xl bg-white border border-gray-200 text-gray-500 font-medium text-sm">
                    +91
                  </div>
                  <Input
                    type="tel"
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                      })
                    }
                    className="flex-1 h-12 rounded-xl border-gray-200"
                    maxLength={10}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam *
                </label>
                <Select
                  value={formData.exam_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, exam_type: value ?? "" })
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl border-gray-200">
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((exam) => (
                      <SelectItem key={exam.name} value={exam.name}>
                        {exam.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading || !formData.full_name || !formData.phone || !formData.exam_type}
                className="w-full h-12 gradient-accent text-white rounded-xl text-base font-semibold hover:shadow-lg hover:shadow-[#e94560]/30 transition-all duration-300 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Join Waitlist
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-gray-400">
                No spam. We&apos;ll only message when the course launches.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Lock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function ParentLoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+91${phone}`,
      });

      if (error) throw error;
      setStep("otp");
      toast.success("OTP sent to your phone");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        phone: `+91${phone}`,
        token: otp,
        type: "sms",
      });

      if (error) throw error;
      
      toast.success("Login successful!");
      router.push("/parent/dashboard");
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <Image
            src="/images/vidyazo-logo.png"
            alt="Vidyazo"
            width={64}
            height={64}
            className="mx-auto rounded-2xl shadow-sm mb-4"
          />
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Parent Portal</h1>
          <p className="text-gray-500 mt-1">Track your child&apos;s progress</p>
        </div>

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 font-medium text-sm">
                  +91
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    className="h-12 pl-10 rounded-xl border-gray-200"
                    maxLength={10}
                    disabled={loading}
                    autoFocus
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading || phone.length !== 10}
              className="w-full h-12 gradient-accent text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#e94560]/30 transition-all cursor-pointer"
            >
              {loading ? "Sending OTP..." : "Get OTP"}
              {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-xs text-[#e94560] font-medium hover:underline cursor-pointer"
                >
                  Change Number
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="h-12 pl-10 rounded-xl border-gray-200 text-center tracking-widest text-lg font-semibold"
                  maxLength={6}
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

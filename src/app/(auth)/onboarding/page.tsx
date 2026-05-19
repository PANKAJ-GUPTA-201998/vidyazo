"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, GraduationCap, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { BOARDS, CLASS_GRADES } from "@/lib/constants";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    class_grade: "",
    board: "",
    parent_phone: "",
    parent_email: "",
  });

  const handleSubmit = async () => {
    if (!formData.full_name || !formData.class_grade || !formData.board || !formData.parent_phone) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate parent phone
    if (formData.parent_phone.length !== 10) {
      toast.error("Please enter a valid 10-digit parent phone number");
      return;
    }

    // Validate email only if provided
    if (formData.parent_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parent_email)) {
      toast.error("Please enter a valid parent email address");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          class_grade: parseInt(formData.class_grade),
          board: formData.board,
          parent_phone: `+91${formData.parent_phone}`,
          parent_email: formData.parent_email ? formData.parent_email.toLowerCase().trim() : null,
        })
        .eq("id", user.id);

      if (error) {
        toast.error("Failed to save profile. Try again.");
        console.error(error);
        return;
      }

      toast.success("Profile saved! Welcome to Vidyazo! 🎉");
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#e94560]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0f3460]/30 rounded-full blur-3xl animate-float stagger-3" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">
              Complete Your Profile
            </h1>
            <p className="text-gray-400 text-sm">
              Tell us about yourself to get started
            </p>
          </div>

          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <Input
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="h-12 rounded-xl border-gray-200"
              />
            </div>

            {/* Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class *
              </label>
              <Select
                value={formData.class_grade}
                onValueChange={(value) =>
                  setFormData({ ...formData, class_grade: value ?? "" })
                }
              >
                <SelectTrigger className="h-12 rounded-xl border-gray-200">
                  <SelectValue placeholder="Select your class" />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_GRADES.map((grade) => (
                    <SelectItem key={grade} value={grade.toString()}>
                      Class {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Board */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Board *
              </label>
              <Select
                value={formData.board}
                onValueChange={(value) =>
                  setFormData({ ...formData, board: value ?? "" })
                }
              >
                <SelectTrigger className="h-12 rounded-xl border-gray-200">
                  <SelectValue placeholder="Select your board" />
                </SelectTrigger>
                <SelectContent>
                  {BOARDS.map((board) => (
                    <SelectItem key={board.value} value={board.value}>
                      {board.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Parent Phone - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1 text-[#e94560]" />
                Parent&apos;s Phone Number <span className="text-[#e94560]">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 font-medium text-sm">
                  +91
                </div>
                <Input
                  type="tel"
                  placeholder="Parent's 10-digit phone number"
                  value={formData.parent_phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      parent_phone: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10),
                    })
                  }
                  className="flex-1 h-12 rounded-xl border-gray-200"
                  maxLength={10}
                />
              </div>
            </div>

            {/* Parent Email - Optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1 text-gray-400" />
                Parent&apos;s Email Address
                <span className="text-gray-400 text-xs font-normal ml-2">(optional)</span>
              </label>
              <Input
                type="email"
                placeholder="parent@example.com"
                value={formData.parent_email}
                onChange={(e) =>
                  setFormData({ ...formData, parent_email: e.target.value })
                }
                className="h-12 rounded-xl border-gray-200"
              />
              <p className="text-xs text-gray-400 mt-1.5">If provided, reports will also be sent to this email.</p>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={
                loading ||
                !formData.full_name ||
                !formData.class_grade ||
                !formData.board ||
                formData.parent_phone.length !== 10
              }
              className="w-full h-12 gradient-accent text-white rounded-xl text-base font-semibold hover:shadow-lg hover:shadow-[#e94560]/30 transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Get Started 🚀"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

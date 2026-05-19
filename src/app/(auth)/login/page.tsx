"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch {
      toast.error("Failed to login with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#e94560]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0f3460]/30 rounded-full blur-3xl animate-float stagger-3" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mx-auto w-24 h-24 mb-6 relative">
              <Image src="/images/vidyazo-logo.png" alt="Vidyazo Logo" fill className="object-cover rounded-full shadow-lg" priority />
            </div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">Welcome Back!</h1>
            <div className="flex items-center justify-center gap-1.5 text-gray-500 text-sm bg-gray-50 inline-flex px-4 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-[#e94560]" />
              <span>Your Smart Study Partner</span>
            </div>
          </div>

          <div className="space-y-6 mt-10">
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              variant="outline"
              className="w-full h-14 rounded-2xl text-lg font-semibold border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-all duration-300 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <GoogleIcon />
                  Continue with Google
                </>
              )}
            </Button>
            
            <p className="text-center text-xs text-gray-400 mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

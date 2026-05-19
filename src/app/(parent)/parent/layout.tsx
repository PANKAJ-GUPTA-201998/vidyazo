"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  BarChart3,
  CreditCard,
  LogOut,
  Users,
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { loading, signOut } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#e94560] mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Hide nav on login page
  if (pathname === "/parent/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center">
          <Image src="/images/vidyazo-logo.png" alt="Vidyazo Logo" width={48} height={48} className="rounded-full shadow-sm" priority />
          <span className="font-bold text-[#1a1a2e] ml-2">Parent Portal</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={signOut}
            className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pb-20 px-4 py-6 max-w-2xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 z-40">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          <Link
            href="/parent/dashboard"
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
              pathname === "/parent/dashboard"
                ? "text-[#e94560]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Home className={`w-5 h-5 ${pathname === "/parent/dashboard" ? "stroke-[2.5px]" : ""}`} />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <div className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-gray-300 cursor-not-allowed">
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] font-medium">Reports</span>
          </div>
          <div className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-gray-300 cursor-not-allowed">
            <CreditCard className="w-5 h-5" />
            <span className="text-[10px] font-medium">Fees</span>
          </div>
        </div>
      </nav>
    </div>
  );
}

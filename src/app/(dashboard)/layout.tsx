"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Video,
  ClipboardList,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { Loader2 } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/classes", icon: Video, label: "Classes" },
  { href: "/dashboard", icon: ClipboardList, label: "Tests" },
  { href: "/reports", icon: BarChart3, label: "Reports" },
  { href: "/dashboard", icon: User, label: "Profile" },
];

export default function DashboardLayout({
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

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center">
          <Image src="/images/vidyazo-logo.png" alt="Vidyazo Logo" width={48} height={48} className="rounded-full shadow-sm" priority />
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <button
            onClick={signOut}
            className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
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
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-[#e94560]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : ""}`}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-[#e94560]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

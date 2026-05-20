"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight, ChevronDown, BookOpen, Star, FileText, IndianRupee, Globe, Target, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

const EXPLORE_LINKS = [
  { label: "Subjects", href: "/subjects", description: "Maths, English, Sanskrit & Science", icon: BookOpen },
  { label: "Features", href: "/features", description: "Live classes & tracking", icon: Star },
  { label: "Reports", href: "/ai-reports", description: "Weekly progress for parents", icon: FileText },
  { label: "Pricing", href: "/pricing", description: "Affordable plans for all", icon: IndianRupee },
  { label: "Competitive Exams", href: "/competitive-exams", description: "JEE, NEET, CUET & more", icon: Target },
  { label: "Higher Education", href: "/direct-admission", description: "B.Tech, MBBS, MBA & BBA consulting", icon: GraduationCap },
];

export function Navbar({ forceSolid = false }: { forceSolid?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(forceSolid);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(forceSolid || window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [forceSolid]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-full shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/vidyazo-logo.png"
                alt="Vidyazo Logo"
                fill
                sizes="40px"
                className="object-cover"
                priority
                fetchPriority="high"
                unoptimized
              />
            </div>
            <span
              className={`text-2xl font-extrabold tracking-tight ${
                isScrolled ? "text-[#1a1a2e]" : "text-white"
              }`}
            >
              Vidya<span className="text-[#e94560]">zo</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Explore Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button 
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-[#e94560] ${
                  isScrolled ? "text-gray-600" : "text-white/80"
                }`}
              >
                Explore <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              
              {/* Dropdown Content */}
              <div 
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[400px] bg-white rounded-2xl shadow-xl border border-gray-100 p-4 transition-all duration-300 origin-top ${
                  isDropdownOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
                }`}
              >
                <div className="grid grid-cols-2 gap-2">
                  {EXPLORE_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group/link"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover/link:bg-[#e94560]/10 transition-colors flex-shrink-0">
                        <link.icon className="w-5 h-5 text-gray-500 group-hover/link:text-[#e94560] transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-0.5">{link.label}</p>
                        <p className="text-xs text-gray-500 leading-tight">{link.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Founding Member Offer</p>
                  <p className="text-sm text-amber-900">Join our hybrid plan at just ₹1,099/month. Limited seats left!</p>
                </div>
              </div>
            </div>

            <Link
              href="/how-it-works"
              className={`text-sm font-medium transition-colors hover:text-[#e94560] ${
                isScrolled ? "text-gray-600" : "text-white/80"
              }`}
            >
              How it Works
            </Link>

            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-[#e94560] ${
                isScrolled ? "text-gray-600" : "text-white/80"
              }`}
            >
              About
            </Link>

            {/* Direct Admission — animated */}
            <Link
              href="/direct-admission"
              className="flex items-center gap-1.5 group"
            >
              {/* Pulsing dot */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e94560] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e94560]" />
              </span>
              <span className={`text-sm font-semibold transition-colors group-hover:text-[#e94560] ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}>
                Admissions
              </span>
              {/* Animated badge */}
              <span className="animate-pulse-badge inline-flex items-center gap-0.5 text-[9px] bg-[#e94560] text-white px-2 py-0.5 rounded-full font-bold whitespace-nowrap shadow-sm">
                🎓 B.Tech • MBBS • MBA
              </span>
            </Link>
          </div>

          {/* Language Toggle + CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <LanguageToggle />
            <Link href="/parent/login" className="text-sm font-semibold text-white/80 hover:text-white transition-colors px-2">
              Parent Portal
            </Link>
            <Link href="/login">
              <Button
                variant={isScrolled ? "outline" : "secondary"}
                className={`rounded-full font-semibold px-6 ${
                  !isScrolled &&
                  "bg-white/10 text-white hover:bg-white/20 border-white/20"
                }`}
              >
                Login
              </Button>
            </Link>
            <Link href="/login">
              <Button className="rounded-full font-semibold px-6 gradient-accent text-white shadow-lg shadow-[#e94560]/30 hover:shadow-[#e94560]/50 transition-all duration-300 group">
                Start Learning
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X
                className={`w-6 h-6 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              />
            ) : (
              <Menu
                className={`w-6 h-6 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl overflow-hidden transition-all duration-300 origin-top ${
          isMobileMenuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
        }`}
      >
        <div className="px-4 py-6 flex flex-col gap-4">
          {EXPLORE_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 text-lg font-medium text-gray-800 hover:text-[#e94560] py-2 border-b border-gray-50"
            >
              <link.icon className="w-5 h-5 text-gray-400" />
              {link.label}
            </Link>
          ))}
          <Link
            href="/how-it-works"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-medium text-gray-800 hover:text-[#e94560] py-2 border-b border-gray-50"
          >
            How it Works
          </Link>
          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-medium text-gray-800 hover:text-[#e94560] py-2 border-b border-gray-50"
          >
            About
          </Link>

          {/* Direct Admission Mobile */}
          <Link
            href="/direct-admission"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 border-b border-gray-50 group"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e94560] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e94560]" />
              </span>
              <span className="text-lg font-semibold text-gray-800 group-hover:text-[#e94560]">
                Admissions
              </span>
            </div>
            <span className="animate-pulse-badge text-[9px] bg-[#e94560] text-white px-2.5 py-1 rounded-full font-bold">
              🎓 B.Tech • MBBS • MBA
            </span>
          </Link>
          <div className="flex flex-col gap-3 mt-4">
            <Link href="/parent/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full rounded-xl py-6 border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-50">
                Parent Portal
              </Button>
            </Link>
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full rounded-xl py-6">
                Login to Dashboard
              </Button>
            </Link>
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full rounded-xl py-6 gradient-accent text-white">
                Start Learning Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "hi" : "en")}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white text-xs font-semibold transition-all cursor-pointer"
      title="Switch Language"
    >
      <Globe className="w-3.5 h-3.5" />
      {lang === "en" ? "हिं" : "EN"}
    </button>
  );
}

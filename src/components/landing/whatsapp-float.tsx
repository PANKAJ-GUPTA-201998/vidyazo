"use client";

import { MessageCircle, ArrowRight } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function WhatsAppFloat() {
  return (
    <>
      {/* Desktop Floating Button */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] items-center justify-center shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/50 hover:scale-110 transition-all duration-300 animate-pulse-glow"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white fill-white" />
      </a>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-50 animate-slide-up">
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <Button className="w-full h-14 text-base font-bold gradient-accent text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            Book Free Demo <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </a>
      </div>
    </>
  );
}

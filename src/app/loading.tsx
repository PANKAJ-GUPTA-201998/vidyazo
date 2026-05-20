import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center bg-[#f8f9fa] z-[100] fixed inset-0">
      <div className="relative">
        <div className="absolute inset-0 bg-[#e94560]/20 rounded-full blur-xl animate-pulse" />
        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center relative z-10 border border-gray-100">
          <Loader2 className="w-10 h-10 animate-spin text-[#e94560]" />
        </div>
      </div>
      <div className="mt-8 text-center animate-fade-in">
        <h3 className="text-lg font-bold text-[#1a1a2e] mb-1">Vidyazo</h3>
        <p className="text-sm text-gray-500 font-medium">Loading amazing things...</p>
      </div>
    </div>
  );
}

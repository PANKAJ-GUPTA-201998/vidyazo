import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-[#e94560]/20 rounded-full blur-xl animate-pulse" />
        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center relative z-10 border border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-[#e94560]" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-gray-700">Loading your data</h3>
        <p className="text-sm text-gray-400 mt-1">Please wait a moment...</p>
      </div>
    </div>
  );
}

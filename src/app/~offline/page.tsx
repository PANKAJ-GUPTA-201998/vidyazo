"use client";

import { WifiOff, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-0 shadow-lg rounded-3xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-[#1a1a2e] to-[#e94560]" />
        <CardContent className="p-8 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <WifiOff className="w-10 h-10 text-gray-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">
            You&apos;re offline
          </h1>
          <p className="text-gray-500 mb-8">
            Please connect to the internet to continue using Vidyazo.
          </p>

          <Button
            onClick={() => window.location.reload()}
            className="gradient-accent text-white rounded-xl w-full max-w-[200px]"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

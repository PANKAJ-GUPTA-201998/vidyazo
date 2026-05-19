"use client";

import { Send, Copy, CheckCircle, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

type ReportToken = {
  id: string;
  student_id: string;
  token: string;
  student: {
    full_name: string;
    class_grade: number;
    phone: string | null;
  };
};

export default function ReportsClient({ tokens }: { tokens: ReportToken[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getReportUrl = (token: string) => {
    return `${window.location.origin}/parent/report/${token}`;
  };

  const handleCopy = async (id: string, token: string) => {
    try {
      await navigator.clipboard.writeText(getReportUrl(token));
      setCopiedId(id);
      toast.success("Magic Link copied!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleWhatsApp = (phone: string | null, token: string) => {
    if (!phone) {
      toast.error("Student has no phone number attached");
      return;
    }
    const msg = `Hello! Here is your child's weekly AI progress report from Vidyazo: ${getReportUrl(token)}`;
    window.open(`https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Parent Magic Links</h1>
          <p className="text-gray-400 text-sm mt-1">
            Send unique report links to parents
          </p>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {tokens.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl">
            <p className="text-gray-500">No AI Reports generated yet.</p>
          </div>
        ) : (
          tokens.map((token) => (
            <Card
              key={token.id}
              className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a1a2e] to-[#e94560] flex items-center justify-center text-white font-bold flex-shrink-0">
                      {token.student?.full_name?.charAt(0) || "S"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-[#1a1a2e] text-sm truncate">
                          {token.student?.full_name || "Unknown Student"}
                        </h3>
                        <span className="text-xs text-gray-400">
                          Class {token.student?.class_grade}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {token.student?.phone || "No phone"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg text-xs"
                      onClick={() => window.open(getReportUrl(token.token), "_blank")}
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1" />
                      View
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg text-xs"
                      onClick={() => handleCopy(token.id, token.token)}
                    >
                      {copiedId === token.id ? (
                        <CheckCircle className="w-3.5 h-3.5 mr-1 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 mr-1" />
                      )}
                      Copy Link
                    </Button>

                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs"
                      onClick={() => handleWhatsApp(token.student?.phone, token.token)}
                    >
                      <Send className="w-3.5 h-3.5 mr-1" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

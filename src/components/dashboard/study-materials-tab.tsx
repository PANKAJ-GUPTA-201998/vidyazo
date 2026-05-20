"use client";

import { useEffect, useState } from "react";
import { FileText, Download, Lock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStudentMaterials } from "@/lib/actions/materials";
import type { StudyMaterial } from "@/types/database";

export function StudyMaterialsTab() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isActiveSubscriber, setIsActiveSubscriber] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const result = await getStudentMaterials();
      if (result && !Array.isArray(result)) {
        setMaterials(result.materials || []);
        setIsActiveSubscriber(result.isActiveSubscriber || false);
      }
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 py-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center mt-6">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="font-bold text-[#1a1a2e] text-lg mb-2">No Materials Yet</h3>
        <p className="text-gray-500 text-sm">
          Study materials for your class will appear here soon.
        </p>
      </div>
    );
  }

  // Group by subject
  const grouped = materials.reduce((acc, mat) => {
    const subject = mat.subject || "General";
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(mat);
    return acc;
  }, {} as Record<string, StudyMaterial[]>);

  return (
    <div className="space-y-10 mt-2 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[17px] font-bold text-[#111]">Recent Study Materials</h3>
        <Link href="#" className="text-[12px] font-medium text-[#ff4d6d] hover:underline flex items-center gap-1">
          View Library <span className="text-[14px]">→</span>
        </Link>
      </div>

      {Object.entries(grouped).map(([subject, mats], index) => (
        <div key={subject} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {subject}
            </h4>
            <span className="text-[10px] font-medium text-gray-300">
              {mats.length} files
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mats.map((mat) => {
              const canAccess = mat.is_free || isActiveSubscriber;
              return (
                <div
                  key={mat.id}
                  className="bg-white rounded-[20px] border border-gray-100/80 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.03)] p-5 flex flex-col justify-between transition-all hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-[12px] bg-[#fff0f3] flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-[#ff4d6d]" />
                    </div>
                    <div>
                      {mat.topic && (
                        <span className="inline-block px-2 py-0.5 rounded-[4px] bg-gray-100 text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                          {mat.topic}
                        </span>
                      )}
                      <h5 className="font-semibold text-[13px] text-[#111] leading-snug">
                        {mat.title}
                      </h5>
                    </div>
                  </div>

                  <div className="pl-14">
                    {canAccess ? (
                      <a href={mat.file_url || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#112a46] hover:text-blue-600 transition-colors">
                        <Download className="w-3 h-3" />
                        Download PDF
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                        <Lock className="w-3 h-3" />
                        Upgrade to Access
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

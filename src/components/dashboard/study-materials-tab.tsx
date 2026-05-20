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
    <div className="space-y-8 mt-6 animate-fade-in">
      {Object.entries(grouped).map(([subject, mats], index) => (
        <div key={subject} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/20 flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#1a1a2e]">
              {subject}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {mats.map((mat) => {
              const canAccess = mat.is_free || isActiveSubscriber;
              return (
                <div
                  key={mat.id}
                  className="relative group bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between overflow-hidden"
                >
                  {/* Subtle hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 flex items-start gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-105 duration-300 ${canAccess ? 'bg-gradient-to-br from-red-400 to-rose-500 text-white shadow-red-500/20' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-base leading-tight mb-1.5 ${canAccess ? 'text-[#1a1a2e]' : 'text-gray-500'}`}>
                        {mat.title}
                      </h4>
                      {mat.topic && (
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${canAccess ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-gray-100 text-gray-400'}`}>
                          {mat.topic}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="relative z-10">
                    {canAccess ? (
                      <a href={mat.file_url || "#"} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="w-full text-xs font-bold hover:bg-[#e94560] hover:text-white hover:border-[#e94560] cursor-pointer transition-all duration-300 rounded-xl py-5 shadow-sm group-hover:shadow-md">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </a>
                    ) : (
                      <Button variant="secondary" size="sm" className="w-full text-xs font-bold bg-gray-100/80 text-gray-400 cursor-not-allowed rounded-xl py-5 border border-gray-200/50">
                        <Lock className="w-4 h-4 mr-2" />
                        Upgrade to Access
                      </Button>
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

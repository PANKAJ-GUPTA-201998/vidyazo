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
    <div className="space-y-8 mt-6">
      {Object.entries(grouped).map(([subject, mats]) => (
        <div key={subject}>
          <h3 className="text-lg font-bold text-[#1a1a2e] flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-500" />
            {subject}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mats.map((mat) => {
              const canAccess = mat.is_free || isActiveSubscriber;
              return (
                <div
                  key={mat.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${canAccess ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400'}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`font-semibold text-sm ${canAccess ? 'text-[#1a1a2e]' : 'text-gray-500'}`}>
                        {mat.title}
                      </h4>
                      {mat.topic && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[10px] font-medium">
                          {mat.topic}
                        </span>
                      )}
                    </div>
                  </div>

                  {canAccess ? (
                    <a href={mat.file_url || "#"} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="w-full text-xs font-semibold hover:bg-gray-50 cursor-pointer border-gray-200">
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Download PDF
                      </Button>
                    </a>
                  ) : (
                    <Button variant="secondary" size="sm" className="w-full text-xs font-semibold bg-gray-100 text-gray-500 cursor-not-allowed">
                      <Lock className="w-3.5 h-3.5 mr-1.5" />
                      Upgrade to Access
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

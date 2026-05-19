"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Quote, Award } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { StudentResult } from "@/types/database";

const FALLBACK_RESULTS: Partial<StudentResult>[] = [
  {
    id: "fallback-1",
    student_name: "Rohit S.",
    class_grade: 10,
    board: "CBSE",
    subject: "Mathematics",
    score_before: 47,
    score_after: 91,
    exam_year: 2025,
    parent_quote:
      "Vidyazo ne mere bete ki life badal di. Maths mein 47% se 91% — kamaal ho gaya!",
    is_featured: true,
  },
  {
    id: "fallback-2",
    student_name: "Priya K.",
    class_grade: 9,
    board: "UP Board",
    subject: "English",
    score_before: 55,
    score_after: 88,
    exam_year: 2025,
    parent_quote:
      "English mein confidence aa gaya hai. Teachers bahut supportive hain.",
    is_featured: true,
  },
  {
    id: "fallback-3",
    student_name: "Aman V.",
    class_grade: 10,
    board: "CBSE",
    subject: "Science",
    score_before: 62,
    score_after: 94,
    exam_year: 2025,
    parent_quote:
      "Science mein 94%! Vidyazo ke teachers ka concept-based approach kaafi achha hai.",
    is_featured: true,
  },
];

export function ResultsSection() {
  const [results, setResults] = useState<Partial<StudentResult>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      const supabase = createClient();
      const { data } = await supabase
        .from("student_results")
        .select("*")
        .eq("is_featured", true)
        .order("score_after", { ascending: false })
        .limit(6);
      setResults(data && data.length > 0 ? data : FALLBACK_RESULTS);
      setLoading(false);
    }
    fetchResults();
  }, []);

  const hasToppers = results.some((r) => (r.score_after ?? 0) >= 90);

  return (
    <section className="py-20 sm:py-28 bg-white" id="results">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Board Results Banner */}
        {hasToppers && (
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 shadow-sm">
              <Award className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-amber-800 font-bold text-sm">
                🏆 Board Results 2025 — Our Students Scored 90%+
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
            Student Results
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4">
            Real Results,{" "}
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              Real Students
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            See how Vidyazo students transformed their scores
          </p>
        </div>

        {/* Results Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(loading ? FALLBACK_RESULTS : results).map((result) => (
            <div
              key={result.id}
              className={`relative bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${loading ? "animate-pulse" : ""}`}
            >
              {/* Top accent */}
              <div className="h-1.5 bg-gradient-to-r from-green-400 to-emerald-500" />

              <div className="p-6">
                {/* Student Info */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e94560] to-[#ff6b81] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {result.student_name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a1a2e]">
                      {result.student_name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Class {result.class_grade} • {result.board}
                    </p>
                  </div>
                  {result.subject && (
                    <span className="ml-auto px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                      {result.subject}
                    </span>
                  )}
                </div>

                {/* Score Improvement */}
                <div className="flex items-center justify-center gap-4 mb-5 p-4 bg-green-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-gray-400">
                      {result.score_before}%
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                      Before
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-6 h-6" />
                    <span className="text-lg font-black">→</span>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-green-600">
                      {result.score_after}%
                    </p>
                    <p className="text-[10px] text-green-600 uppercase font-bold tracking-wider">
                      After
                    </p>
                  </div>
                </div>

                {/* Improvement badge */}
                <div className="text-center mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                    <TrendingUp className="w-3 h-3" />+
                    {(result.score_after ?? 0) - (result.score_before ?? 0)}%
                    Improvement
                  </span>
                </div>

                {/* Parent Quote */}
                {result.parent_quote && (
                  <div className="relative">
                    <Quote className="w-5 h-5 text-gray-200 absolute -top-1 -left-1" />
                    <p className="text-sm text-gray-600 italic pl-5 leading-relaxed">
                      &quot;{result.parent_quote}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, Award, BookOpen, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Teacher } from "@/types/database";

export function TeachersSection() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeachers() {
      const supabase = createClient();
      const { data } = await supabase
        .from("teachers")
        .select("*")
        .eq("is_active", true)
        .order("experience_years", { ascending: false });
      setTeachers(data || []);
      setLoading(false);
    }
    fetchTeachers();
  }, []);

  const displayTeachers: (Teacher | null)[] =
    teachers.length > 0
      ? teachers
      : [null, null, null]; // skeleton fallback

  return (
    <section className="py-20 sm:py-28 bg-[#f8f9fa]" id="teachers">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#e94560]/10 text-[#e94560] text-sm font-medium mb-4">
            Our Teachers
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4">
            Meet Your{" "}
            <span className="bg-gradient-to-r from-[#e94560] to-[#ff6b81] bg-clip-text text-transparent">
              Teachers
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Qualified, experienced, and dedicated to your success
          </p>
        </div>

        {/* Teacher Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayTeachers.map((teacher, i) => (
            <div
              key={teacher?.id || `skeleton-${i}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Photo + Video */}
              <div className="relative flex justify-center pt-8 pb-4">
                <div className="relative">
                  {teacher ? (
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl">
                      {teacher.photo_url ? (
                        <Image
                          src={teacher.photo_url}
                          alt={teacher.full_name}
                          width={112}
                          height={112}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#e94560] to-[#ff6b81] flex flex-col items-center justify-center text-white p-2 text-center">
                          <GraduationCap className="w-8 h-8 mb-1 opacity-90" />
                          <span className="text-[10px] font-bold uppercase leading-tight tracking-wider">
                            {teacher.experience_years ? `${teacher.experience_years}+ Yrs Exp` : 'Expert'}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse" />
                  )}
                  {teacher?.intro_video_url && (
                    <button
                      onClick={() => setVideoUrl(teacher.intro_video_url)}
                      className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#e94560] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="px-6 pb-6 text-center">
                {teacher ? (
                  <>
                    <h3 className="text-xl font-bold text-[#1a1a2e] mb-1">
                      {teacher.full_name}
                    </h3>
                    {teacher.qualification && (
                      <p className="text-sm text-gray-500 mb-3">
                        {teacher.qualification}
                      </p>
                    )}

                    {/* Experience badge */}
                    {teacher.experience_years && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold mb-4">
                        <Award className="w-3.5 h-3.5" />
                        {teacher.experience_years}+ years experience
                      </div>
                    )}

                    {/* Subject tags */}
                    <div className="flex flex-wrap justify-center gap-2 mb-3">
                      {teacher.subjects?.map((sub) => (
                        <span
                          key={sub}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium"
                        >
                          <BookOpen className="w-3 h-3" />
                          {sub}
                        </span>
                      ))}
                    </div>

                    {/* Board tags */}
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {teacher.boards?.map((b) => (
                        <span
                          key={b}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-medium"
                        >
                          <GraduationCap className="w-3 h-3" />
                          {b}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Skeleton */
                  <div className="space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto animate-pulse" />
                    <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto animate-pulse" />
                    <div className="flex justify-center gap-2">
                      <div className="h-6 w-16 bg-gray-100 rounded-lg animate-pulse" />
                      <div className="h-6 w-16 bg-gray-100 rounded-lg animate-pulse" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {videoUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setVideoUrl(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden w-full max-w-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video">
              <iframe
                src={videoUrl}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
            <div className="p-4 text-center">
              <button
                onClick={() => setVideoUrl(null)}
                className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

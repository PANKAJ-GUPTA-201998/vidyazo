import { TrendingUp, TrendingDown, BookOpen, Award, Home, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getLatestReportByToken } from "@/features/ai/actions";

export default async function ParentReportPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const dbReport = await getLatestReportByToken(token);

  if (!dbReport) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] py-6 px-4 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-800">Report Not Found</h1>
          <p className="text-gray-500 mt-2">The link might be invalid or expired.</p>
        </div>
      </div>
    );
  }

  const { content, student, week_start } = dbReport;

  const report = {
    student_name: student.full_name,
    class_grade: student.class_grade,
    board: student.board,
    week: `Week of ${new Date(week_start).toLocaleDateString()}`,
    overall_score: content.overall_score,
    previous_score: content.previous_score || 0,
    topics: content.topics,
    weak_topics: content.weak_topics,
    strong_topics: content.strong_topics,
    ai_comment_hindi: content.ai_comment_hindi,
    teacher_note: content.teacher_note,
  };

  const change = report.overall_score - report.previous_score;

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-6 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Image src="/images/vidyazo-logo.png" alt="Vidyazo Logo" width={64} height={64} className="mx-auto rounded-full shadow-sm mb-2" priority />
          <h1 className="sr-only">Vidyazo</h1>
          <p className="text-gray-400 text-sm">Weekly Progress Report</p>
        </div>

        {/* Report Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Student Info */}
          <div className="gradient-hero p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Weekly Report</h2>
                <p className="text-white/50 text-sm">{report.week}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e94560] flex items-center justify-center text-white font-bold">
                {report.student_name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{report.student_name}</p>
                <p className="text-white/50 text-sm">
                  Class {report.class_grade} • {report.board}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Overall Score */}
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl">
              <div>
                <p className="text-sm text-gray-500 mb-1">Overall Score</p>
                <p className="text-4xl font-extrabold text-green-600">
                  {report.overall_score}%
                </p>
              </div>
              <div className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1.5 rounded-full">
                {change >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {change >= 0 ? "+" : ""}
                  {change}% from last week
                </span>
              </div>
            </div>

            {/* Topic Performance */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Topic Performance
              </h4>
              <div className="space-y-3">
                {report.topics.map((topic: { name: string; score: number; bgColor: string; color: string }) => (
                  <div key={topic.name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-700 font-medium">
                        {topic.name}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {topic.score}%
                      </span>
                    </div>
                    <div className={`h-2.5 rounded-full ${topic.bgColor}`}>
                      <div
                        className={`h-2.5 rounded-full ${topic.color}`}
                        style={{ width: `${topic.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak & Strong */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-semibold text-red-600 uppercase">
                    Focus Areas
                  </span>
                </div>
                <div className="space-y-1">
                  {report.weak_topics.map((t: string) => (
                    <span
                      key={t}
                      className="inline-block px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-xs font-medium mr-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-semibold text-green-600 uppercase">
                    Strong Areas
                  </span>
                </div>
                <div className="space-y-1">
                  {report.strong_topics.map((t: string) => (
                    <span
                      key={t}
                      className="inline-block px-2 py-0.5 rounded-md bg-green-100 text-green-700 text-xs font-medium mr-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Comment (Hindi) */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-1.5 mb-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold text-blue-600 uppercase">
                  AI Analysis (Hindi)
                </span>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">
                &quot;{report.ai_comment_hindi}&quot;
              </p>
            </div>

            {/* Teacher Note */}
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs font-semibold text-purple-600 uppercase">
                  👨‍🏫 Teacher&apos;s Note
                </span>
              </div>
              <p className="text-sm text-purple-800 leading-relaxed">
                &quot;{report.teacher_note}&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#e94560] transition-colors"
          >
            <Home className="w-4 h-4" />
            Visit Vidyazo
          </Link>
          <p className="text-xs text-gray-300 mt-2">
            This report was generated by Vidyazo AI
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Clock, ChevronRight, ChevronLeft, Send, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { submitTest } from "@/lib/actions/tests";

type TestQuestion = {
  id: string;
  question: string;
  topic: string;
  options: string[];
  correct_answer: number;
};

type Test = {
  id: string;
  title: string;
  duration_minutes: number;
  week_number?: number;
  questions?: TestQuestion[];
};

export default function TestClient({ test }: { test: Test }) {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(test.duration_minutes * 60);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = test.questions || [];

  const handleSubmitTest = useCallback(async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await submitTest({
        test_id: test.id,
        answers,
        time_taken_seconds: test.duration_minutes * 60 - timeLeft,
      });
      setSubmitted(true);
      toast.success("Test submitted successfully! 🎉");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to submit test";
      toast.error(msg);
      setIsSubmitting(false);
    }
  }, [answers, router, test.duration_minutes, test.id, timeLeft, isSubmitting]);

  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, handleSubmitTest]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const question = questions[currentQ];
  const answeredCount = Object.keys(answers).length;
  const isLowTime = timeLeft < 300; // less than 5 min

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4">
        <Card className="border-0 shadow-xl rounded-3xl max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">
              Test Submitted!
            </h2>
            <p className="text-gray-400 mb-4">
              You answered {answeredCount}/{questions.length} questions
            </p>
            <p className="text-sm text-gray-400">
              Redirecting to dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div>
          <h1 className="text-sm font-bold text-[#1a1a2e]">{test.title}</h1>
          <p className="text-[10px] text-gray-400">Week {test.week_number} • {questions.length} Questions</p>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
            isLowTime
              ? "bg-red-50 text-red-600"
              : "bg-gray-50 text-gray-600"
          }`}
        >
          <Clock className={`w-4 h-4 ${isLowTime ? "animate-pulse" : ""}`} />
          <span className="text-sm font-mono font-bold">
            {formatTime(timeLeft)}
          </span>
        </div>
      </header>

      {/* Question */}
      <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
        <div className="space-y-6">
          {/* Progress dots */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-7 h-7 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                  currentQ === i
                    ? "gradient-accent text-white scale-110"
                    : answers[questions[i].id] !== undefined
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Question Card */}
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-purple-50 text-purple-700 text-xs">
                  {question.topic}
                </Badge>
                <span className="text-xs text-gray-400">
                  Q{currentQ + 1}/{questions.length}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-6 leading-relaxed">
                {question.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option, idx) => {
                  const isSelected = answers[question.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() =>
                        setAnswers({ ...answers, [question.id]: idx })
                      }
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-[#e94560] bg-[#e94560]/5"
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          isSelected
                            ? "gradient-accent text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {["A", "B", "C", "D"][idx]}
                      </div>
                      <span
                        className={`text-sm ${
                          isSelected
                            ? "text-[#1a1a2e] font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
              disabled={currentQ === 0}
              className="rounded-xl cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            {currentQ < questions.length - 1 ? (
              <Button
                onClick={() => setCurrentQ(currentQ + 1)}
                className="gradient-accent text-white rounded-xl cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white rounded-xl cursor-pointer"
              >
                <Send className="w-4 h-4 mr-1.5" />
                {isSubmitting ? "Submitting..." : "Submit Test"}
              </Button>
            )}
          </div>

          {/* Unanswered warning */}
          {answeredCount < questions.length && (
            <div className="flex items-center gap-2 justify-center text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-xl">
              <AlertCircle className="w-4 h-4" />
              {questions.length - answeredCount} questions unanswered
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Test, TestSubmission } from "@/types/database";

export default function TestClient({ test, existingSubmission }: { test: Test; existingSubmission: TestSubmission | null }) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(test.duration_minutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<TestSubmission | null>(existingSubmission);

  // Warning on refresh
  useEffect(() => {
    if (started && !results) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [started, results]);

  // Timer
  useEffect(() => {
    if (started && !results && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit(answers, 0); // auto submit
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [started, results, timeLeft]);

  const handleSubmit = async (currentAnswers: Record<string, number>, finalTimeLeft: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const timeTaken = test.duration_minutes * 60 - finalTimeLeft;
      const res = await fetch("/api/tests/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          test_id: test.id,
          answers: currentAnswers,
          time_taken_seconds: timeTaken,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit test");

      setResults(data.submission);
      toast.success("Test submitted successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (results) {
    const percentage = Math.round((results.score / results.total) * 100);
    let badge = "Keep Trying";
    if (percentage > 80) badge = "Excellent";
    else if (percentage > 60) badge = "Good";
    else if (percentage > 40) badge = "Needs Work";

    return (
      <div className="container mx-auto max-w-3xl py-8 px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Test Results</CardTitle>
            <div className="text-xl text-muted-foreground mt-2">{test.title}</div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4 mb-8">
              <div className="text-6xl font-bold text-primary">
                {results.score} / {results.total}
              </div>
              <div className="px-4 py-1 bg-primary/10 text-primary font-semibold rounded-full">
                {badge}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Topic Breakdown</h3>
              {Object.entries(results.topic_scores).map(([topic, { correct, total }]) => {
                const topicPct = (correct / total) * 100;
                let colorClass = "bg-red-500";
                if (topicPct >= 70) colorClass = "bg-green-500";
                else if (topicPct >= 50) colorClass = "bg-yellow-500";

                return (
                  <div key={topic} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{topic}</span>
                      <span>{correct}/{total} ({Math.round(topicPct)}%)</span>
                    </div>
                    {/* Render a custom progress bar to control colors easily */}
                    <div className="relative flex h-2 w-full items-center overflow-hidden rounded-full bg-muted">
                      <div className={`h-full transition-all ${colorClass}`} style={{ width: `${topicPct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 space-y-6">
              <h3 className="text-xl font-semibold">Question Review</h3>
              {test.questions.map((q, idx) => {
                const studentAnswer = results.answers[q.id];
                const isCorrect = studentAnswer === q.correct;
                return (
                  <div key={idx} className={`p-4 border rounded-lg ${isCorrect ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}`}>
                    <div className="font-medium mb-2">{idx + 1}. {q.question}</div>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className={`px-3 py-2 rounded border ${
                          optIdx === q.correct ? "bg-green-100 border-green-300 font-medium" :
                          optIdx === studentAnswer ? "bg-red-100 border-red-300" : "bg-card border-muted"
                        }`}>
                          {String.fromCharCode(65 + optIdx)}. {opt}
                          {optIdx === q.correct && " (Correct)"}
                          {optIdx === studentAnswer && optIdx !== q.correct && " (Your Answer)"}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center">
              <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="container mx-auto max-w-2xl py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{test.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-muted rounded-lg">
                <div className="font-semibold text-muted-foreground">Duration</div>
                <div className="text-lg">{test.duration_minutes} Minutes</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="font-semibold text-muted-foreground">Questions</div>
                <div className="text-lg">{test.questions.length}</div>
              </div>
            </div>
            
            <div className="bg-yellow-500/10 text-yellow-600 p-4 rounded-lg text-sm font-medium border border-yellow-500/20">
              Warning: Once started, you must finish. The timer will keep running. Do not close or refresh this page.
            </div>

            <Button className="w-full text-lg py-6" onClick={() => setStarted(true)}>
              Start Test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = test.questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="container mx-auto max-w-3xl py-4 px-4 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center justify-between mb-4 bg-card border p-4 rounded-lg shadow-sm">
        <div className="font-semibold text-muted-foreground">
          Question {currentQuestionIndex + 1} of {test.questions.length}
        </div>
        <div className="font-mono text-xl font-bold text-primary">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      </div>

      <Card className="flex-1 overflow-y-auto mb-4 border-2">
        <CardContent className="p-6">
          <div className="text-xl font-medium mb-8">
            {currentQ.question}
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setAnswers({ ...answers, [currentQ.id]: idx })}
                className={`p-4 text-left rounded-lg border-2 transition-all ${
                  answers[currentQ.id] === idx 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-muted hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-semibold ${
                    answers[currentQ.id] === idx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Palette & Controls */}
      <div className="bg-card border p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-wrap gap-2 justify-center max-h-32 overflow-y-auto p-2">
          {test.questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = currentQuestionIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-10 h-10 rounded-full font-semibold transition-all ${
                  isCurrent ? "ring-2 ring-primary ring-offset-2" : ""
                } ${
                  isAnswered ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between pt-2 border-t mt-4">
          <Button 
            variant="outline" 
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          >
            Previous
          </Button>

          {currentQuestionIndex === test.questions.length - 1 ? (
            <Button 
              onClick={() => {
                if (confirm("Are you sure you want to submit the test?")) {
                  handleSubmit(answers, timeLeft);
                }
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Test"}
            </Button>
          ) : (
            <Button 
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

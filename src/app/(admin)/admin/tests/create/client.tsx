/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  GripVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";

interface Question {
  id: string;
  question: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
}

const difficultyColors = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
};

import { createTest } from "@/lib/actions/tests";

export default function CreateTestClient({ batches }: { batches: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [testInfo, setTestInfo] = useState({
    title: "",
    batch_id: "",
    week_number: "",
    duration: "30",
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState<Question>({
    id: "",
    question: "",
    options: ["", "", "", ""],
    correct: 0,
    topic: "",
    difficulty: "medium",
  });

  const addQuestion = () => {
    if (!currentQ.question || currentQ.options.some((o) => !o)) {
      toast.error("Please fill all fields");
      return;
    }
    setQuestions([
      ...questions,
      { ...currentQ, id: `q_${Date.now()}` },
    ]);
    setCurrentQ({
      id: "",
      question: "",
      options: ["", "", "", ""],
      correct: 0,
      topic: "",
      difficulty: "medium",
    });
    toast.success("Question added!");
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/tests">
          <Button variant="ghost" size="icon" className="rounded-xl cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Create Test</h1>
          <p className="text-gray-400 text-sm">
            Step {step} of 2 —{" "}
            {step === 1 ? "Test Info" : "Add Questions"}
          </p>
        </div>
      </div>

      {step === 1 ? (
        /* Step 1: Test Info */
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Test Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Test Title
              </label>
              <Input
                placeholder='e.g. "Weekly Math Test - Week 5"'
                value={testInfo.title}
                onChange={(e) =>
                  setTestInfo({ ...testInfo, title: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Batch
                </label>
                <Select
                  value={testInfo.batch_id}
                  onValueChange={(v) =>
                    setTestInfo({ ...testInfo, batch_id: v ?? "" })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map(b => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name} (Class {b.class_grade})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Week Number
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 5"
                  value={testInfo.week_number}
                  onChange={(e) =>
                    setTestInfo({ ...testInfo, week_number: e.target.value })
                  }
                  className="rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Duration (minutes)
              </label>
              <Input
                type="number"
                value={testInfo.duration}
                onChange={(e) =>
                  setTestInfo({ ...testInfo, duration: e.target.value })
                }
                className="rounded-xl w-32"
              />
            </div>
            <Button
              onClick={() => {
                if (!testInfo.title || !testInfo.batch_id) {
                  toast.error("Please fill all required fields");
                  return;
                }
                setStep(2);
              }}
              className="gradient-accent text-white rounded-xl cursor-pointer"
            >
              Next: Add Questions
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Step 2: Add Questions */
        <>
          {/* Question Form */}
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">
                Add Question ({questions.length} added)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Question
                </label>
                <textarea
                  placeholder="Type your question here..."
                  value={currentQ.question}
                  onChange={(e) =>
                    setCurrentQ({ ...currentQ, question: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none h-24 focus:outline-none focus:border-[#e94560] focus:ring-2 focus:ring-[#e94560]/20"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Options (select correct answer)
                </label>
                {["A", "B", "C", "D"].map((label, idx) => (
                  <div key={label} className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentQ({
                          ...currentQ,
                          correct: idx as 0 | 1 | 2 | 3,
                        })
                      }
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all cursor-pointer ${
                        currentQ.correct === idx
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {label}
                    </button>
                    <Input
                      placeholder={`Option ${label}`}
                      value={currentQ.options[idx]}
                      onChange={(e) => {
                        const opts = [...currentQ.options] as [
                          string,
                          string,
                          string,
                          string,
                        ];
                        opts[idx] = e.target.value;
                        setCurrentQ({ ...currentQ, options: opts });
                      }}
                      className="rounded-xl"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Topic
                  </label>
                  <Input
                    placeholder="e.g. Algebra"
                    value={currentQ.topic}
                    onChange={(e) =>
                      setCurrentQ({ ...currentQ, topic: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Difficulty
                  </label>
                  <Select
                    value={currentQ.difficulty}
                    onValueChange={(v) =>
                      setCurrentQ({
                        ...currentQ,
                        difficulty: v as "easy" | "medium" | "hard",
                      })
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={addQuestion}
                className="gradient-accent text-white rounded-xl cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </CardContent>
          </Card>

          {/* Added Questions List */}
          {questions.length > 0 && (
            <Card className="border-0 shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">
                  Questions ({questions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {questions.map((q, i) => (
                  <div
                    key={q.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <GripVertical className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1a1a2e] mb-1">
                        Q{i + 1}. {q.question}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge className="text-[10px] bg-blue-50 text-blue-700">
                          {q.topic || "No topic"}
                        </Badge>
                        <Badge
                          className={`text-[10px] ${difficultyColors[q.difficulty]}`}
                        >
                          {q.difficulty}
                        </Badge>
                        <Badge className="text-[10px] bg-green-50 text-green-700">
                          Ans: {["A", "B", "C", "D"][q.correct]}
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => removeQuestion(q.id)}
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Save Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="rounded-xl cursor-pointer"
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button
              variant="outline"
              className="rounded-xl cursor-pointer"
              disabled={isSubmitting || questions.length === 0}
              onClick={async () => {
                try {
                  setIsSubmitting(true);
                  await createTest({
                    batch_id: testInfo.batch_id,
                    title: testInfo.title,
                    week_number: parseInt(testInfo.week_number),
                    duration_minutes: parseInt(testInfo.duration),
                    questions: questions.map(q => ({
                      id: q.id,
                      question: q.question,
                      options: q.options,
                      correct: q.correct,
                      topic: q.topic || "General",
                      difficulty: q.difficulty
                    })),
                    is_active: false
                  });
                  toast.success("Test saved as draft!");
                  router.push("/admin/tests");
                } catch (e: any) {
                  toast.error(e.message || "Failed to save test");
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              className="gradient-accent text-white rounded-xl cursor-pointer"
              disabled={questions.length < 5 || isSubmitting}
              onClick={async () => {
                try {
                  setIsSubmitting(true);
                  await createTest({
                    batch_id: testInfo.batch_id,
                    title: testInfo.title,
                    week_number: parseInt(testInfo.week_number),
                    duration_minutes: parseInt(testInfo.duration),
                    questions: questions.map(q => ({
                      id: q.id,
                      question: q.question,
                      options: q.options,
                      correct: q.correct,
                      topic: q.topic || "General",
                      difficulty: q.difficulty
                    })),
                    is_active: true
                  });
                  toast.success("Test activated successfully!");
                  router.push("/admin/tests");
                } catch (e: any) {
                  toast.error(e.message || "Failed to create test");
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              {isSubmitting ? "Activating..." : `Activate Test (${questions.length}/5 min)`}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

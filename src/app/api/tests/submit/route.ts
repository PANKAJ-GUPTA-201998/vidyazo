import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { test_id, answers, time_taken_seconds } = body;

    if (!test_id || !answers) {
      return NextResponse.json({ error: "Missing test_id or answers" }, { status: 400 });
    }

    // 1. Fetch test
    const { data: test, error: testError } = await supabase
      .from("tests")
      .select("*")
      .eq("id", test_id)
      .single();

    if (testError || !test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // 2. Check if already submitted
    const { data: existingSubmission } = await supabase
      .from("test_submissions")
      .select("id")
      .eq("test_id", test_id)
      .eq("student_id", user.id)
      .single();

    if (existingSubmission) {
      return NextResponse.json({ error: "Test already submitted" }, { status: 400 });
    }

    // 3. Calculate score
    let score = 0;
    const total = test.questions.length;
    const topic_scores: Record<string, { correct: number; total: number }> = {};

    test.questions.forEach((q: any) => {
      // Initialize topic
      if (!topic_scores[q.topic]) {
        topic_scores[q.topic] = { correct: 0, total: 0 };
      }
      
      topic_scores[q.topic].total += 1;
      
      const studentAnswer = answers[q.id];
      if (studentAnswer !== undefined && studentAnswer === q.correct) {
        score += 1;
        topic_scores[q.topic].correct += 1;
      }
    });

    // 4. Insert submission
    const submissionData = {
      test_id,
      student_id: user.id,
      answers,
      score,
      total,
      topic_scores,
      time_taken_seconds: time_taken_seconds || null,
      submitted_at: new Date().toISOString(),
    };

    const { data: newSubmission, error: insertError } = await supabase
      .from("test_submissions")
      .insert(submissionData)
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
    }

    return NextResponse.json({ success: true, submission: newSubmission });
  } catch (error: any) {
    console.error("Test submission error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

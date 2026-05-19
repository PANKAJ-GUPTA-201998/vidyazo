"use server";

import Anthropic from "@anthropic-ai/sdk";
import { createServiceRoleClient } from "@/lib/supabase/server";

type TopicData = { correct: number; total: number };
type AnthropicTextBlock = { type: "text"; text: string };

export async function generateAIReport(submissionId: string) {
  const supabase = await createServiceRoleClient();
  
  // 1. Fetch submission details
  const { data: submission, error: subError } = await supabase
    .from("test_submissions")
    .select("*, test:tests(title, week_number), student:profiles(full_name, class_grade)")
    .eq("id", submissionId)
    .single();

  if (subError || !submission) {
    throw new Error("Submission not found");
  }

  // 2. Identify weak and strong topics
  const topics = Object.entries(submission.topic_scores as Record<string, TopicData>);
  const weakTopics = topics
    .filter(([, data]) => (data.correct / data.total) < 0.6)
    .map(([topic]) => topic);
    
  const strongTopics = topics
    .filter(([, data]) => (data.correct / data.total) >= 0.8)
    .map(([topic]) => topic);

  // 3. Call Anthropic
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const prompt = `You are an expert AI tutor for an Indian student named ${submission.student?.full_name} in Class ${submission.student?.class_grade}.
They just took a test: ${submission.test?.title} (Week ${submission.test?.week_number}).
Score: ${submission.score}/${submission.total}.
Strong Topics: ${strongTopics.join(", ") || "None yet"}.
Weak Topics: ${weakTopics.join(", ") || "None"}.

Generate a 2-sentence encouraging report for the parent in Hinglish (Hindi written in English alphabet) and a 1-sentence note for the teacher.

Return ONLY a JSON object exactly like this:
{
  "ai_comment_hindi": "...",
  "teacher_note": "..."
}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 300,
      system: "You are a helpful AI tutor returning raw JSON only.",
      messages: [{ role: "user", content: prompt }],
    });

    const text = (response.content[0] as AnthropicTextBlock).text;
    const aiOutput = JSON.parse(text);

    // 4. Save to ai_reports table
    const { data: report, error: reportError } = await supabase
      .from("ai_reports")
      .insert({
        student_id: submission.student_id,
        week_start: new Date().toISOString().split('T')[0], // Simplified
        content: {
          overall_score: Math.round((submission.score / submission.total) * 100),
          previous_score: 0, // Mock for now
          topics: topics.map(([name, data]) => ({
            name,
            score: Math.round((data.correct / data.total) * 100),
            color: (data.correct / data.total) > 0.7 ? "bg-green-500" : "bg-orange-500",
            bgColor: (data.correct / data.total) > 0.7 ? "bg-green-100" : "bg-orange-100",
          })),
          weak_topics: weakTopics,
          strong_topics: strongTopics,
          ai_comment_hindi: aiOutput.ai_comment_hindi,
          teacher_note: aiOutput.teacher_note,
        }
      })
      .select()
      .single();

    if (reportError) throw reportError;

    // 5. Ensure parent has a token
    const { data: existingToken } = await supabase
      .from("parent_tokens")
      .select("token")
      .eq("student_id", submission.student_id)
      .single();

    if (!existingToken) {
      // Create a unique token (e.g. vidyazo-XXXXXX)
      const token = `vz-${Math.random().toString(36).substring(2, 10)}`;
      await supabase.from("parent_tokens").insert({
        student_id: submission.student_id,
        token,
      });
      console.log("Created new parent token:", token);
      // TODO: Trigger WhatsApp API here to send the link
    }

    return report;

  } catch (error) {
    console.error("AI Generation failed:", error);
    throw error;
  }
}

export async function getLatestReportByToken(token: string) {
  const supabase = await createServiceRoleClient();

  // 1. Get student ID from token
  const { data: tokenData, error: tokenError } = await supabase
    .from("parent_tokens")
    .select("student_id, is_active")
    .eq("token", token)
    .single();

  if (tokenError || !tokenData || !tokenData.is_active) {
    return null;
  }

  // 2. Fetch the latest report for this student
  const { data: report, error: reportError } = await supabase
    .from("ai_reports")
    .select("*, student:profiles(full_name, class_grade, board)")
    .eq("student_id", tokenData.student_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (reportError || !report) {
    return null;
  }

  return report;
}

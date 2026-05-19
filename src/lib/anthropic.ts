import Anthropic from "@anthropic-ai/sdk";
import type { ReportContent } from "@/types/database";

let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });
  }
  return anthropicClient;
}

interface StudentData {
  name: string;
  classGrade: number;
  board: string;
  topicScores: Record<string, { correct: number; total: number }>;
  last4WeeksScores: number[];
  attendedClasses: number;
  totalClasses: number;
}

const SYSTEM_PROMPT = `You are a caring Indian school tutor analyzing a student's weekly performance. Generate a progress report in JSON format. Be encouraging but honest. Mix Hindi and English naturally (Hinglish) for the parent message. Use simple language that a Tier 2/3 city parent understands.`;

export async function generateWeeklyReport(
  studentData: StudentData,
  retries = 3
): Promise<ReportContent> {
  const client = getAnthropicClient();

  const userPrompt = `Student: ${studentData.name}, Class: ${studentData.classGrade}, Board: ${studentData.board}
This week's test scores by topic:
${JSON.stringify(studentData.topicScores, null, 2)}
Last 4 weeks overall scores: ${JSON.stringify(studentData.last4WeeksScores)}
Classes attended this week: ${studentData.attendedClasses}/${studentData.totalClasses}

Generate a JSON report with:
{
  "summary_hindi": "2-3 line summary in Hindi for parent WhatsApp",
  "summary_english": "2-3 line summary in English",
  "weak_topics": ["topic1", "topic2"],
  "strong_topics": ["topic1", "topic2"],
  "recommendations": ["specific action 1", "specific action 2"],
  "parent_message": "Complete WhatsApp message for parent in Hinglish, 4-5 lines, include student name, key stats, what to focus on, encouraging tone",
  "score_trend": "improving" | "stable" | "declining",
  "effort_rating": 1-5
}
Return ONLY valid JSON, no other text.`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const message = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

      const responseText =
        message.content[0].type === "text" ? message.content[0].text : "";

      // Parse JSON from response (handle potential markdown wrapping)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in Claude response");
      }

      const report: ReportContent = JSON.parse(jsonMatch[0]);
      return report;
    } catch (error) {
      console.error(
        `Attempt ${attempt}/${retries} failed for ${studentData.name}:`,
        error
      );
      if (attempt === retries) {
        throw error;
      }
      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }

  throw new Error("All retry attempts exhausted");
}

import { NextResponse } from "next/server";
import { generateWeeklyReports } from "@/lib/actions/reports";
import { sendAllPendingReports } from "@/lib/actions/notifications";

/**
 * POST /api/cron/weekly-report
 * Called weekly by Vercel Cron to:
 * 1. Generate AI reports for all active students
 * 2. Send reports to parents via WhatsApp
 */
export async function POST(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate week start (last Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const lastMonday = new Date(now);
    lastMonday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    const weekStart = lastMonday.toISOString().split("T")[0];

    // Step 1: Generate AI reports
    const generated = await generateWeeklyReports(weekStart);
    console.log(`[CRON] Generated ${generated} AI reports for week ${weekStart}`);

    // Step 2: Send to parents
    const sent = await sendAllPendingReports();
    console.log(`[CRON] Sent ${sent} reports to parents`);

    return NextResponse.json({
      success: true,
      week: weekStart,
      generated,
      sent,
    });
  } catch (error) {
    console.error("[CRON] Weekly report error:", error);
    return NextResponse.json(
      { error: "Failed to process weekly reports" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createBatchNotifications } from "@/lib/actions/notifications";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createServiceRoleClient();

    // Find classes in the next 24 hours
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const { data: upcomingClasses, error } = await supabase
      .from("classes")
      .select("id, batch_id, title, topic, scheduled_at")
      .eq("status", "scheduled")
      .gte("scheduled_at", now.toISOString())
      .lte("scheduled_at", tomorrow.toISOString());

    if (error) {
      console.error("Error fetching upcoming classes:", error);
      return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
    }

    let totalNotifications = 0;

    for (const cls of upcomingClasses || []) {
      const scheduledTime = new Date(cls.scheduled_at);
      const timeStr = scheduledTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const count = await createBatchNotifications(
        cls.batch_id,
        "class_reminder",
        `📚 Class Today: ${cls.title}`,
        `Your class on "${cls.topic}" is at ${timeStr}. Don't miss it!`,
        "/classes"
      );
      totalNotifications += count;
    }

    return NextResponse.json({
      success: true,
      classesFound: upcomingClasses?.length || 0,
      notificationsSent: totalNotifications,
    });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

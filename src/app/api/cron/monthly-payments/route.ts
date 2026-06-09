import { NextResponse } from "next/server";
import { generateMonthlyPayments } from "@/features/payments/actions";

/**
 * POST /api/cron/monthly-payments
 * Called on the 1st of each month to generate payment records
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const created = await generateMonthlyPayments(month);
    console.log(`[CRON] Generated ${created} payment records for ${month}`);

    return NextResponse.json({ success: true, month, created });
  } catch (error) {
    console.error("[CRON] Monthly payments error:", error);
    return NextResponse.json(
      { error: "Failed to generate payments" },
      { status: 500 }
    );
  }
}

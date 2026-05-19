import { getMyReports } from "@/lib/actions/reports";
import ReportsClient from "./client";

export default async function ReportsPage() {
  const reports = await getMyReports();

  // If we wanted to calculate overall trend, we would compare the most recent report 
  // to the one before it. The API returns it sorted by newest first.
  let overallTrend = {
    label: "No Data",
    icon: "stable", // 'improving', 'stable', 'declining'
    change: "+0% over last week",
  };

  // We can calculate overall trend by taking the latest report's score trend
  if (reports && reports.length > 0) {
    const latest = reports[0];
    const scoreTrend = latest.content.score_trend;
    overallTrend = {
      label: scoreTrend === "improving" ? "📈 Improving" : scoreTrend === "declining" ? "📉 Declining" : "➖ Stable",
      icon: scoreTrend,
      change: "Based on AI analysis",
    };
  }

  return <ReportsClient initialReports={reports} overallTrend={overallTrend} />;
}

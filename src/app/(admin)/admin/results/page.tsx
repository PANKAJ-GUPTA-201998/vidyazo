import { createServiceRoleClient } from "@/lib/supabase/server";
import ResultsClient from "./client";

export default async function AdminResultsPage() {
  const supabase = await createServiceRoleClient();
  const { data: results } = await supabase
    .from("student_results")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Manage Student Results</h1>
        <p className="text-gray-500">Manage the success stories shown on the landing page.</p>
      </div>
      <ResultsClient initialResults={results || []} />
    </div>
  );
}

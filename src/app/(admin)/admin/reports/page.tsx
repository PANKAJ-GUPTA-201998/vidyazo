import { createClient } from "@/lib/supabase/server";
import ReportsClient from "./client";

export default async function ReportsPage() {
  const supabase = await createClient();

  const { data: tokens } = await supabase
    .from("parent_tokens")
    .select("*, student:profiles(full_name, class_grade, phone)")
    .order("created_at", { ascending: false });

  return <ReportsClient tokens={tokens || []} />;
}

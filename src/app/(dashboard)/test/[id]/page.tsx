import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TestClient from "./TestClient";

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const testId = resolvedParams.id;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch test
  const { data: test, error: testError } = await supabase
    .from("tests")
    .select("*")
    .eq("id", testId)
    .single();

  if (testError || !test || !test.is_active) {
    notFound();
  }

  // Check existing submission
  const { data: existingSubmission } = await supabase
    .from("test_submissions")
    .select("*")
    .eq("test_id", testId)
    .eq("student_id", user.id)
    .single();

  return <TestClient test={test} existingSubmission={existingSubmission || null} />;
}

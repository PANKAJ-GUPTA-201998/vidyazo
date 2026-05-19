/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTests, getTestSubmissionCount } from "@/lib/actions/tests";
import TestsClient from "./client";
import { format } from "date-fns";

export default async function TestsPage() {
  const tests = await getTests();
  
  // Fetch submission counts for all tests
  const testsWithCounts = await Promise.all(
    tests.map(async (test: any) => {
      const submissions = await getTestSubmissionCount(test.id);
      
      return {
        id: test.id,
        title: test.title,
        batch: test.batch?.name || "Unknown Batch",
        week_number: test.week_number,
        questions_count: test.questions ? test.questions.length : 0,
        is_active: test.is_active,
        submissions: submissions,
        created_at: format(new Date(test.created_at), "MMM d, yyyy"),
      };
    })
  );

  return <TestsClient initialTests={testsWithCounts} />;
}

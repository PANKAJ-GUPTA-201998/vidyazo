/* eslint-disable @typescript-eslint/no-explicit-any */
import { getActiveTestForStudent, getMyTestSubmissions } from "@/lib/actions/tests";
import { getMyEnrollments } from "@/lib/actions/students";
import DashboardClient from "./client";

export default async function DashboardPage() {
  let activeTest = null;
  let testSubmissions = [];
  let enrollments = [];

  try {
    activeTest = await getActiveTestForStudent();
    testSubmissions = await getMyTestSubmissions();
    enrollments = await getMyEnrollments();
  } catch (error) {
    console.error("Error fetching student dashboard data", error);
  }

  // Format test scores for the progress chart
  // Reverse to show oldest to newest (last 4 tests)
  const recentTests = [...testSubmissions].reverse().slice(-4);
  const progressData = recentTests.map((sub: any) => {
    return Math.round((sub.score / sub.total) * 100);
  });

  return (
    <DashboardClient 
      activeTest={activeTest} 
      testSubmissionsCount={testSubmissions.length}
      progressData={progressData.length > 0 ? progressData : [0, 0, 0, 0]}
      enrollments={enrollments}
    />
  );
}

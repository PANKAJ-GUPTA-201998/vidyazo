/* eslint-disable @typescript-eslint/no-explicit-any */
import { getStudents } from "@/features/student-dashboard/actions/students";
import StudentsClient from "./client";

export default async function StudentsPage() {
  const students = await getStudents();

  // Map database shape to the shape expected by the UI
  const formattedStudents = students.map((s) => {
    // Get the primary active enrollment, or the first one if none are active
    const enrollment = s.enrollments?.find((e: any) => e.status === "active") || s.enrollments?.[0];
    
    return {
      id: s.id,
      full_name: s.full_name || "Unknown",
      phone: s.phone || "",
      class_grade: s.class_grade || 0,
      board: s.board || "Unknown",
      batch: enrollment?.batch?.name || "No Batch",
      plan: enrollment?.plan || "batch",
      status: enrollment?.status || "inactive",
      joined_at: s.created_at,
    };
  });

  return <StudentsClient initialStudents={formattedStudents} />;
}

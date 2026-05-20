import { getTestById } from "@/lib/actions/tests";
import TestClient from "./client";
import { notFound } from "next/navigation";

export default async function TestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  let test;
  try {
    test = await getTestById(testId);
  } catch (error) {
    console.error("Test not found", error);
    return notFound();
  }
  
  if (!test) {
    return notFound();
  }
  
  return <TestClient test={test} />;
}

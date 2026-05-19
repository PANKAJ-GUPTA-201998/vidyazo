import { getBatches } from "@/lib/actions/students";
import CreateTestClient from "./client";

export default async function CreateTestPage() {
  const batches = await getBatches(false); // Only active batches
  
  return <CreateTestClient batches={batches} />;
}

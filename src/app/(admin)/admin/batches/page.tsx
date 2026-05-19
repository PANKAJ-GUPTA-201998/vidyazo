import { getBatches } from "@/lib/actions/students";
import BatchesClient from "./client";

export default async function BatchesPage() {
  const batches = await getBatches(true); // pass true to include inactive batches
  
  // The client component expects the schedule to be a parsed JSON object, which it is from Supabase (jsonb)
  return <BatchesClient initialBatches={batches} />;
}

"use server";

import { createClient } from "@/lib/supabase/server";

export async function getStudentRecordings(batchIds: string[]) {
  if (batchIds.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .in("batch_id", batchIds)
    .eq("status", "completed")
    .not("recording_url", "is", null)
    .order("scheduled_at", { ascending: false });

  if (error) throw error;
  
  // Map to UI expected format
  return data.map((cls) => ({
    id: cls.id,
    title: cls.title,
    topic: cls.topic,
    date: new Date(cls.scheduled_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    recording_url: cls.recording_url,
    duration: "1h 30m", // Mock duration as DB doesn't have it
  }));
}

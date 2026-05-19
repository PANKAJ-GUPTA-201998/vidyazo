import { createServiceRoleClient } from "@/lib/supabase/server";
import TeachersClient from "./client";

export default async function AdminTeachersPage() {
  const supabase = await createServiceRoleClient();
  const { data: teachers } = await supabase
    .from("teachers")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Manage Teachers</h1>
        <p className="text-gray-500">Add, edit, or remove teachers from the landing page.</p>
      </div>
      <TeachersClient initialTeachers={teachers || []} />
    </div>
  );
}

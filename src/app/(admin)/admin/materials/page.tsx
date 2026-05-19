import { createServiceRoleClient } from "@/lib/supabase/server";
import MaterialsClient from "./client";

export default async function AdminMaterialsPage() {
  const supabase = await createServiceRoleClient();
  const { data: materials } = await supabase
    .from("study_materials")
    .select("*, batch:batches(name, subject)")
    .order("created_at", { ascending: false });

  const { data: batches } = await supabase
    .from("batches")
    .select("id, name, subject, class_grade");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Manage Study Materials</h1>
        <p className="text-gray-500">Upload PDFs and resources for students.</p>
      </div>
      <MaterialsClient 
        initialMaterials={materials || []} 
        batches={batches || []} 
      />
    </div>
  );
}

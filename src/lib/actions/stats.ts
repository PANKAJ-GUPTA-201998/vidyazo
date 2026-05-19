"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAdminStats() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_admin_stats");
  
  if (error) {
    console.error("Error fetching admin stats:", error);
    return {
      total_students: 0,
      active_students: 0,
      total_revenue: 0,
      tests_this_month: 0,
      reports_sent: 0
    };
  }
  
  return data[0] || {
    total_students: 0,
    active_students: 0,
    total_revenue: 0,
    tests_this_month: 0,
    reports_sent: 0
  };
}

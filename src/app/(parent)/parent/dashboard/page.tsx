import { getLinkedChildren } from "@/lib/actions/parent";
import ParentDashboardClient from "./client";

export default async function ParentDashboardPage() {
  const children = await getLinkedChildren();
  
  return <ParentDashboardClient childrenList={children} />;
}

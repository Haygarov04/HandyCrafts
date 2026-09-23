import { redirect } from "next/navigation";
import { crmAllowed } from "@/lib/crm-auth";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  if (!(await crmAllowed())) redirect("/crm/login");
  return children;
}

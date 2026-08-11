import { notFound } from "next/navigation";
import { isDev } from "@/lib/dev-only";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  if (!isDev()) notFound();

  return <AdminDashboard />;
}

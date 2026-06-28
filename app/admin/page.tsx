import { adminGetDashboardStats } from "@/lib/actions"
import AdminDashboardClient from "@/components/admin/AdminDashboardClient"

export default async function AdminDashboardPage() {
  const stats = await adminGetDashboardStats()
  return <AdminDashboardClient stats={stats} />
}

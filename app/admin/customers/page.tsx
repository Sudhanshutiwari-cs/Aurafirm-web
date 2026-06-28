import { adminGetCustomers } from "@/lib/actions"

export default async function AdminCustomersPage() {
  const customers = await adminGetCustomers()
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold text-neutral-900">Customers</h1>
      <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-xs">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-4 py-3 text-left font-semibold text-neutral-500">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-500">Phone</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-500">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {customers.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-12 text-center text-neutral-400">No customers yet.</td></tr>
              ) : customers.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50/60">
                  <td className="px-4 py-3 font-medium text-neutral-800">{c.full_name ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-600">{c.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-500">
                    {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

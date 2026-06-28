"use client"

import { useState, useEffect, useTransition } from "react"
import {
  Search, Download, Filter, RotateCcw, Eye, MoreVertical,
  ShoppingBag, Clock, CheckCircle, IndianRupee, ChevronLeft, ChevronRight,
} from "lucide-react"
import { adminGetOrders, adminUpdateOrderStatus } from "@/lib/actions"

type Order = Awaited<ReturnType<typeof adminGetOrders>>[number]

const STATUS_OPTIONS = ["all", "pending", "processing", "shipped", "delivered", "cancelled", "refunded"]
const PAYMENT_OPTIONS = ["all", "paid", "pending", "failed"]
const PER_PAGE = 10

const STATUS_COLORS: Record<string, string> = {
  pending:    "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-600",
  refunded:   "bg-neutral-100 text-neutral-600",
}

const PAYMENT_COLORS: Record<string, string> = {
  paid:    "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  failed:  "bg-red-100 text-red-600",
  cod:     "bg-neutral-100 text-neutral-600",
}

function StatCard({ title, value, change, icon: Icon, prefix = "" }: {
  title: string; value: number; change: string; icon: React.ElementType; prefix?: string
}) {
  return (
    <div className="flex items-start justify-between rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs text-neutral-500">{title}</p>
        <p className="mt-1 text-2xl font-extrabold text-neutral-900">{prefix}{value.toLocaleString("en-IN")}</p>
        <p className="mt-1 text-xs font-medium text-[#6b8f5e]">{change} vs last 7 days</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fdf0e8]">
        <Icon className="h-5 w-5 text-[#c9744e]" />
      </div>
    </div>
  )
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setLoading(true)
    adminGetOrders({ status: statusFilter, paymentStatus: paymentFilter, search }).then((data) => {
      setOrders(data)
      setLoading(false)
      setPage(1)
    })
  }, [statusFilter, paymentFilter, search])

  const totalOrders = orders.length
  const pendingCount = orders.filter((o) => o.status === "pending").length
  const completedCount = orders.filter((o) => o.status === "delivered").length
  const revenue = orders.reduce((s, o) => s + (o.grand_total ?? 0), 0)

  const totalPages = Math.max(1, Math.ceil(totalOrders / PER_PAGE))
  const paginated = orders.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const toggleSelect = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  const toggleAll = () =>
    setSelected(selected.length === paginated.length ? [] : paginated.map((o) => o.id))

  function handleStatusChange(orderId: string, newStatus: string) {
    startTransition(async () => {
      await adminUpdateOrderStatus(orderId, newStatus)
      const data = await adminGetOrders({ status: statusFilter, paymentStatus: paymentFilter, search })
      setOrders(data)
    })
    setOpenMenu(null)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-neutral-900">Orders</h1>
          <p className="mt-0.5 text-xs text-neutral-500">Manage customer orders, shipping status and payment information.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-xl bg-[#a0522d] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8b4513]">
            + Create Order
          </button>
          <button className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50">
            <Download className="h-3.5 w-3.5" /> Export Orders
          </button>
          <button className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50">
            <Filter className="h-3.5 w-3.5" /> Filter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard title="Total Orders"  value={totalOrders}     change="+18.6%" icon={ShoppingBag} />
        <StatCard title="Pending"       value={pendingCount}    change="+8.2%"  icon={Clock} />
        <StatCard title="Completed"     value={completedCount}  change="+12.7%" icon={CheckCircle} />
        <StatCard title="Revenue"       value={revenue}         change="+23.4%" icon={IndianRupee} prefix="₹" />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Orders..."
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-8 pr-3 text-xs text-neutral-800 outline-none focus:border-[#c9744e]"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] font-medium text-neutral-400">Order Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700 outline-none focus:border-[#c9744e]"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] font-medium text-neutral-400">Payment Status</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700 outline-none focus:border-[#c9744e]"
            >
              {PAYMENT_OPTIONS.map((p) => (
                <option key={p} value={p}>{p === "all" ? "All Status" : p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => { setSearch(""); setStatusFilter("all"); setPaymentFilter("all") }}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600 hover:bg-neutral-50"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
          <button className="rounded-lg bg-[#a0522d] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8b4513]">
            Apply Filter
          </button>
        </div>

        {/* Bulk actions bar */}
        {selected.length > 0 && (
          <div className="mt-3 flex items-center gap-3 rounded-lg bg-[#fdf0e8] px-3 py-2">
            <span className="text-xs font-semibold text-[#c9744e]">{selected.length} Selected</span>
            <button className="text-xs text-neutral-600 hover:text-neutral-800">Bulk Actions</button>
            <button className="flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-800">
              <Download className="h-3 w-3" /> Export Selected
            </button>
            <button className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#c9744e] border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-xs">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="w-8 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.length === paginated.length && paginated.length > 0}
                      onChange={toggleAll}
                      className="rounded border-neutral-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-500">Order ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-500">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-500">Product</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-500">Order Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-500">Payment</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-500">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-500">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-500">Shipping</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-neutral-400">
                      No orders found.
                    </td>
                  </tr>
                ) : paginated.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/60">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        className="rounded border-neutral-300"
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold text-neutral-800">#{order.order_number}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-neutral-800">{order.customer_name}</p>
                        <p className="text-[10px] text-neutral-400">{order.customer_email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        {(order.order_items as { product_name: string }[]).slice(0, 1).map((item, i) => (
                          <p key={i} className="font-medium text-neutral-800 truncate max-w-[120px]">{item.product_name}</p>
                        ))}
                        {(order.order_items as unknown[]).length > 1 && (
                          <p className="text-[10px] text-neutral-400">+{(order.order_items as unknown[]).length - 1} more</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-500">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${PAYMENT_COLORS[order.payment_status] ?? "bg-neutral-100 text-neutral-600"}`}>
                        {order.payment_method === "cod" ? "COD" : order.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-neutral-800">
                      ₹{order.grand_total.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${STATUS_COLORS[order.status] ?? "bg-neutral-100 text-neutral-600"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-500">
                      {order.carrier ? (
                        <div>
                          <p className="font-medium text-neutral-700">{order.carrier}</p>
                          <p className="text-[10px]">Tracking: #{order.tracking_id ?? "—"}</p>
                        </div>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenu(openMenu === order.id ? null : order.id)}
                            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>
                          {openMenu === order.id && (
                            <div className="absolute right-0 top-7 z-10 w-40 rounded-xl border border-neutral-100 bg-white py-1 shadow-lg">
                              {STATUS_OPTIONS.filter((s) => s !== "all" && s !== order.status).map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleStatusChange(order.id, s)}
                                  disabled={isPending}
                                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50 capitalize"
                                >
                                  Mark as {s}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3">
          <p className="text-xs text-neutral-500">
            Showing {Math.min((page - 1) * PER_PAGE + 1, totalOrders)}–{Math.min(page * PER_PAGE, totalOrders)} of {totalOrders} orders
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-neutral-200 p-1.5 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium ${page === n ? "bg-[#a0522d] text-white" : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"}`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-neutral-200 p-1.5 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react"
import { adminUpsertProduct, adminDeleteProduct, adminGetProducts } from "@/lib/actions"

type Product = Awaited<ReturnType<typeof adminGetProducts>>[number]

const CATEGORIES = ["serum", "cleanser", "moisturizer", "sunscreen", "supplements", "essence", "mask", "toner", "other"]

const emptyForm = {
  name: "", subtitle: "", description: "", price: 0, original_price: 0,
  category: "serum", image_url: "", stock: 100, tags: "", is_active: true,
}

export default function AdminProductsClient({ products: initial }: { products: Product[] }) {
  const [products, setProducts] = useState(initial)
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [isPending, startTransition] = useTransition()

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setForm({
      name: p.name, subtitle: p.subtitle ?? "", description: p.description ?? "",
      price: p.price, original_price: p.original_price ?? 0,
      category: p.category, image_url: p.image_url ?? "",
      stock: p.stock, tags: (p.tags ?? []).join(", "), is_active: p.is_active,
    })
    setShowForm(true)
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return
    startTransition(async () => {
      await adminDeleteProduct(id)
      const fresh = await adminGetProducts()
      setProducts(fresh)
    })
  }

  function handleSave() {
    startTransition(async () => {
      await adminUpsertProduct({
        ...(editing ? { id: editing.id } : {}),
        name: form.name, subtitle: form.subtitle, description: form.description,
        price: form.price, original_price: form.original_price,
        category: form.category, image_url: form.image_url,
        stock: form.stock, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        is_active: form.is_active,
      })
      const fresh = await adminGetProducts()
      setProducts(fresh)
      setShowForm(false)
    })
  }

  const inputCls = "w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-[#c9744e]"

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-neutral-900">Products</h1>
          <p className="mt-0.5 text-xs text-neutral-500">Manage your product catalog.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-1.5 rounded-xl bg-[#a0522d] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8b4513]">
          <Plus className="h-3.5 w-3.5" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-8 pr-3 text-xs outline-none focus:border-[#c9744e]"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-xs">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-4 py-3 text-left font-semibold text-neutral-500">Product</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-500">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-500">Price</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-500">Stock</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-500">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-neutral-400">No products found.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-[#fdf0e8]">
                        {p.image_url ? (
                          <Image src={p.image_url} alt={p.name} width={40} height={40} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package className="h-4 w-4 text-[#c9744e]/40" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-800">{p.name}</p>
                        <p className="text-[10px] text-neutral-400">{p.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-neutral-600">{p.category}</td>
                  <td className="px-4 py-3 font-semibold text-neutral-800">₹{p.price.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${p.stock < 20 ? "text-red-600" : "text-neutral-800"}`}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${p.is_active ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-[#c9744e]">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-base font-bold text-neutral-900">
              {editing ? "Edit Product" : "Add New Product"}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-neutral-600">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-neutral-600">Subtitle</label>
                <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">Price (₹) *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">Original Price (₹)</label>
                <input type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: +e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">Stock</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-neutral-600">Image URL</label>
                <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-neutral-600">Tags (comma separated)</label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputCls} placeholder="Vegan, Dermatest Tested" />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input type="checkbox" id="active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                <label htmlFor="active" className="text-xs text-neutral-700">Active (visible in store)</label>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isPending || !form.name || !form.price}
                className="rounded-xl bg-[#a0522d] px-5 py-2 text-xs font-semibold text-white hover:bg-[#8b4513] disabled:opacity-60"
              >
                {isPending ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

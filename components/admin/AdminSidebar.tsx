"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  Package,
  ShoppingBag,
  BarChart3,
  Users,
  Tag,
  Star,
  Settings,
  LogOut,
  Layers,
  TrendingUp,
  MessageSquare,
  Sparkles,
  BookOpen,
  X,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const navItems = [
  { label: "Home",         href: "/admin",               icon: Home },
  { label: "Products",     href: "/admin/products",      icon: Package },
  { label: "Orders",       href: "/admin/orders",        icon: ShoppingBag },
  { label: "Inventory",    href: "/admin/inventory",     icon: Layers },
  { label: "Sales",        href: "/admin/sales",         icon: TrendingUp },
  { label: "Analytics",    href: "/admin/analytics",     icon: BarChart3 },
  { label: "Customers",    href: "/admin/customers",     icon: Users },
  { label: "Coupons",      href: "/admin/coupons",       icon: Tag },
  { label: "Reviews",      href: "/admin/reviews",       icon: Star },
  { label: "Contacts",     href: "/admin/contacts",      icon: MessageSquare },
  { label: "Our Story",    href: "/admin/our-story",     icon: BookOpen },
  { label: "Why AURAFIRM", href: "/admin/why-aurafirm",  icon: Sparkles },
  { label: "Settings",     href: "/admin/settings",      icon: Settings },
]

interface AdminSidebarProps {
  pendingCount?: number
  isOpen: boolean
  onClose: () => void
}

export default function AdminSidebar({ pendingCount = 0, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin-login")
    router.refresh()
  }

  const sidebarContent = (
    <aside className="flex h-full w-56 flex-col bg-white border-r border-neutral-100">
      {/* Logo + close button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
        <Link href="/admin" onClick={onClose}>
          <Image
            src="https://res.cloudinary.com/df01whs60/image/upload/v1782242359/AURAFIRM_logo_PNG_160x_drciiz.avif"
            alt="AURAFIRM logo"
            width={110}
            height={38}
            className="object-contain"
          />
        </Link>
        {/* Close button — visible only on mobile */}
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="lg:hidden flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-hidden">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-[#fdf0e8] text-[#c9744e]"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
              {label === "Orders" && pendingCount > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#c9744e] text-[10px] font-bold text-white">
                  {pendingCount > 99 ? "99+" : pendingCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-neutral-100 px-3 py-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-1.5 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-800"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop: always-visible sticky sidebar */}
      <div className="hidden lg:flex h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile: overlay drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}

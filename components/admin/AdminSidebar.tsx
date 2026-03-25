"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Tag,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"

// ─────────────────────────────────────────────
//  NAV ITEMS
// ─────────────────────────────────────────────
const navItems = [
  { label: "Dashboard",  href: "/admin",            icon: LayoutDashboard },
  { label: "Produk",     href: "/admin/products",   icon: Package },
  { label: "Kategori",   href: "/admin/categories", icon: Tag },
]

interface AdminSidebarProps {
  user: User
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const [open, setOpen]           = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth")
    router.refresh()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-warm-800/40">
        <span className="font-serif text-xl text-cream">
          Alat Dapur <em className="text-warm-300 italic">MBG</em>
        </span>
        <p className="text-xs text-warm-300/60 mt-0.5">Admin Dashboard</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <p className="section-label text-warm-300/50 px-2 mb-2">Menu</p>
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                "transition-all duration-150",
                isActive
                  ? "bg-warm-700/60 text-cream border-l-[3px] border-warm-300 rounded-l-none pl-[9px]"
                  : "text-warm-100/70 hover:bg-warm-700/30 hover:text-cream"
              )}
            >
              <Icon size={17} className="shrink-0" />
              {label}
            </Link>
          )
        })}

        <div className="divider my-3 border-warm-800/40" />

        {/* Link ke website publik */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-warm-100/70 hover:bg-warm-700/30 hover:text-cream transition-all duration-150"
        >
          <ExternalLink size={17} className="shrink-0" />
          Lihat Website
        </a>
      </nav>

      {/* User & Logout */}
      <div className="px-3 py-4 border-t border-warm-800/40">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-warm-600 flex items-center justify-center shrink-0">
            <span className="text-xs font-medium text-cream">
              {user.email?.[0]?.toUpperCase() ?? "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-cream truncate">{user.email}</p>
            <p className="text-2xs text-warm-300/60">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
            "text-sm font-medium text-warm-100/70",
            "hover:bg-red-500/20 hover:text-red-300",
            "transition-all duration-150",
            "disabled:opacity-50"
          )}
        >
          <LogOut size={17} className="shrink-0" />
          {isLoggingOut ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex w-56 shrink-0 bg-warm-900 flex-col min-h-screen sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* ── MOBILE TOPBAR ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-warm-900 flex items-center justify-between px-4 h-14 border-b border-warm-800/40">
        <span className="font-serif text-lg text-cream">
          Alat Dapur <em className="text-warm-300 italic">MBG</em>
        </span>
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-warm-700/40 text-cream"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-[200] transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      >
        <div className="absolute inset-0 bg-warm-900/50 backdrop-blur-sm" />
      </div>

      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 bottom-0 z-[300] w-64 bg-warm-900",
          "transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)]",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-warm-800/40">
          <span className="font-serif text-lg text-cream">Menu Admin</span>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-warm-700/40 text-cream"
          >
            <X size={16} />
          </button>
        </div>
        <div className="h-[calc(100%-60px)] overflow-y-auto">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile top padding spacer */}
      <div className="lg:hidden h-14 w-0" />
    </>
  )
}
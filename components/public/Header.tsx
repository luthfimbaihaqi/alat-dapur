"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { Search, X, Menu } from "lucide-react"
import { cn, buildWhatsAppUrl } from "@/lib/utils"
import { searchProducts } from "@/actions/products"
import type { ProductWithCategory, Category } from "@/types"

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.14 1.544 5.875L.057 23.804a.5.5 0 00.61.61l5.93-1.487A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 01-5.17-1.447l-.371-.22-3.521.883.9-3.521-.24-.38A9.951 9.951 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  )
}

interface HeaderProps {
  categories?: Category[]
}

export default function Header({ categories = [] }: HeaderProps) {
  const searchRef = useRef<HTMLDivElement>(null)

  const [scrolled, setScrolled]           = useState(false)
  const [drawerOpen, setDrawerOpen]       = useState(false)
  const [searchQuery, setSearchQuery]     = useState("")
  const [searchResults, setSearchResults] = useState<ProductWithCategory[]>([])
  const [showDropdown, setShowDropdown]   = useState(false)
  const [isSearching, setIsSearching]     = useState(false)

  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER ?? ""
  const waUrl    = buildWhatsAppUrl(waNumber)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [drawerOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }
    setIsSearching(true)
    setShowDropdown(true)
    try {
      const results = await searchProducts(query)
      setSearchResults(results)
    } catch {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) handleSearch(searchQuery)
    }, 350)
    return () => clearTimeout(timer)
  }, [searchQuery, handleSearch])

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setShowDropdown(false)
  }

  return (
    <>
      {/* ── HEADER ── */}
      <header className={cn("header-sticky transition-shadow duration-300", scrolled && "shadow-warm-md")}>
        <div className="flex items-center gap-3 px-4 h-14">

          {/* Hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-warm-50 transition-colors duration-150 shrink-0"
            aria-label="Buka menu"
          >
            <Menu size={20} className="text-warm-900" />
          </button>

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="font-serif text-[19px] text-warm-900 tracking-tight">
              Alat Dapur <em className="text-warm-500 not-italic italic">MBG</em>
            </span>
          </Link>

          {/* Search */}
          <div ref={searchRef} className="relative flex-1">
            <div className="relative flex items-center">
              <Search size={15} className="absolute left-3 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                placeholder="Cari produk..."
                className={cn(
                  "w-full h-9 pl-9 pr-8 rounded-lg text-sm",
                  "border border-stone-200 bg-white",
                  "placeholder:text-stone-400 text-stone-800",
                  "outline-none transition-all duration-150",
                  "focus:border-warm-300 focus:ring-2 focus:ring-warm-300/20"
                )}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2.5 w-4 h-4 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center transition-colors duration-150"
                >
                  <X size={10} className="text-stone-600" />
                </button>
              )}
            </div>

            {/* Search dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-xl border border-stone-200 shadow-warm-lg overflow-hidden">
                {isSearching ? (
                  <div className="px-4 py-4 text-sm text-stone-400 text-center">Mencari...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={clearSearch}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-warm-50 transition-colors duration-100"
                    >
                      <div className="w-10 h-10 rounded-lg shrink-0 bg-warm-50 overflow-hidden">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">
                            <Search size={14} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-800 truncate">{product.name}</p>
                        <p className="text-xs text-stone-400">{product.category?.name}</p>
                      </div>
                      <p className="text-sm font-medium text-warm-600 shrink-0">
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(product.price)}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-4 text-sm text-stone-400 text-center">Produk tidak ditemukan</div>
                )}
              </div>
            )}
          </div>

          {/* WA Button */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-9 h-9 rounded-lg bg-[#25D366] hover:bg-[#1aab52] flex items-center justify-center text-white transition-all duration-150 hover:scale-105"
            aria-label="Hubungi via WhatsApp"
          >
            <WhatsAppIcon size={18} />
          </a>
        </div>

        {/* Category Strip */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 px-4 pb-2.5 overflow-x-auto scrollbar-hide">
            <Link href="/" className="shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border border-stone-200 bg-white text-stone-600 hover:border-warm-300 hover:text-warm-700 transition-all duration-150">
              Semua
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border border-stone-200 bg-white text-stone-600 hover:border-warm-300 hover:text-warm-700 transition-all duration-150"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* ── DRAWER OVERLAY ── */}
      <div
        className={cn(
          "fixed inset-0 z-[200] transition-opacity duration-300",
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setDrawerOpen(false)}
      >
        <div className="absolute inset-0 bg-warm-900/35 backdrop-blur-[2px]" />
      </div>

      {/* ── DRAWER ── */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-[300]",
          "w-[min(300px,82vw)] bg-white flex flex-col overflow-hidden",
          "transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)]",
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 bg-warm-900">
          <span className="font-serif text-xl text-cream tracking-tight">
            Alat Dapur <em className="text-warm-300 italic">MBG</em>
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 text-cream transition-colors duration-150"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          <p className="section-label px-5 pt-4 pb-2">Kategori Produk</p>

          {/* Semua Produk — tanpa icon */}
          <Link
            href="/"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center px-5 py-3 hover:bg-warm-50 transition-colors"
          >
            <span className="text-sm font-medium text-stone-800">Semua Produk</span>
          </Link>

          {/* Kategori — tanpa icon */}
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              onClick={() => setDrawerOpen(false)}
              className="flex items-center px-5 py-3 hover:bg-warm-50 transition-colors"
            >
              <span className="text-sm font-medium text-stone-800">{cat.name}</span>
            </Link>
          ))}

          <div className="divider mx-5 my-2" />

          {/* Tentang Kami — tetap dengan icon */}
          <Link
            href="/tentang-kami"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center gap-3 px-5 py-3 hover:bg-warm-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-warm-50 flex items-center justify-center text-sm shrink-0">
              ℹ️
            </div>
            <span className="text-sm font-medium text-stone-800">Tentang Kami</span>
          </Link>
        </nav>

        {/* Drawer footer — WA button tetap */}
        <div className="p-4 border-t border-stone-200">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1aab52] text-white rounded-xl py-3 text-sm font-medium transition-colors duration-150"
          >
            <WhatsAppIcon size={16} />
            Hubungi via WhatsApp
          </a>
        </div>
      </aside>

      {/* ── FLOATING WA ── */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("wa-fab animate-wa-pulse", "text-white")}
        aria-label="Hubungi via WhatsApp"
      >
        <WhatsAppIcon size={26} />
      </a>
    </>
  )
}
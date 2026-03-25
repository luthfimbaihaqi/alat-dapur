import Link from "next/link"
import { getProducts } from "@/actions/products"
import { getCategories } from "@/actions/categories"
import { formatRupiah } from "@/lib/utils"
import { Package, Tag, Star, TrendingUp } from "lucide-react"

export default async function AdminDashboardPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  const totalProducts  = products.length
  const totalCategories = categories.length
  const featuredCount  = products.filter((p) => p.is_featured).length
  const activeCount    = products.filter((p) => p.is_active).length
  const recentProducts = products.slice(0, 5)

  const stats = [
    {
      label: "Total Produk",
      value: totalProducts,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      href: "/admin/products",
    },
    {
      label: "Total Kategori",
      value: totalCategories,
      icon: Tag,
      color: "bg-warm-50 text-warm-600",
      href: "/admin/categories",
    },
    {
      label: "Produk Unggulan",
      value: featuredCount,
      icon: Star,
      color: "bg-amber-50 text-amber-600",
      href: "/admin/products",
    },
    {
      label: "Produk Aktif",
      value: activeCount,
      icon: TrendingUp,
      color: "bg-green-50 text-green-600",
      href: "/admin/products",
    },
  ]

  return (
    <div className="max-w-4xl">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-warm-900">Dashboard</h1>
        <p className="text-sm text-stone-500 mt-1">
          Selamat datang di panel admin Alat Dapur MBG
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="card p-4 hover:shadow-warm-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <p className="font-serif text-2xl text-warm-900">{stat.value}</p>
            <p className="text-xs text-stone-500 mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="font-serif text-lg text-warm-900 mb-3">Aksi Cepat</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-warm-700 hover:bg-warm-900 text-cream rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150"
          >
            <Package size={16} />
            Tambah Produk Baru
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 border border-warm-300 text-warm-700 hover:bg-warm-50 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150"
          >
            <Tag size={16} />
            Kelola Kategori
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      {recentProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-lg text-warm-900">Produk Terbaru</h2>
            <Link href="/admin/products" className="text-sm text-warm-600 hover:text-warm-800 transition-colors">
              Lihat semua →
            </Link>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="table-th">Nama Produk</th>
                  <th className="table-th hidden sm:table-cell">Kategori</th>
                  <th className="table-th">Harga</th>
                  <th className="table-th hidden sm:table-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product) => (
                  <tr key={product.id} className="table-tr">
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="w-9 h-9 rounded-lg bg-warm-50 overflow-hidden shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={14} className="text-stone-300" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-stone-800 line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="table-td hidden sm:table-cell text-stone-500">
                      {product.category?.name ?? "-"}
                    </td>
                    <td className="table-td font-medium text-warm-700">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="table-td hidden sm:table-cell">
                      <span className={`badge ${product.is_active ? "badge-active" : "badge-inactive"}`}>
                        {product.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {totalProducts === 0 && (
        <div className="card p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-warm-50 flex items-center justify-center mx-auto mb-4">
            <Package size={24} className="text-stone-300" />
          </div>
          <p className="font-serif text-lg text-warm-900 mb-1">Belum ada produk</p>
          <p className="text-sm text-stone-500 mb-4">Mulai tambahkan produk pertama Anda</p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-warm-700 hover:bg-warm-900 text-cream rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150"
          >
            <Package size={16} />
            Tambah Produk Pertama
          </Link>
        </div>
      )}
    </div>
  )
}
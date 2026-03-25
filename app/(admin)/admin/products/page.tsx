import Link from "next/link"
import Image from "next/image"
import { getProducts } from "@/actions/products"
import { formatRupiah } from "@/lib/utils"
import { Package, Plus } from "lucide-react"
import AdminProductActions from "@/components/admin/AdminProductActions"

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-warm-900">Produk</h1>
          <p className="text-sm text-stone-500 mt-0.5">{products.length} produk terdaftar</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-warm-700 hover:bg-warm-900 text-cream rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150"
        >
          <Plus size={16} />
          Tambah Produk
        </Link>
      </div>

      {/* Table */}
      {products.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/50">
                  <th className="table-th">Produk</th>
                  <th className="table-th hidden sm:table-cell">Kategori</th>
                  <th className="table-th">Harga</th>
                  <th className="table-th hidden md:table-cell">Status</th>
                  <th className="table-th hidden md:table-cell">Unggulan</th>
                  <th className="table-th text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="table-tr">
                    {/* Produk */}
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-warm-50 overflow-hidden shrink-0">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={16} className="text-stone-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-stone-800 truncate max-w-[160px]">
                            {product.name}
                          </p>
                          <p className="text-xs text-stone-400">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    {/* Kategori */}
                    <td className="table-td hidden sm:table-cell text-stone-500 text-xs">
                      {product.category?.name ?? "-"}
                    </td>
                    {/* Harga */}
                    <td className="table-td font-medium text-warm-700 text-sm">
                      {formatRupiah(product.price)}
                      <span className="text-xs font-normal text-stone-400 ml-1">
                        /{product.unit}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="table-td hidden md:table-cell">
                      <span className={`badge ${product.is_active ? "badge-active" : "badge-inactive"}`}>
                        {product.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    {/* Unggulan */}
                    <td className="table-td hidden md:table-cell">
                      {product.is_featured ? (
                        <span className="badge badge-warm">★ Unggulan</span>
                      ) : (
                        <span className="text-xs text-stone-300">—</span>
                      )}
                    </td>
                    {/* Aksi */}
                    <td className="table-td text-right">
                      <AdminProductActions product={product} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-warm-50 flex items-center justify-center mx-auto mb-4">
            <Package size={24} className="text-stone-300" />
          </div>
          <p className="font-serif text-lg text-warm-900 mb-1">Belum ada produk</p>
          <p className="text-sm text-stone-500 mb-5">Tambahkan produk pertama Anda sekarang</p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-warm-700 hover:bg-warm-900 text-cream rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Tambah Produk Pertama
          </Link>
        </div>
      )}
    </div>
  )
}
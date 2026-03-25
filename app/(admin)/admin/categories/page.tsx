import Image from "next/image"
import { getCategories } from "@/actions/categories"
import { Tag, Plus } from "lucide-react"
import AdminCategoryActions from "@/components/admin/AdminCategoryActions"
import CategoryForm from "@/components/admin/CategoryForm"

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-warm-900">Kategori</h1>
          <p className="text-sm text-stone-500 mt-0.5">{categories.length} kategori terdaftar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── FORM TAMBAH ── */}
        <div className="card p-5 h-fit">
          <h2 className="font-serif text-base text-warm-900 mb-4 flex items-center gap-2">
            <Plus size={16} className="text-warm-500" />
            Tambah Kategori Baru
          </h2>
          <CategoryForm />
        </div>

        {/* ── DAFTAR KATEGORI ── */}
        <div>
          {categories.length > 0 ? (
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="card p-3 flex items-center gap-3"
                >
                  {/* Image */}
                  <div className="w-12 h-12 rounded-lg bg-warm-50 overflow-hidden shrink-0">
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tag size={18} className="text-stone-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">
                      {cat.name}
                    </p>
                    <p className="text-xs text-stone-400">/{cat.slug}</p>
                  </div>

                  {/* Status */}
                  <span className={`badge shrink-0 ${cat.is_active ? "badge-active" : "badge-inactive"}`}>
                    {cat.is_active ? "Aktif" : "Nonaktif"}
                  </span>

                  {/* Actions */}
                  <AdminCategoryActions category={cat} />
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-warm-50 flex items-center justify-center mx-auto mb-3">
                <Tag size={20} className="text-stone-300" />
              </div>
              <p className="font-serif text-base text-warm-900 mb-1">Belum ada kategori</p>
              <p className="text-xs text-stone-400">Tambahkan kategori pertama di form sebelah kiri</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
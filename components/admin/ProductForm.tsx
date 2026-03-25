"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createProduct, updateProduct } from "@/actions/products"
import { slugify } from "@/lib/utils"
import ImageUploader from "./ImageUploader"
import { Input, Textarea, Select } from "@/components/ui"
import { useToast, ToastContainer } from "@/components/ui/Toast"
import type { ProductWithCategory, Category, ProductFormData } from "@/types"

interface ProductFormProps {
  product?: ProductWithCategory
  categories: Category[]
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const { toasts, showToast, removeToast } = useToast()
  const isEdit = !!product

  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages]       = useState<string[]>(product?.images ?? [])

  const [form, setForm] = useState({
    name:         product?.name         ?? "",
    slug:         product?.slug         ?? "",
    category_id:  product?.category_id  ?? "",
    price:        product?.price        ?? 0,
    unit:         product?.unit         ?? "pcs",
    description:  product?.description  ?? "",
    video_url:    product?.video_url    ?? "",
    is_active:    product?.is_active    ?? true,
    is_featured:  product?.is_featured  ?? false,
    display_order: product?.display_order ?? 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleChange(field: string, value: string | number | boolean) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value }
      // Auto-generate slug dari name (hanya kalau belum diedit manual)
      if (field === "name" && !isEdit) {
        updated.slug = slugify(value as string)
      }
      return updated
    })
    // Clear error saat field diubah
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim())        newErrors.name        = "Nama produk wajib diisi"
    if (!form.category_id)        newErrors.category_id = "Kategori wajib dipilih"
    if (!form.slug.trim())        newErrors.slug        = "Slug wajib diisi"
    if (form.price <= 0)          newErrors.price       = "Harga harus lebih dari 0"
    if (!form.unit.trim())        newErrors.unit        = "Satuan wajib diisi"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const payload: ProductFormData = {
        ...form,
        images,
        video_url: form.video_url || null,
        description: form.description || null,
        price: Number(form.price),
        display_order: Number(form.display_order),
      }

      const result = isEdit
        ? await updateProduct(product.id, payload)
        : await createProduct(payload)

      if (result.success) {
        showToast("success", isEdit ? "Produk berhasil diperbarui!" : "Produk berhasil ditambahkan!")
        setTimeout(() => router.push("/admin/products"), 1000)
      } else {
        showToast("error", result.error ?? "Terjadi kesalahan")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }))
  const unitOptions = [
    { value: "pcs",   label: "pcs (per buah)" },
    { value: "set",   label: "set" },
    { value: "lusin", label: "lusin" },
    { value: "pack",  label: "pack" },
    { value: "kg",    label: "kg" },
    { value: "meter", label: "meter" },
  ]

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="flex flex-col gap-5">

          {/* ── INFORMASI DASAR ── */}
          <div className="card p-5">
            <h2 className="font-serif text-base text-warm-900 mb-4">Informasi Produk</h2>
            <div className="flex flex-col gap-4">

              <Input
                label="Nama Produk"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="contoh: Wajan Anti-Lengket Marble 28cm"
                required
                error={errors.name}
              />

              <Select
                label="Kategori"
                value={form.category_id}
                onChange={(e) => handleChange("category_id", e.target.value)}
                options={categoryOptions}
                placeholder="Pilih kategori..."
                required
                error={errors.category_id}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Harga (Rp)"
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  placeholder="185000"
                  required
                  min={0}
                  error={errors.price}
                />
                <Select
                  label="Satuan"
                  value={form.unit}
                  onChange={(e) => handleChange("unit", e.target.value)}
                  options={unitOptions}
                  error={errors.unit}
                />
              </div>

              <Textarea
                label="Deskripsi"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Deskripsi produk (opsional)..."
                hint="Opsional — jelaskan keunggulan produk"
                rows={4}
              />
            </div>
          </div>

          {/* ── FOTO PRODUK ── */}
          <div className="card p-5">
            <ImageUploader
              images={images}
              onChange={setImages}
              maxImages={5}
              label="Foto Produk"
            />
          </div>

          {/* ── PENGATURAN LANJUTAN ── */}
          <div className="card p-5">
            <h2 className="font-serif text-base text-warm-900 mb-4">Pengaturan</h2>
            <div className="flex flex-col gap-4">

              <Input
                label="Slug URL"
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                placeholder="wajan-anti-lengket-marble"
                required
                error={errors.slug}
                hint="Otomatis terisi dari nama produk"
              />

              <Input
                label="URL Video (opsional)"
                value={form.video_url}
                onChange={(e) => handleChange("video_url", e.target.value)}
                placeholder="https://res.cloudinary.com/..."
                hint="Link video dari Cloudinary"
              />

              <Input
                label="Urutan Tampil"
                type="number"
                value={form.display_order}
                onChange={(e) => handleChange("display_order", e.target.value)}
                hint="Angka lebih kecil tampil lebih dulu"
                min={0}
              />

              {/* Toggle aktif */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-stone-700">Produk Aktif</p>
                  <p className="text-xs text-stone-400">Produk tampil di halaman publik</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange("is_active", !form.is_active)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    form.is_active ? "bg-warm-700" : "bg-stone-200"
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                    form.is_active ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Toggle unggulan */}
              <div className="flex items-center justify-between py-2 border-t border-stone-100">
                <div>
                  <p className="text-sm font-medium text-stone-700">Produk Unggulan</p>
                  <p className="text-xs text-stone-400">Tampil di section unggulan homepage</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange("is_featured", !form.is_featured)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    form.is_featured ? "bg-amber-500" : "bg-stone-200"
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                    form.is_featured ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* ── ACTION BUTTONS ── */}
          <div className="flex items-center gap-3 pb-8">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-warm-700 hover:bg-warm-900 text-cream rounded-lg px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Menyimpan...
                </>
              ) : isEdit ? "Simpan Perubahan" : "Tambah Produk"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </form>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
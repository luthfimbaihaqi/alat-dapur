"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createCategory, updateCategory } from "@/actions/categories"
import { slugify } from "@/lib/utils"
import { Input, Textarea } from "@/components/ui"
import { useToast, ToastContainer } from "@/components/ui/Toast"
import ImageUploader from "./ImageUploader"
import type { Category, CategoryFormData } from "@/types"

interface CategoryFormProps {
  category?: Category
  onSuccess?: () => void
}

export default function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const router  = useRouter()
  const isEdit  = !!category
  const { toasts, showToast, removeToast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages]       = useState<string[]>(
    category?.image_url ? [category.image_url] : []
  )
  const [form, setForm] = useState({
    name:          category?.name          ?? "",
    slug:          category?.slug          ?? "",
    description:   category?.description   ?? "",
    display_order: category?.display_order ?? 0,
    is_active:     category?.is_active     ?? true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleChange(field: string, value: string | number | boolean) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === "name" && !isEdit) {
        updated.slug = slugify(value as string)
      }
      return updated
    })
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = "Nama kategori wajib diisi"
    if (!form.slug.trim()) newErrors.slug = "Slug wajib diisi"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const payload: CategoryFormData = {
        ...form,
        image_url:     images[0] ?? null,
        description:   form.description || null,
        display_order: Number(form.display_order),
      }

      const result = isEdit
        ? await updateCategory(category.id, payload)
        : await createCategory(payload)

      if (result.success) {
        showToast("success", isEdit ? "Kategori berhasil diperbarui!" : "Kategori berhasil ditambahkan!")
        if (!isEdit) {
          setForm({ name: "", slug: "", description: "", display_order: 0, is_active: true })
          setImages([])
        }
        router.refresh()
        onSuccess?.()
      } else {
        showToast("error", result.error ?? "Terjadi kesalahan")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nama Kategori"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="contoh: Wajan & Penggorengan"
          required
          error={errors.name}
        />

        <Input
          label="Slug URL"
          value={form.slug}
          onChange={(e) => handleChange("slug", e.target.value)}
          placeholder="wajan-penggorengan"
          required
          error={errors.slug}
          hint="Otomatis terisi dari nama kategori"
        />

        <Textarea
          label="Deskripsi"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Deskripsi singkat kategori (opsional)"
          rows={2}
        />

        <Input
          label="Urutan Tampil"
          type="number"
          value={form.display_order}
          onChange={(e) => handleChange("display_order", e.target.value)}
          hint="Angka lebih kecil tampil lebih dulu"
          min={0}
        />

        {/* Foto kategori */}
        <ImageUploader
          images={images}
          onChange={setImages}
          maxImages={1}
          label="Foto Kategori (opsional)"
        />

        {/* Toggle aktif */}
        <div className="flex items-center justify-between py-2 border-t border-stone-100">
          <div>
            <p className="text-sm font-medium text-stone-700">Kategori Aktif</p>
            <p className="text-xs text-stone-400">Tampil di halaman publik</p>
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-warm-700 hover:bg-warm-900 text-cream rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Menyimpan...
            </>
          ) : isEdit ? "Simpan Perubahan" : "Tambah Kategori"}
        </button>
      </form>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
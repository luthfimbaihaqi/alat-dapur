"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { deleteProduct } from "@/actions/products"
import { ConfirmModal } from "@/components/ui/Modal"
import { useToast, ToastContainer } from "@/components/ui/Toast"
import { Pencil, Trash2 } from "lucide-react"
import type { ProductWithCategory } from "@/types"

export default function AdminProductActions({
  product,
}: {
  product: ProductWithCategory
}) {
  const router               = useRouter()
  const { toasts, showToast, removeToast } = useToast()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting]   = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    const result = await deleteProduct(product.id)
    setIsDeleting(false)
    setConfirmOpen(false)
    if (result.success) {
      showToast("success", `"${product.name}" berhasil dihapus`)
      router.refresh()
    } else {
      showToast("error", result.error ?? "Gagal menghapus produk")
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Link
          href={`/admin/products/edit/${product.id}`}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-warm-50 hover:text-warm-700 transition-colors"
        >
          <Pencil size={15} />
        </Link>
        <button
          onClick={() => setConfirmOpen(true)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Produk?"
        description={`"${product.name}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        confirmLabel="Ya, Hapus"
        isLoading={isDeleting}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
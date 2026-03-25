"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteCategory } from "@/actions/categories"
import { ConfirmModal } from "@/components/ui/Modal"
import Modal from "@/components/ui/Modal"
import { useToast, ToastContainer } from "@/components/ui/Toast"
import CategoryForm from "./CategoryForm"
import { Pencil, Trash2 } from "lucide-react"
import type { Category } from "@/types"

export default function AdminCategoryActions({ category }: { category: Category }) {
  const router = useRouter()
  const { toasts, showToast, removeToast } = useToast()

  const [editOpen, setEditOpen]       = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting]   = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    const result = await deleteCategory(category.id)
    setIsDeleting(false)
    setConfirmOpen(false)
    if (result.success) {
      showToast("success", `"${category.name}" berhasil dihapus`)
      router.refresh()
    } else {
      showToast("error", result.error ?? "Gagal menghapus kategori")
    }
  }

  return (
    <>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setEditOpen(true)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-warm-50 hover:text-warm-700 transition-colors"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => setConfirmOpen(true)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title={`Edit: ${category.name}`}
      >
        <CategoryForm
          category={category}
          onSuccess={() => setEditOpen(false)}
        />
      </Modal>

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Kategori?"
        description={`"${category.name}" akan dihapus permanen. Pastikan tidak ada produk di kategori ini.`}
        confirmLabel="Ya, Hapus"
        isLoading={isDeleting}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
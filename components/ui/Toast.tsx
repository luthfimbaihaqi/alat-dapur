"use client"

import { useEffect, useState, useCallback } from "react"
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────
export type ToastType = "success" | "error" | "warning"

export interface ToastData {
  id: string
  type: ToastType
  message: string
}

interface ToastProps {
  toast: ToastData
  onRemove: (id: string) => void
}

// ─────────────────────────────────────────────
//  SINGLE TOAST ITEM
// ─────────────────────────────────────────────
const toastStyles: Record<ToastType, string> = {
  success: "bg-green-50 border-green-200 text-green-800",
  error:   "bg-red-50 border-red-200 text-red-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
}

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-green-500 shrink-0" />,
  error:   <XCircle size={18} className="text-red-500 shrink-0" />,
  warning: <AlertCircle size={18} className="text-amber-500 shrink-0" />,
}

function ToastItem({ toast, onRemove }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Animasi masuk
    const showTimer = setTimeout(() => setVisible(true), 10)

    // Auto-dismiss setelah 4 detik
    const hideTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRemove(toast.id), 300)
    }, 4000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [toast.id, onRemove])

  return (
    <div
      className={cn(
        "flex items-start gap-3 w-full max-w-sm",
        "rounded-xl border px-4 py-3 shadow-warm-md",
        "transition-all duration-300",
        toastStyles[toast.type],
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2"
      )}
    >
      {/* Icon */}
      {toastIcons[toast.type]}

      {/* Message */}
      <p className="flex-1 text-sm font-medium leading-snug">
        {toast.message}
      </p>

      {/* Close button */}
      <button
        onClick={() => {
          setVisible(false)
          setTimeout(() => onRemove(toast.id), 300)
        }}
        className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
      >
        <X size={15} />
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────
//  TOAST CONTAINER
//  Letakkan sekali di layout admin
//  Contoh: <ToastContainer toasts={toasts} onRemove={removeToast} />
// ─────────────────────────────────────────────
interface ToastContainerProps {
  toasts: ToastData[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center w-full px-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
//  useToast HOOK
//  Dipakai di komponen admin untuk trigger toast
//
//  Contoh:
//  const { toasts, showToast, removeToast } = useToast()
//  showToast("success", "Produk berhasil disimpan!")
//  showToast("error", "Terjadi kesalahan, coba lagi.")
// ─────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, type, message }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, showToast, removeToast }
}
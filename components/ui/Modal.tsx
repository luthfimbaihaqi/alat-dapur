"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import Button from "./Button"

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  variant?: "danger" | "primary"
}

// ─────────────────────────────────────────────
//  BASE MODAL
//  Modal umum dengan slot children bebas
// ─────────────────────────────────────────────
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  // Tutup modal dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-warm-900/40 backdrop-blur-sm" />

      {/* Modal panel */}
      <div
        className={cn(
          "relative z-10 w-full max-w-md",
          "bg-white rounded-2xl shadow-warm-xl",
          "animate-fade-in",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-stone-200">
          <div>
            <h2 className="font-serif text-lg text-warm-900">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-stone-500">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className={cn(
              "ml-4 p-1.5 rounded-lg text-stone-400",
              "hover:bg-warm-50 hover:text-stone-600",
              "transition-colors duration-150"
            )}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {children && (
          <div className="p-5">{children}</div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
//  CONFIRM MODAL
//  Modal konfirmasi khusus untuk aksi destruktif
//  Contoh: hapus produk, hapus kategori
// ─────────────────────────────────────────────
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Ya, Hapus",
  cancelLabel = "Batal",
  isLoading = false,
  variant = "danger",
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-warm-900/40 backdrop-blur-sm" />

      <div
        className={cn(
          "relative z-10 w-full max-w-sm",
          "bg-white rounded-2xl shadow-warm-xl",
          "animate-fade-in p-6"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon warning */}
        <div className={cn(
          "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full",
          variant === "danger" ? "bg-red-100" : "bg-warm-100"
        )}>
          {variant === "danger" ? (
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-warm-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        {/* Text */}
        <h3 className="font-serif text-lg text-warm-900 text-center mb-2">
          {title}
        </h3>
        <p className="text-sm text-stone-500 text-center mb-6">
          {description}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            className="flex-1"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
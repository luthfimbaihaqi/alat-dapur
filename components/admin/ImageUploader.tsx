"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Upload, X, Loader2 } from "lucide-react"

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  label?: string
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 5,
  label = "Foto Produk",
}: ImageUploaderProps) {
  const inputRef             = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError]    = useState("")

  async function uploadFile(file: File): Promise<string | null> {
    try {
      // 1. Minta signature dari server
      const publicId = `products/${Date.now()}-${file.name.replace(/\s+/g, "-")}`
      const sigRes   = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      })

      if (!sigRes.ok) throw new Error("Gagal mendapatkan signature")

      const { signature, timestamp, cloudName, apiKey, folder, uploadPreset } =
        await sigRes.json()

      // 2. Upload langsung ke Cloudinary
      const formData = new FormData()
      formData.append("file", file)
      formData.append("public_id", publicId)
      formData.append("timestamp", timestamp)
      formData.append("signature", signature)
      formData.append("api_key", apiKey)
      formData.append("folder", folder)
      formData.append("upload_preset", uploadPreset)

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      )

      if (!uploadRes.ok) throw new Error("Upload gagal")

      const data = await uploadRes.json()
      return data.secure_url as string
    } catch (err) {
      console.error("Upload error:", err)
      return null
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    const remaining = maxImages - images.length
    const toUpload  = files.slice(0, remaining)

    if (toUpload.length === 0) {
      setError(`Maksimal ${maxImages} foto`)
      return
    }

    setError("")
    setIsUploading(true)

    try {
      const urls = await Promise.all(toUpload.map(uploadFile))
      const valid = urls.filter(Boolean) as string[]
      onChange([...images, ...valid])
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full">
      {label && <p className="label mb-2">{label}</p>}

      <div className="flex flex-wrap gap-3">
        {/* Existing images */}
        {images.map((url, i) => (
          <div
            key={url}
            className="relative w-24 h-24 rounded-xl overflow-hidden border border-stone-200 group"
          >
            <Image
              src={url}
              alt={`Foto ${i + 1}`}
              fill
              className="object-cover"
            />
            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeImage(i)}
              className={cn(
                "absolute top-1 right-1",
                "w-6 h-6 rounded-full bg-red-500 text-white",
                "flex items-center justify-center",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-150"
              )}
            >
              <X size={12} />
            </button>
            {/* First image label */}
            {i === 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-warm-900/60 py-0.5">
                <p className="text-2xs text-cream text-center">Utama</p>
              </div>
            )}
          </div>
        ))}

        {/* Upload button */}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className={cn(
              "w-24 h-24 rounded-xl",
              "border-2 border-dashed border-stone-300",
              "flex flex-col items-center justify-center gap-1.5",
              "text-stone-400 hover:border-warm-300 hover:text-warm-500",
              "transition-all duration-150",
              "disabled:opacity-50 disabled:pointer-events-none"
            )}
          >
            {isUploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span className="text-2xs">Upload...</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span className="text-2xs">Tambah Foto</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Error */}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}

      {/* Hint */}
      <p className="mt-1.5 text-xs text-stone-400">
        Maks. {maxImages} foto · JPG, PNG, WebP · Foto pertama jadi foto utama
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
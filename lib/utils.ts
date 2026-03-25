import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// ─────────────────────────────────────────────
//  TAILWIND CLASS MERGER
//  Dipakai di semua komponen untuk merge class
//  dengan aman tanpa konflik Tailwind
// ─────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─────────────────────────────────────────────
//  FORMAT RUPIAH
//  contoh: 185000 → "Rp 185.000"
// ─────────────────────────────────────────────
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// ─────────────────────────────────────────────
//  SLUGIFY
//  contoh: "Wajan Anti-Lengket" → "wajan-anti-lengket"
// ─────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        // spasi → strip
    .replace(/[^\w\-]+/g, "")   // hapus karakter non-word
    .replace(/\-\-+/g, "-")     // strip ganda → single
    .replace(/^-+/, "")          // hapus strip di awal
    .replace(/-+$/, "")          // hapus strip di akhir
}

// ─────────────────────────────────────────────
//  TRUNCATE TEXT
//  contoh: truncate("Wajan Anti-Lengket Premium", 15) → "Wajan Anti-Len..."
// ─────────────────────────────────────────────
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + "..."
}

// ─────────────────────────────────────────────
//  WHATSAPP URL BUILDER
//  Generate link wa.me dengan pesan template
// ─────────────────────────────────────────────
export function buildWhatsAppUrl(phoneNumber: string, message?: string): string {
  // Bersihkan nomor dari karakter non-digit
  const cleaned = phoneNumber.replace(/\D/g, "")

  // Ganti awalan 0 dengan 62 (kode negara Indonesia)
  const normalized = cleaned.startsWith("0")
    ? "62" + cleaned.slice(1)
    : cleaned

  const defaultMessage = "Halo, saya ingin bertanya tentang produk Anda."
  const encoded = encodeURIComponent(message ?? defaultMessage)

  return `https://wa.me/${normalized}?text=${encoded}`
}

// ─────────────────────────────────────────────
//  CLOUDINARY URL TRANSFORMER
//  Generate URL gambar yang sudah dioptimasi
// ─────────────────────────────────────────────
export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: number | "auto"
    format?: "auto" | "webp" | "jpg" | "png"
  } = {}
): string {
  const {
    width,
    height,
    quality = "auto",
    format = "auto",
  } = options

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  if (!cloudName) {
    console.warn("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME belum di-set di .env.local")
    return ""
  }

  // Bangun transformation string
  const transforms: string[] = [
    `f_${format}`,
    `q_${quality}`,
  ]
  if (width)  transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  transforms.push("c_fill") // crop mode

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${publicId}`
}

// ─────────────────────────────────────────────
//  FORMAT TANGGAL
//  contoh: "2024-01-15T..." → "15 Januari 2024"
// ─────────────────────────────────────────────
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString))
}

// ─────────────────────────────────────────────
//  IS VALID URL
//  Cek apakah string adalah URL yang valid
// ─────────────────────────────────────────────
export function isValidUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}
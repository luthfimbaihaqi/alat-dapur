"use client"

import Link from "next/link"
import Image from "next/image"
import { cn, formatRupiah, buildWhatsAppUrl } from "@/lib/utils"
import Badge from "@/components/ui/Badge"
import type { ProductWithCategory } from "@/types"

// ─────────────────────────────────────────────
//  WA ICON
// ─────────────────────────────────────────────
function WhatsAppIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.14 1.544 5.875L.057 23.804a.5.5 0 00.61.61l5.93-1.487A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 01-5.17-1.447l-.371-.22-3.521.883.9-3.521-.24-.38A9.951 9.951 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  )
}

// ─────────────────────────────────────────────
//  PRODUCT CARD
// ─────────────────────────────────────────────
interface ProductCardProps {
  product: ProductWithCategory
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER ?? ""
  const waUrl    = buildWhatsAppUrl(waNumber)

  const firstImage = product.images?.[0] ?? null

  return (
    <div className={cn("card-hover group flex flex-col", className)}>
      {/* ── IMAGE ── */}
      <Link href={`/products/${product.slug}`}>
        <div className="product-img-wrap rounded-t-xl">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            // Placeholder kalau belum ada foto
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-stone-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Featured badge */}
          {product.is_featured && (
            <div className="absolute top-2.5 left-2.5">
              <Badge variant="featured">Unggulan</Badge>
            </div>
          )}
        </div>
      </Link>

      {/* ── BODY ── */}
      <div className="flex flex-col flex-1 p-3">
        {/* Category */}
        <p className="section-label mb-1">{product.category?.name}</p>

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className={cn(
            "font-serif text-[15px] text-warm-900 leading-snug mb-2",
            "hover:text-warm-600 transition-colors duration-150",
            "line-clamp-2"
          )}>
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-auto">
          <p className="text-sm font-medium text-warm-600 mb-2.5">
            {formatRupiah(product.price)}
            <span className="text-xs font-normal text-stone-400 ml-1">
              / {product.unit}
            </span>
          </p>

          {/* WA Button */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center justify-center gap-1.5 w-full",
              "bg-[#25D366] hover:bg-[#1aab52] text-white",
              "rounded-lg py-2 text-xs font-medium",
              "transition-colors duration-150"
            )}
          >
            <WhatsAppIcon size={13} />
            Pesan via WA
          </a>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
//  PRODUCT CARD SKELETON
//  Loading placeholder saat data belum tersedia
// ─────────────────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div className="card flex flex-col animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square w-full rounded-t-xl bg-stone-200" />
      {/* Body skeleton */}
      <div className="p-3 flex flex-col gap-2">
        <div className="h-2.5 w-16 bg-stone-200 rounded-full" />
        <div className="h-4 w-full bg-stone-200 rounded-full" />
        <div className="h-4 w-3/4 bg-stone-200 rounded-full" />
        <div className="h-3.5 w-20 bg-stone-200 rounded-full mt-1" />
        <div className="h-8 w-full bg-stone-200 rounded-lg mt-1" />
      </div>
    </div>
  )
}
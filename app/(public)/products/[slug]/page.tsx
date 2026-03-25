import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { cn, buildWhatsAppUrl, formatRupiah } from "@/lib/utils"
import { getProductBySlug, getProductsByCategory } from "@/actions/products"
import ProductCard from "@/components/public/ProductCard"
import Badge from "@/components/ui/Badge"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Produk tidak ditemukan" }
  return {
    title: product.name,
    description: product.description ?? `${product.name} - ${formatRupiah(product.price)}`,
  }
}

export const revalidate = 3600

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.14 1.544 5.875L.057 23.804a.5.5 0 00.61.61l5.93-1.487A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 01-5.17-1.447l-.371-.22-3.521.883.9-3.521-.24-.38A9.951 9.951 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  )
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product  = await getProductBySlug(slug)

  if (!product) notFound()

  const related = product.category_id
    ? (await getProductsByCategory(product.category_id))
        .filter((p) => p.id !== product.id)
        .slice(0, 4)
    : []

  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER ?? ""
  const waUrl    = buildWhatsAppUrl(waNumber)

  return (
    <div className="container-app py-6 sm:py-10">

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
        <Link href="/" className="hover:text-warm-600 transition-colors">Beranda</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/categories/${product.category.slug}`} className="hover:text-warm-600 transition-colors">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-stone-600 truncate">{product.name}</span>
      </nav>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">

        {/* IMAGES */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-warm-50">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-16 h-16 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            {product.is_featured && (
              <div className="absolute top-3 left-3">
                <Badge variant="featured">Unggulan</Badge>
              </div>
            )}
          </div>

          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {product.images.map((img, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-warm-50 border border-stone-200">
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {product.video_url && (
            <div className="rounded-2xl overflow-hidden aspect-video bg-warm-900">
              <video src={product.video_url} controls className="w-full h-full object-cover" poster={product.images?.[0]} />
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="flex flex-col">
          {product.category && (
            <Link href={`/categories/${product.category.slug}`} className="section-label text-warm-500 hover:text-warm-700 transition-colors mb-2">
              {product.category.name}
            </Link>
          )}

          <h1 className="font-serif text-2xl sm:text-3xl text-warm-900 leading-tight mb-4">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="font-serif text-2xl text-warm-700">{formatRupiah(product.price)}</span>
            <span className="text-sm text-stone-400">/ {product.unit}</span>
          </div>

          {product.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-stone-700 mb-2">Deskripsi</h3>
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}

          <div className="divider mb-6" />

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center justify-center gap-2 w-full",
              "bg-[#25D366] hover:bg-[#1aab52] text-white",
              "rounded-xl py-3.5 text-base font-medium",
              "transition-colors duration-150",
              "shadow-[0_4px_16px_rgba(37,211,102,0.3)]"
            )}
          >
            <WhatsAppIcon size={20} />
            Pesan via WhatsApp
          </a>
          <p className="text-xs text-stone-400 text-center mt-2">
            Klik untuk langsung chat dengan kami
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-serif text-xl text-warm-900 mb-5">Produk Lainnya di Kategori Ini</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
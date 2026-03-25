import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getCategoryBySlug } from "@/actions/categories"
import { getProductsByCategory } from "@/actions/products"
import ProductCard from "@/components/public/ProductCard"
import type { Metadata } from "next"

// ─────────────────────────────────────────────
//  DYNAMIC METADATA
// ─────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: "Kategori tidak ditemukan" }
  return {
    title: category.name,
    description: category.description ?? `Produk kategori ${category.name}`,
  }
}

export const revalidate = 3600

// ─────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug }   = await params
  const category   = await getCategoryBySlug(slug)

  if (!category) notFound()

  const products = await getProductsByCategory(category.id)

  return (
    <div className="container-app py-6 sm:py-10">

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
        <Link href="/" className="hover:text-warm-600 transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <span className="text-stone-600">{category.name}</span>
      </nav>

      {/* CATEGORY HEADER */}
      <div className="flex items-center gap-4 mb-8">
        {category.image_url && (
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-warm-50 shrink-0">
            <Image
              src={category.image_url}
              alt={category.name}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-warm-900">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-sm text-stone-500 mt-1">{category.description}</p>
          )}
        </div>
        <span className="ml-auto text-sm text-stone-400 shrink-0">
          {products.length} produk
        </span>
      </div>

      {/* PRODUCTS GRID */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-warm-50 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <p className="font-serif text-lg text-warm-900 mb-1">
            Belum ada produk
          </p>
          <p className="text-sm text-stone-400">
            Produk di kategori ini akan segera hadir.
          </p>
          <Link
            href="/"
            className="mt-4 text-sm font-medium text-warm-600 hover:text-warm-800 transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      )}
    </div>
  )
}
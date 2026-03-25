import Link from "next/link"
import { cn, buildWhatsAppUrl } from "@/lib/utils"
import { getFeaturedProducts, getActiveProducts } from "@/actions/products"
import { getActiveCategories } from "@/actions/categories"
import ProductCard from "@/components/public/ProductCard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Alat Dapur MBG — Peralatan Dapur Berkualitas",
  description:
    "Kami menyediakan semua kebutuhan peralatan masak untuk program Makan Bergizi Gratis. Harga terjangkau, kualitas terjamin.",
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.14 1.544 5.875L.057 23.804a.5.5 0 00.61.61l5.93-1.487A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 01-5.17-1.447l-.371-.22-3.521.883.9-3.521-.24-.38A9.951 9.951 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  )
}

export const revalidate = 3600

export default async function HomePage() {
  const [featured, allProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getActiveProducts(),
    getActiveCategories(),
  ])

  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER ?? ""
  const waUrl    = buildWhatsAppUrl(waNumber)

  return (
    <>
      {/* HERO */}
      <section className="bg-warm-900 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-warm-700/30" />
        <div className="absolute right-16 -bottom-20 w-48 h-48 rounded-full bg-warm-500/20" />
        <div className="container-app relative py-10 sm:py-14">
          <p className="section-label text-warm-300 mb-3">
            Alat Dapur MBG — alatdapurmbg.id
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-cream leading-tight max-w-sm text-balance">
            Solusi Lengkap Peralatan Dapur <em className="text-warm-300 italic">MBG</em>
          </h1>
          <p className="mt-3 text-sm text-warm-100/60 leading-relaxed max-w-xs">
            Kami menyediakan semua kebutuhan peralatan masak untuk program Makan Bergizi Gratis. Harga terjangkau, kualitas terjamin.
          </p>
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1aab52] text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-150"
            >
              <WhatsAppIcon size={16} />
              Pesan via WhatsApp
            </a>
            <Link
              href="#produk"
              className="inline-flex items-center gap-2 border border-warm-300/40 text-warm-300 hover:border-warm-300 hover:text-warm-100 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-150"
            >
              Lihat Katalog →
            </Link>
          </div>
        </div>
      </section>

      {/* KATEGORI */}
      {categories.length > 0 && (
        <section className="container-app py-10">
          <h2 className="font-serif text-2xl text-warm-900 mb-5">Kategori</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className={cn(
                  "card-hover flex items-center justify-center",
                  "px-4 py-5 rounded-xl text-center",
                  "border border-stone-200 bg-white",
                  "hover:border-warm-300 hover:bg-warm-50",
                  "transition-all duration-150"
                )}
              >
                <span className="text-sm font-medium text-stone-700 leading-snug">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* PRODUK UNGGULAN */}
      {featured.length > 0 && (
        <section className="bg-warm-50">
          <div className="container-app py-10">
            <h2 className="font-serif text-2xl text-warm-900 mb-5">Produk Unggulan</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEMUA PRODUK */}
      <section id="produk" className="container-app py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl text-warm-900">Semua Produk</h2>
          <span className="text-sm text-stone-400">{allProducts.length} produk</span>
        </div>
        {allProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {allProducts.map((product) => (
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
            <p className="font-serif text-lg text-warm-900 mb-1">Belum ada produk</p>
            <p className="text-sm text-stone-400">
              Produk akan segera hadir. Hubungi kami via WhatsApp untuk info lebih lanjut.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1aab52] text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-150"
            >
              <WhatsAppIcon size={15} />
              Hubungi Kami
            </a>
          </div>
        )}
      </section>
    </>
  )
}
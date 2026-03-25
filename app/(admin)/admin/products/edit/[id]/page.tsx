import { notFound } from "next/navigation"
import Link from "next/link"
import { getProductById } from "@/actions/products"
import { getCategories } from "@/actions/categories"
import ProductForm from "@/components/admin/ProductForm"
import { ChevronLeft } from "lucide-react"

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ])

  if (!product) notFound()

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/products"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors"
        >
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="font-serif text-2xl text-warm-900">Edit Produk</h1>
          <p className="text-sm text-stone-500 mt-0.5 truncate max-w-xs">{product.name}</p>
        </div>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  )
}
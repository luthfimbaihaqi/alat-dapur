import { getActiveCategories } from "@/actions/categories"
import Header from "@/components/public/Header"
import Footer from "@/components/public/Footer"

// ─────────────────────────────────────────────
//  PUBLIC LAYOUT
//  Membungkus semua halaman publik dengan
//  Header + Footer yang sudah berisi data kategori
// ─────────────────────────────────────────────
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch kategori aktif di server — sekali untuk Header & Footer
  const categories = await getActiveCategories()

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} />
      <main className="flex-1">
        {children}
      </main>
      <Footer categories={categories} />
    </div>
  )
}
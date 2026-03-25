import Link from "next/link"
import { cn, buildWhatsAppUrl } from "@/lib/utils"
import type { Category } from "@/types"

// ─────────────────────────────────────────────
//  WA ICON
// ─────────────────────────────────────────────
function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.14 1.544 5.875L.057 23.804a.5.5 0 00.61.61l5.93-1.487A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 01-5.17-1.447l-.371-.22-3.521.883.9-3.521-.24-.38A9.951 9.951 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  )
}

// ─────────────────────────────────────────────
//  FOOTER COMPONENT
// ─────────────────────────────────────────────
interface FooterProps {
  categories?: Category[]
}

export default function Footer({ categories = [] }: FooterProps) {
  const waNumber  = process.env.NEXT_PUBLIC_WA_NUMBER ?? ""
  const waUrl     = buildWhatsAppUrl(waNumber)
  const siteName  = process.env.NEXT_PUBLIC_SITE_NAME ?? "Alat Dapur MBG"
  const year      = new Date().getFullYear()

  return (
    <footer className="bg-warm-900 text-cream mt-16">
      {/* ── MAIN FOOTER ── */}
      <div className="container-app py-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">

        {/* Brand */}
        <div>
          <Link href="/">
            <span className="font-serif text-xl tracking-tight">
              Alat Dapur <em className="text-warm-300 italic">MBG</em>
            </span>
          </Link>
          <p className="mt-3 text-sm text-warm-100/60 leading-relaxed max-w-xs">
            Peralatan dapur berkualitas untuk kebutuhan rumah tangga sehari-hari.
            Temukan produk pilihan kami dan pesan langsung via WhatsApp.
          </p>

          {/* WA Button */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-4 inline-flex items-center gap-2",
              "bg-[#25D366] hover:bg-[#1aab52] text-white",
              "rounded-lg px-4 py-2.5 text-sm font-medium",
              "transition-colors duration-150"
            )}
          >
            <WhatsAppIcon size={15} />
            Hubungi Kami
          </a>
        </div>

        {/* Kategori */}
        {categories.length > 0 && (
          <div>
            <h4 className="section-label text-warm-300 mb-4">Kategori</h4>
            <ul className="flex flex-col gap-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className={cn(
                      "text-sm text-warm-100/70",
                      "hover:text-warm-300 transition-colors duration-150"
                    )}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigasi */}
        <div>
          <h4 className="section-label text-warm-300 mb-4">Navigasi</h4>
          <ul className="flex flex-col gap-2">
            {[
              { label: "Beranda",      href: "/" },
              { label: "Tentang Kami", href: "/tentang-kami" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm text-warm-100/70",
                    "hover:text-warm-300 transition-colors duration-150"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-warm-700/50">
        <div className={cn(
          "container-app py-4",
          "flex flex-col sm:flex-row items-center justify-between gap-2"
        )}>
          <p className="text-xs text-warm-100/40">
            &copy; {year} {siteName}. Hak cipta dilindungi.
          </p>
          <p className="text-xs text-warm-100/40">
            alatdapurmbg.id
          </p>
        </div>
      </div>
    </footer>
  )
}
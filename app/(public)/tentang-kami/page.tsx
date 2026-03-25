import Link from "next/link"
import { cn, buildWhatsAppUrl } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Mengenal lebih dekat Alat Dapur MBG — toko peralatan dapur berkualitas.",
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.14 1.544 5.875L.057 23.804a.5.5 0 00.61.61l5.93-1.487A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 01-5.17-1.447l-.371-.22-3.521.883.9-3.521-.24-.38A9.951 9.951 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  )
}

export default function TentangKamiPage() {
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER ?? ""
  const waUrl    = buildWhatsAppUrl(waNumber)

  return (
    <div className="container-app py-6 sm:py-10 max-w-2xl">

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
        <Link href="/" className="hover:text-warm-600 transition-colors">Beranda</Link>
        <span>/</span>
        <span className="text-stone-600">Tentang Kami</span>
      </nav>

      {/* HERO */}
      <div className="bg-warm-900 rounded-2xl px-6 py-8 mb-8 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-warm-700/30" />
        <div className="absolute right-8 -bottom-10 w-28 h-28 rounded-full bg-warm-500/20" />
        <p className="section-label text-warm-300 mb-2 relative">Tentang Kami</p>
        <h1 className="font-serif text-2xl sm:text-3xl text-cream leading-tight relative">
          Alat Dapur <em className="text-warm-300 italic">MBG</em>
        </h1>
        <p className="mt-3 text-sm text-warm-100/60 leading-relaxed relative">
          Toko peralatan dapur berkualitas untuk kebutuhan rumah tangga sehari-hari.
        </p>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-6">

        <div className="card p-5">
          <h2 className="font-serif text-lg text-warm-900 mb-3">Siapa Kami?</h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Alat Dapur MBG adalah toko peralatan dapur yang menyediakan berbagai
            produk berkualitas tinggi untuk kebutuhan dapur rumah tangga. Kami
            berkomitmen untuk memberikan produk terbaik dengan harga yang terjangkau.
          </p>
          <p className="text-sm text-stone-600 leading-relaxed mt-3">
            Setiap produk yang kami jual dipilih dengan cermat untuk memastikan
            kualitas dan keawetannya. Kepuasan pelanggan adalah prioritas utama kami.
          </p>
        </div>

        <div className="card p-5">
          <h2 className="font-serif text-lg text-warm-900 mb-4">Mengapa Pilih Kami?</h2>
          <div className="flex flex-col gap-3">
            {[
              { title: "Produk Berkualitas", desc: "Semua produk dipilih dari produsen terpercaya" },
              { title: "Harga Terjangkau",   desc: "Harga kompetitif tanpa mengorbankan kualitas" },
              { title: "Pemesanan Mudah",    desc: "Cukup chat via WhatsApp, kami siap melayani" },
              { title: "Pelayanan Ramah",    desc: "Kami dengan senang hati membantu pertanyaan Anda" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-warm-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-warm-700">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">{item.title}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-serif text-lg text-warm-900 mb-4">Hubungi Kami</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-warm-50 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-warm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-stone-400">WhatsApp</p>
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium text-warm-700 hover:text-warm-900 transition-colors">
                  {process.env.NEXT_PUBLIC_WA_NUMBER ?? "-"}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-warm-50 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-warm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-stone-400">Website</p>
                <p className="text-sm font-medium text-stone-700">alatdapurmbg.id</p>
              </div>
            </div>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-5 flex items-center justify-center gap-2 w-full",
              "bg-[#25D366] hover:bg-[#1aab52] text-white",
              "rounded-xl py-3 text-sm font-medium",
              "transition-colors duration-150"
            )}
          >
            <WhatsAppIcon size={16} />
            Chat via WhatsApp Sekarang
          </a>
        </div>
      </div>
    </div>
  )
}
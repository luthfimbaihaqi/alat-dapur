import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Alat Dapur MBG",
    template: "%s | Alat Dapur MBG",
  },
  description: "Temukan lengkap kebutuhan dapur Anda. Peralatan dapur berkualitas dengan harga terjangkau.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
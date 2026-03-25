import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// ─────────────────────────────────────────────
//  MIDDLEWARE
//  Berjalan di setiap request sebelum halaman dirender
//  Tugasnya:
//  1. Refresh session Supabase agar tidak expired
//  2. Proteksi rute /admin — redirect ke /auth kalau belum login
//  3. Redirect ke /admin kalau sudah login tapi buka /auth
// ─────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — JANGAN hapus baris ini
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Kalau akses /admin tapi belum login → redirect ke /auth
  if (pathname.startsWith("/admin") && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/auth"
    redirectUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Kalau sudah login tapi buka /auth → redirect ke /admin
  if (pathname === "/auth" && user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/admin"
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

// ─────────────────────────────────────────────
//  MATCHER
//  Tentukan rute mana yang diproses middleware
//  Exclude: file statis, gambar, favicon
// ─────────────────────────────────────────────
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// ─────────────────────────────────────────────
//  SUPABASE CLIENT — Server Side
//  Dipakai di:
//  - Server Components
//  - Server Actions
//  - Route Handlers (API)
//  - middleware.ts
// ─────────────────────────────────────────────
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // setAll dipanggil dari Server Component
            // bisa diabaikan jika ada middleware yang refresh session
          }
        },
      },
    }
  )
}

// ─────────────────────────────────────────────
//  SUPABASE ADMIN CLIENT — Server Side Only
//  Memakai service_role key — bypass RLS
//  HANYA dipakai untuk operasi admin yang butuh
//  akses penuh (contoh: upload, delete paksa)
//  JANGAN dipakai di Client Components!
// ─────────────────────────────────────────────
export async function createAdminClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {}
        },
      },
    }
  )
}
import { createBrowserClient } from "@supabase/ssr"

// ─────────────────────────────────────────────
//  SUPABASE CLIENT — Browser Side
//  Dipakai di Client Components (use client)
//  Contoh: form interaktif, realtime, auth di browser
// ─────────────────────────────────────────────
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
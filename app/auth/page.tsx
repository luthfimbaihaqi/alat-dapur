"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail]         = useState("")
  const [password, setPassword]   = useState("")
  const [error, setError]         = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError("Email atau password salah. Coba lagi.")
        return
      }
      router.push("/admin")
      router.refresh()
    } catch {
      setError("Terjadi kesalahan. Coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-serif text-2xl text-warm-900">
            Alat Dapur <em className="text-warm-500 italic">MBG</em>
          </span>
          <p className="mt-2 text-sm text-stone-500">Masuk ke halaman admin</p>
        </div>

        {/* Card */}
        <div className="card p-6">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                required
                className="input"
              />
            </div>

            {/* Password */}
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full rounded-lg py-2.5 text-sm font-medium text-cream",
                "bg-warm-700 hover:bg-warm-900 transition-colors duration-150",
                "disabled:opacity-50 disabled:pointer-events-none",
                "flex items-center justify-center gap-2"
              )}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Masuk...
                </>
              ) : "Masuk"}
            </button>
          </form>
        </div>

        <p className="text-center mt-4 text-xs text-stone-400">
          <a href="/" className="hover:text-warm-600 transition-colors">
            ← Kembali ke website
          </a>
        </p>
      </div>
    </div>
  )
}
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateSignature, CLOUDINARY_FOLDER, CLOUDINARY_UPLOAD_PRESET } from "@/lib/cloudinary"

// ─────────────────────────────────────────────
//  POST /api/cloudinary/sign
//  Generate signature untuk signed upload
//  Hanya bisa diakses oleh user yang sudah login
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // Cek autentikasi — hanya admin yang boleh upload
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Ambil publicId dari request body
    const body = await request.json()
    const { publicId } = body

    if (!publicId) {
      return NextResponse.json(
        { error: "publicId wajib diisi" },
        { status: 400 }
      )
    }

    // Generate timestamp & signature
    const timestamp = Math.round(Date.now() / 1000)
    const signature = generateSignature(publicId, timestamp)

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey:    process.env.CLOUDINARY_API_KEY,
      folder:    CLOUDINARY_FOLDER,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
    })
  } catch (error) {
    console.error("Sign upload error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
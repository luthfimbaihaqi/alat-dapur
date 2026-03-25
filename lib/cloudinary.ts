import { v2 as cloudinary } from "cloudinary"

// ─────────────────────────────────────────────
//  CLOUDINARY CONFIGURATION
//  Dipakai di server side only (API routes, Server Actions)
// ─────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
})

export default cloudinary

// ─────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────
export const CLOUDINARY_UPLOAD_PRESET = "alat-dapur-mbg"
export const CLOUDINARY_FOLDER        = "alat-dapur-mbg"

// ─────────────────────────────────────────────
//  GENERATE SIGNATURE
//  Untuk signed upload langsung dari browser
//  Dipanggil oleh API route /api/cloudinary/sign
// ─────────────────────────────────────────────
export function generateSignature(
  publicId: string,
  timestamp: number
): string {
  return cloudinary.utils.api_sign_request(
    {
      public_id: publicId,
      timestamp,
      upload_preset: CLOUDINARY_UPLOAD_PRESET,
      folder: CLOUDINARY_FOLDER,
    },
    process.env.CLOUDINARY_API_SECRET!
  )
}

// ─────────────────────────────────────────────
//  DELETE IMAGE
//  Hapus gambar dari Cloudinary by public_id
// ─────────────────────────────────────────────
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result.result === "ok"
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    return false
  }
}
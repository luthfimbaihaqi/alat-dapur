// ─────────────────────────────────────────────
//  CATEGORY
// ─────────────────────────────────────────────
export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Untuk form tambah/edit kategori (tanpa id & timestamps)
export type CategoryFormData = Pick<
  Category,
  "name" | "slug" | "description" | "image_url" | "display_order" | "is_active"
>

// ─────────────────────────────────────────────
//  PRODUCT
// ─────────────────────────────────────────────
export interface Product {
  id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  images: string[]        // array URL Cloudinary
  video_url: string | null
  price: number
  unit: string            // contoh: "pcs", "set", "lusin"
  is_active: boolean
  is_featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

// Product lengkap dengan data kategori (hasil JOIN)
export interface ProductWithCategory extends Product {
  category: Pick<Category, "id" | "name" | "slug">
}

// Untuk form tambah/edit produk (tanpa id & timestamps)
export type ProductFormData = Pick<
  Product,
  | "category_id"
  | "name"
  | "slug"
  | "description"
  | "images"
  | "video_url"
  | "price"
  | "unit"
  | "is_active"
  | "is_featured"
  | "display_order"
>

// ─────────────────────────────────────────────
//  API RESPONSES
// ─────────────────────────────────────────────

// Generic response untuk Server Actions
export interface ActionResponse<T = null> {
  success: boolean
  data?: T
  error?: string
}

// ─────────────────────────────────────────────
//  CLOUDINARY
// ─────────────────────────────────────────────
export interface CloudinarySignature {
  signature: string
  timestamp: number
  cloudName: string
  apiKey: string
}

// ─────────────────────────────────────────────
//  NAVIGATION
// ─────────────────────────────────────────────
export interface NavItem {
  label: string
  href: string
}
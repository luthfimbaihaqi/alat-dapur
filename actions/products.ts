"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/utils"
import type { ActionResponse, Product, ProductFormData, ProductWithCategory } from "@/types"

// ─────────────────────────────────────────────
//  GET ALL PRODUCTS
//  Ambil semua produk beserta kategorinya
//  Dipakai di admin dashboard
// ─────────────────────────────────────────────
export async function getProducts(): Promise<ProductWithCategory[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("getProducts error:", error)
    return []
  }

  return data ?? []
}

// ─────────────────────────────────────────────
//  GET ACTIVE PRODUCTS
//  Ambil produk aktif beserta kategorinya
//  Dipakai di halaman publik
// ─────────────────────────────────────────────
export async function getActiveProducts(): Promise<ProductWithCategory[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("getActiveProducts error:", error)
    return []
  }

  return data ?? []
}

// ─────────────────────────────────────────────
//  GET FEATURED PRODUCTS
//  Ambil produk unggulan untuk homepage
// ─────────────────────────────────────────────
export async function getFeaturedProducts(): Promise<ProductWithCategory[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("getFeaturedProducts error:", error)
    return []
  }

  return data ?? []
}

// ─────────────────────────────────────────────
//  GET PRODUCTS BY CATEGORY
//  Ambil produk aktif berdasarkan category_id
//  Dipakai di halaman kategori publik
// ─────────────────────────────────────────────
export async function getProductsByCategory(
  categoryId: string
): Promise<ProductWithCategory[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("getProductsByCategory error:", error)
    return []
  }

  return data ?? []
}

// ─────────────────────────────────────────────
//  GET PRODUCT BY SLUG
//  Dipakai di halaman detail produk publik
// ─────────────────────────────────────────────
export async function getProductBySlug(
  slug: string
): Promise<ProductWithCategory | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (error) {
    console.error("getProductBySlug error:", error)
    return null
  }

  return data
}

// ─────────────────────────────────────────────
//  GET PRODUCT BY ID
//  Dipakai di form edit admin
// ─────────────────────────────────────────────
export async function getProductById(
  id: string
): Promise<ProductWithCategory | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("getProductById error:", error)
    return null
  }

  return data
}

// ─────────────────────────────────────────────
//  SEARCH PRODUCTS
//  Cari produk berdasarkan nama
//  Dipakai di search bar header
// ─────────────────────────────────────────────
export async function searchProducts(
  query: string
): Promise<ProductWithCategory[]> {
  if (!query.trim()) return []

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq("is_active", true)
    .ilike("name", `%${query}%`)
    .order("display_order", { ascending: true })
    .limit(8)

  if (error) {
    console.error("searchProducts error:", error)
    return []
  }

  return data ?? []
}

// ─────────────────────────────────────────────
//  CREATE PRODUCT
// ─────────────────────────────────────────────
export async function createProduct(
  formData: ProductFormData
): Promise<ActionResponse<Product>> {
  try {
    const supabase = await createClient()

    // Auto-generate slug dari name kalau slug kosong
    const slug = formData.slug?.trim()
      ? formData.slug.trim()
      : slugify(formData.name)

    const { data, error } = await supabase
      .from("products")
      .insert({ ...formData, slug })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "Slug sudah digunakan, gunakan nama lain" }
      }
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin/products")
    revalidatePath(`/categories/${formData.category_id}`)

    return { success: true, data }
  } catch (error) {
    console.error("createProduct error:", error)
    return { success: false, error: "Terjadi kesalahan, coba lagi" }
  }
}

// ─────────────────────────────────────────────
//  UPDATE PRODUCT
// ─────────────────────────────────────────────
export async function updateProduct(
  id: string,
  formData: Partial<ProductFormData>
): Promise<ActionResponse<Product>> {
  try {
    const supabase = await createClient()

    // Auto-generate slug kalau name berubah dan slug tidak diisi
    if (formData.name && !formData.slug) {
      formData.slug = slugify(formData.name)
    }

    const { data, error } = await supabase
      .from("products")
      .update(formData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "Slug sudah digunakan, gunakan nama lain" }
      }
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin/products")
    revalidatePath(`/products/${data.slug}`)

    return { success: true, data }
  } catch (error) {
    console.error("updateProduct error:", error)
    return { success: false, error: "Terjadi kesalahan, coba lagi" }
  }
}

// ─────────────────────────────────────────────
//  DELETE PRODUCT
// ─────────────────────────────────────────────
export async function deleteProduct(
  id: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin/products")

    return { success: true }
  } catch (error) {
    console.error("deleteProduct error:", error)
    return { success: false, error: "Terjadi kesalahan, coba lagi" }
  }
}

// ─────────────────────────────────────────────
//  UPDATE DISPLAY ORDER
//  Untuk fitur drag & drop urutan produk
// ─────────────────────────────────────────────
export async function updateProductsOrder(
  updates: { id: string; display_order: number }[]
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const promises = updates.map(({ id, display_order }) =>
      supabase
        .from("products")
        .update({ display_order })
        .eq("id", id)
    )

    await Promise.all(promises)

    revalidatePath("/")
    revalidatePath("/admin/products")

    return { success: true }
  } catch (error) {
    console.error("updateProductsOrder error:", error)
    return { success: false, error: "Terjadi kesalahan, coba lagi" }
  }
}
"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/utils"
import type { ActionResponse, Category, CategoryFormData } from "@/types"

// ─────────────────────────────────────────────
//  GET ALL CATEGORIES
//  Ambil semua kategori (termasuk yang tidak aktif)
//  Dipakai di admin dashboard
// ─────────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) {
    console.error("getCategories error:", error)
    return []
  }

  return data ?? []
}

// ─────────────────────────────────────────────
//  GET ACTIVE CATEGORIES
//  Ambil kategori yang aktif saja
//  Dipakai di halaman publik
// ─────────────────────────────────────────────
export async function getActiveCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("getActiveCategories error:", error)
    return []
  }

  return data ?? []
}

// ─────────────────────────────────────────────
//  GET CATEGORY BY SLUG
//  Dipakai di halaman kategori publik
// ─────────────────────────────────────────────
export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (error) {
    console.error("getCategoryBySlug error:", error)
    return null
  }

  return data
}

// ─────────────────────────────────────────────
//  CREATE CATEGORY
// ─────────────────────────────────────────────
export async function createCategory(
  formData: CategoryFormData
): Promise<ActionResponse<Category>> {
  try {
    const supabase = await createClient()

    // Auto-generate slug dari name kalau slug kosong
    const slug = formData.slug?.trim()
      ? formData.slug.trim()
      : slugify(formData.name)

    const { data, error } = await supabase
      .from("categories")
      .insert({ ...formData, slug })
      .select()
      .single()

    if (error) {
      // Slug duplicate
      if (error.code === "23505") {
        return { success: false, error: "Slug sudah digunakan, gunakan nama lain" }
      }
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin/categories")

    return { success: true, data }
  } catch (error) {
    console.error("createCategory error:", error)
    return { success: false, error: "Terjadi kesalahan, coba lagi" }
  }
}

// ─────────────────────────────────────────────
//  UPDATE CATEGORY
// ─────────────────────────────────────────────
export async function updateCategory(
  id: string,
  formData: Partial<CategoryFormData>
): Promise<ActionResponse<Category>> {
  try {
    const supabase = await createClient()

    // Auto-generate slug kalau name berubah dan slug tidak diisi
    if (formData.name && !formData.slug) {
      formData.slug = slugify(formData.name)
    }

    const { data, error } = await supabase
      .from("categories")
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
    revalidatePath("/admin/categories")
    revalidatePath(`/categories/${data.slug}`)

    return { success: true, data }
  } catch (error) {
    console.error("updateCategory error:", error)
    return { success: false, error: "Terjadi kesalahan, coba lagi" }
  }
}

// ─────────────────────────────────────────────
//  DELETE CATEGORY
//  Tidak bisa hapus kalau masih ada produk di dalamnya
// ─────────────────────────────────────────────
export async function deleteCategory(
  id: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Cek apakah masih ada produk di kategori ini
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id)

    if (count && count > 0) {
      return {
        success: false,
        error: `Tidak bisa dihapus, masih ada ${count} produk di kategori ini`,
      }
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin/categories")

    return { success: true }
  } catch (error) {
    console.error("deleteCategory error:", error)
    return { success: false, error: "Terjadi kesalahan, coba lagi" }
  }
}

// ─────────────────────────────────────────────
//  UPDATE DISPLAY ORDER
//  Untuk fitur drag & drop urutan kategori
// ─────────────────────────────────────────────
export async function updateCategoriesOrder(
  updates: { id: string; display_order: number }[]
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Update semua sekaligus
    const promises = updates.map(({ id, display_order }) =>
      supabase
        .from("categories")
        .update({ display_order })
        .eq("id", id)
    )

    await Promise.all(promises)

    revalidatePath("/")
    revalidatePath("/admin/categories")

    return { success: true }
  } catch (error) {
    console.error("updateCategoriesOrder error:", error)
    return { success: false, error: "Terjadi kesalahan, coba lagi" }
  }
}
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    const { path } = await request.json()

    if (!path) {
      return NextResponse.json(
        { error: "Path wajib diisi" },
        { status: 400 }
      )
    }

    revalidatePath(path)

    return NextResponse.json({ revalidated: true, path })
  } catch {
    return NextResponse.json(
      { error: "Gagal revalidate" },
      { status: 500 }
    )
  }
}
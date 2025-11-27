// app/api/upload/route.ts
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { isAuthenticated } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    // 관리자 인증 확인
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { ok: false, error: "권한이 없습니다." },
        { status: 401 },
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "파일이 없습니다." },
        { status: 400 },
      )
    }

    // 파일 유효성 검사
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { ok: false, error: "파일 크기는 5MB 이하여야 합니다." },
        { status: 400 },
      )
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: "지원하지 않는 파일 형식입니다." },
        { status: 400 },
      )
    }

    // 파일명 생성 (타임스탬프 + 랜덤)
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const fileExt = file.name.split(".").pop()
    const fileName = `${timestamp}-${randomString}.${fileExt}`

    // 파일을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Supabase Storage에 업로드
    const { data, error } = await supabaseAdmin.storage
      .from("post-images")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error("Supabase Storage error:", error)
      return NextResponse.json(
        { ok: false, error: "이미지 업로드에 실패했습니다." },
        { status: 500 },
      )
    }

    // 공개 URL 가져오기
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("post-images").getPublicUrl(fileName)

    return NextResponse.json({
      ok: true,
      location: publicUrl,
    })
  } catch (e) {
    console.error("Upload API error:", e)
    return NextResponse.json(
      { ok: false, error: "업로드 처리 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

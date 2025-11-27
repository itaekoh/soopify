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

    // 파일 타입 구분
    const isImage = file.type.startsWith("image/")
    const isDocument =
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/vnd.ms-excel" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-powerpoint" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      file.type === "text/plain" ||
      file.type === "application/zip" ||
      file.type === "application/x-zip-compressed"

    if (!isImage && !isDocument) {
      return NextResponse.json(
        {
          ok: false,
          error: "지원하지 않는 파일 형식입니다. (이미지, PDF, DOC, XLS, PPT, TXT, ZIP만 가능)",
        },
        { status: 400 },
      )
    }

    // 파일 크기 검사 (이미지: 5MB, 문서: 10MB)
    const maxSize = isImage ? 5 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          ok: false,
          error: `파일 크기는 ${isImage ? "5MB" : "10MB"} 이하여야 합니다.`,
        },
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

    // 저장소 버킷 선택 (이미지: post-images, 문서: post-files)
    const bucketName = isImage ? "post-images" : "post-files"

    // Supabase Storage에 업로드
    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error("Supabase Storage error:", error)
      return NextResponse.json(
        { ok: false, error: "파일 업로드에 실패했습니다." },
        { status: 500 },
      )
    }

    // 공개 URL 가져오기
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucketName).getPublicUrl(fileName)

    return NextResponse.json({
      ok: true,
      location: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    })
  } catch (e) {
    console.error("Upload API error:", e)
    return NextResponse.json(
      { ok: false, error: "업로드 처리 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

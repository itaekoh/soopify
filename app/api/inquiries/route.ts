// app/api/inquiries/route.ts
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { isAuthenticated } from "@/lib/auth"

// 상담 문의 목록 조회 (관리자 전용)
export async function GET(req: Request) {
  try {
    // 관리자 인증 확인
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { ok: false, error: "권한이 없습니다." },
        { status: 401 },
      )
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    const { data, error, count } = await supabaseAdmin
      .from("contact_inquiries")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { ok: false, error: "문의 조회에 실패했습니다." },
        { status: 500 },
      )
    }

    return NextResponse.json({
      ok: true,
      inquiries: data,
      total: count,
      page,
      limit,
    })
  } catch (e) {
    console.error("Inquiries API error:", e)
    return NextResponse.json(
      { ok: false, error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

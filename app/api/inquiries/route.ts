// app/api/inquiries/route.ts
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { isAuthenticated } from "@/lib/auth"
import { INQUIRY_STATUSES, isInquiryStatus, type InquiryStatus } from "@/lib/inquiries"

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

    // status 가 없으면 전체. 알 수 없는 값은 무시하지 않고 거절한다.
    const statusParam = searchParams.get("status")
    if (statusParam && !isInquiryStatus(statusParam)) {
      return NextResponse.json(
        { ok: false, error: "올바르지 않은 상태 값입니다." },
        { status: 400 },
      )
    }

    let listQuery = supabaseAdmin
      .from("contact_inquiries")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)
    if (statusParam) listQuery = listQuery.eq("status", statusParam)

    // 탭에 표시할 상태별 건수. 현재 필터와 무관하게 항상 전체 기준이다.
    const countQueries = INQUIRY_STATUSES.map((status) =>
      supabaseAdmin
        .from("contact_inquiries")
        .select("id", { count: "exact", head: true })
        .eq("status", status),
    )

    const [list, ...countResults] = await Promise.all([listQuery, ...countQueries])

    const failed = list.error ?? countResults.find((r) => r.error)?.error
    if (failed) {
      console.error("Supabase error:", failed)
      return NextResponse.json(
        { ok: false, error: "문의 조회에 실패했습니다." },
        { status: 500 },
      )
    }

    const counts = Object.fromEntries(
      INQUIRY_STATUSES.map((status, i) => [status, countResults[i].count ?? 0]),
    ) as Record<InquiryStatus, number>

    return NextResponse.json({
      ok: true,
      inquiries: list.data,
      total: list.count,
      counts,
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

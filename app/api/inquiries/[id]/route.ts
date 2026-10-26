// app/api/inquiries/[id]/route.ts
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { isAuthenticated } from "@/lib/auth"
import { isInquiryStatus } from "@/lib/inquiries"

const MAX_MEMO_LENGTH = 2000

// 문의 처리 상태 / 메모 수정 (관리자 전용)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { ok: false, error: "권한이 없습니다." },
        { status: 401 },
      )
    }

    const { id } = await params
    const body = (await req.json()) as { status?: unknown; memo?: unknown }

    const update: Record<string, unknown> = {}

    if (body.status !== undefined) {
      if (!isInquiryStatus(body.status)) {
        return NextResponse.json(
          { ok: false, error: "올바르지 않은 상태 값입니다." },
          { status: 400 },
        )
      }
      update.status = body.status
      // 완료 시각은 완료 상태일 때만 남긴다. 다시 열면 지운다.
      update.handled_at = body.status === "done" ? new Date().toISOString() : null
    }

    if (body.memo !== undefined) {
      if (body.memo !== null && typeof body.memo !== "string") {
        return NextResponse.json(
          { ok: false, error: "올바르지 않은 메모 값입니다." },
          { status: 400 },
        )
      }
      const memo = typeof body.memo === "string" ? body.memo.trim() : null
      if (memo && memo.length > MAX_MEMO_LENGTH) {
        return NextResponse.json(
          { ok: false, error: `메모는 ${MAX_MEMO_LENGTH}자 이하여야 합니다.` },
          { status: 400 },
        )
      }
      update.memo = memo || null
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { ok: false, error: "수정할 내용이 없습니다." },
        { status: 400 },
      )
    }

    const { data, error } = await supabaseAdmin
      .from("contact_inquiries")
      .update(update)
      .eq("id", id)
      .select("*")
      .maybeSingle()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { ok: false, error: "문의 수정에 실패했습니다." },
        { status: 500 },
      )
    }

    if (!data) {
      return NextResponse.json(
        { ok: false, error: "문의를 찾을 수 없습니다." },
        { status: 404 },
      )
    }

    return NextResponse.json({ ok: true, inquiry: data })
  } catch (e) {
    console.error("Inquiry PATCH API error:", e)
    return NextResponse.json(
      { ok: false, error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

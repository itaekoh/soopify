// app/api/posts/[id]/route.ts
import { NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/supabase"
import { isAuthenticated } from "@/lib/auth"

// 게시글 상세 조회
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { ok: false, error: "게시글을 찾을 수 없습니다." },
        { status: 404 },
      )
    }

    return NextResponse.json({ ok: true, post: data })
  } catch (e) {
    console.error("Post API error:", e)
    return NextResponse.json(
      { ok: false, error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

// 게시글 수정 (관리자 전용)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 관리자 인증 확인
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { ok: false, error: "권한이 없습니다." },
        { status: 401 },
      )
    }

    const { id } = await params
    const body = await req.json()
    const { title, content, attachments } = body as {
      title?: string
      content?: string
      attachments?: any[]
    }

    if (!title || !content) {
      return NextResponse.json(
        { ok: false, error: "필수 항목이 누락되었습니다." },
        { status: 400 },
      )
    }

    // supabaseAdmin 사용 (RLS 우회)
    const { data, error } = await supabaseAdmin
      .from("posts")
      .update({
        title,
        content,
        attachments: attachments || [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { ok: false, error: "게시글 수정에 실패했습니다." },
        { status: 500 },
      )
    }

    return NextResponse.json({ ok: true, post: data })
  } catch (e) {
    console.error("Post API error:", e)
    return NextResponse.json(
      { ok: false, error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

// 게시글 삭제 (관리자 전용)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 관리자 인증 확인
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { ok: false, error: "권한이 없습니다." },
        { status: 401 },
      )
    }

    const { id } = await params
    // supabaseAdmin 사용 (RLS 우회)
    const { error } = await supabaseAdmin
      .from("posts")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { ok: false, error: "게시글 삭제에 실패했습니다." },
        { status: 500 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Post API error:", e)
    return NextResponse.json(
      { ok: false, error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

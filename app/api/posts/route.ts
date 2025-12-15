// app/api/posts/route.ts
import { NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/supabase"
import { isAuthenticated } from "@/lib/auth"

// 게시글 목록 조회
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
      .from("posts")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { ok: false, error: "게시글 조회에 실패했습니다." },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        ok: true,
        posts: data,
        total: count,
        page,
        limit,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      },
    )
  } catch (e) {
    console.error("Posts API error:", e)
    return NextResponse.json(
      { ok: false, error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

// 게시글 작성 (관리자 전용)
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

    const body = await req.json()
    const { title, content, author, attachments } = body as {
      title?: string
      content?: string
      author?: string
      attachments?: any[]
    }

    if (!title || !content || !author) {
      return NextResponse.json(
        { ok: false, error: "필수 항목이 누락되었습니다." },
        { status: 400 },
      )
    }

    // supabaseAdmin 사용 (RLS 우회)
    const { data, error } = await supabaseAdmin
      .from("posts")
      .insert({
        title,
        content,
        author,
        attachments: attachments || [],
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { ok: false, error: "게시글 작성에 실패했습니다." },
        { status: 500 },
      )
    }

    return NextResponse.json({ ok: true, post: data })
  } catch (e) {
    console.error("Posts API error:", e)
    return NextResponse.json(
      { ok: false, error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

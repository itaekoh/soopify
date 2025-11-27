// app/api/auth/logout/route.ts
import { NextResponse } from "next/server"
import { clearAuthCookie } from "@/lib/auth"

export async function POST() {
  try {
    await clearAuthCookie()
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Logout API error:", e)
    return NextResponse.json(
      { ok: false, error: "로그아웃 처리 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

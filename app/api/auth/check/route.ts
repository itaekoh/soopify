// app/api/auth/check/route.ts
import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"

export async function GET() {
  try {
    const authenticated = await isAuthenticated()
    return NextResponse.json({ ok: true, authenticated })
  } catch (e) {
    console.error("Auth check error:", e)
    return NextResponse.json(
      { ok: false, error: "인증 확인 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

// app/api/auth/check/route.ts
import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"

export async function GET() {
  try {
    const authenticated = await isAuthenticated()
    return NextResponse.json(
      { ok: true, authenticated },
      {
        headers: {
          // 캐시하면 안 된다. private, max-age=300 이던 시절에는
          // /admin/login 진입 때 캐시된 authenticated:false 가 로그인 직후
          // /admin 의 확인 요청에 그대로 재사용돼서 5분 동안 로그인 화면으로
          // 되튕기는 루프가 생겼다.
          "Cache-Control": "no-store, must-revalidate",
        },
      },
    )
  } catch (e) {
    console.error("Auth check error:", e)
    return NextResponse.json(
      { ok: false, error: "인증 확인 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

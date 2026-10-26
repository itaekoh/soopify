// app/api/auth/check/route.ts
import { NextResponse } from "next/server"
import { isAuthenticated, adminSessionInfo } from "@/lib/auth"

export async function GET() {
  try {
    // 서로 의존하지 않으므로 함께 조회한다. 인증이 안 됐으면 결과는 버린다.
    const [authenticated, info] = await Promise.all([isAuthenticated(), adminSessionInfo()])

    return NextResponse.json(
      {
        ok: true,
        authenticated,
        // 관리자 화면 헤더에 표시할 정보. 로그인한 경우에만 내려준다.
        email: authenticated ? info.email : null,
        canChangePassword: authenticated ? info.canChangePassword : false,
      },
      {
        headers: {
          // 캐시하면 안 된다. private, max-age=300 이던 시절에는
          // /admin/login 진입 때 캐시된 authenticated:false 가 로그인 직후
          // 확인 요청에 그대로 재사용돼서 5분 동안 로그인 화면으로 되튕기는
          // 루프가 생겼다.
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

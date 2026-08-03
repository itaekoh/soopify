// app/api/auth/password/route.ts
//
// 관리자 계정 변경(이메일 / 비밀번호). 경로 이름은 password 로 남겨뒀지만
// 이메일도 함께 바꿀 수 있다.
import { NextResponse } from "next/server"
import { isAuthenticated, updateAdminCredentials, clearAuthCookie, setAuthCookie } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ ok: false, error: "권한이 없습니다." }, { status: 401 })
    }

    const { currentPassword, newEmail, newPassword } = (await req.json()) as {
      currentPassword?: string
      newEmail?: string
      newPassword?: string
    }

    if (!currentPassword) {
      return NextResponse.json(
        { ok: false, error: "현재 비밀번호를 입력해주세요." },
        { status: 400 },
      )
    }
    if (!newEmail && !newPassword) {
      return NextResponse.json(
        { ok: false, error: "변경할 이메일 또는 비밀번호를 입력해주세요." },
        { status: 400 },
      )
    }

    const failure = await updateAdminCredentials({ currentPassword, newEmail, newPassword })
    if (failure) {
      return NextResponse.json({ ok: false, error: failure }, { status: 400 })
    }

    // 계정이 바뀌었으니 세션도 새로 발급한다.
    await clearAuthCookie()
    await setAuthCookie()

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Admin credentials update error:", e)
    return NextResponse.json(
      { ok: false, error: "계정 변경 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

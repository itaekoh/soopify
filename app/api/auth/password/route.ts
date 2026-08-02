// app/api/auth/password/route.ts
import { NextResponse } from "next/server"
import { isAuthenticated, changeAdminPassword, clearAuthCookie, setAuthCookie } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ ok: false, error: "권한이 없습니다." }, { status: 401 })
    }

    const { currentPassword, newPassword } = (await req.json()) as {
      currentPassword?: string
      newPassword?: string
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { ok: false, error: "현재 비밀번호와 새 비밀번호를 모두 입력해주세요." },
        { status: 400 },
      )
    }

    const failure = await changeAdminPassword(currentPassword, newPassword)
    if (failure) {
      return NextResponse.json({ ok: false, error: failure }, { status: 400 })
    }

    // 비밀번호를 바꿨으니 세션도 새로 발급한다.
    await clearAuthCookie()
    await setAuthCookie()

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Password change error:", e)
    return NextResponse.json(
      { ok: false, error: "비밀번호 변경 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

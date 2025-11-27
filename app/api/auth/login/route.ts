// app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import { verifyAdmin, setAuthCookie } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body as {
      email?: string
      password?: string
    }

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 },
      )
    }

    const isValid = await verifyAdmin(email, password)

    if (!isValid) {
      return NextResponse.json(
        { ok: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 },
      )
    }

    await setAuthCookie()

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Login API error:", e)
    return NextResponse.json(
      { ok: false, error: "로그인 처리 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

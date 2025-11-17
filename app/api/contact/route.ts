// app/api/contact/route.ts
import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, contact, org, message } = body as {
      name?: string
      contact?: string
      org?: string
      message?: string
    }

    if (!name || !contact || !message) {
      return NextResponse.json(
        { ok: false, error: "필수 항목이 누락되었습니다." },
        { status: 400 },
      )
    }

    const to = process.env.CONTACT_TO_EMAIL
    const from = process.env.CONTACT_FROM_EMAIL

    if (!to || !from) {
      console.error("CONTACT_TO_EMAIL 또는 CONTACT_FROM_EMAIL 환경변수가 없습니다.")
      return NextResponse.json(
        { ok: false, error: "서버 설정이 완료되지 않았습니다." },
        { status: 500 },
      )
    }

    const subject = `[Soopify 상담요청] ${name}님 문의`

    const html = `
      <h2>Soopify 상담 요청</h2>
      <p><strong>담당자 성함:</strong> ${name}</p>
      <p><strong>이메일 / 연락처:</strong> ${contact}</p>
      <p><strong>기관 / 회사 / 학교명:</strong> ${org || "-"}</p>
      <p><strong>문의 내용:</strong></p>
      <p style="white-space: pre-line;">${message}</p>
      <hr />
      <p>본 메일은 soopify.vercel.app 상담 요청 폼에서 자동 발송되었습니다.</p>
    `

    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        { ok: false, error: "메일 전송에 실패했습니다." },
        { status: 500 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Contact API error:", e)
    return NextResponse.json(
      { ok: false, error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

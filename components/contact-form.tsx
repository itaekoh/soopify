// components/contact-form.tsx
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function ContactForm() {
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [org, setOrg] = useState("")
  const [message, setMessage] = useState("")

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccess(null)
    setError(null)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          contact,
          org,
          message,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "전송에 실패했습니다.")
      }

      setSuccess("문의가 정상적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.")
      setName("")
      setContact("")
      setOrg("")
      setMessage("")
    } catch (err: any) {
      setError(err.message ?? "요청 처리 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4 text-[15px]">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[12px] font-semibold text-muted-foreground mb-1">
              담당자 성함
            </label>
            <Input
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-muted-foreground mb-1">
              이메일 또는 연락처
            </label>
            <Input
              placeholder="example@company.kr / 010-0000-0000"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-muted-foreground mb-1">
              기관 / 회사 / 학교명
            </label>
            <Input
              placeholder="○○나무병원 / ○○조경 / ○○초등학교 등"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-muted-foreground mb-1">
              문의 내용
            </label>
            <Textarea
              rows={4}
              placeholder="문의 내용을 적어주세요."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-full py-2.5"
            disabled={loading}
          >
            {loading ? "전송 중..." : "문의 보내기"}
          </Button>

          {success && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              {success}
            </p>
          )}
          {error && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

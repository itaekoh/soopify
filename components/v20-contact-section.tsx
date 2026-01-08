// components/v20-contact-section.tsx
"use client"

import { useState, useRef } from "react"

export function V20ContactSection() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      contact: formData.get('contact') as string,
      org: formData.get('org') as string | null,
      message: formData.get('message') as string,
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok || !result.ok) {
        throw new Error(result.error || '전송에 실패했습니다.')
      }

      setMessage({ type: 'success', text: '문의가 정상적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.' })

      // Reset form using ref
      if (formRef.current) {
        formRef.current.reset()
      }

      // Track with Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'form_submit', {
          'event_category': 'Contact',
          'event_label': 'Contact Form'
        })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || '요청 처리 중 오류가 발생했습니다.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16" id="contact">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl bg-slate-950 p-10 text-white dark:bg-white dark:text-slate-950">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                "진단 이후"를 함께 설계할 파트너를 찾습니다.
              </h2>
              <p className="mt-4 text-lg opacity-90">
                서비스 문의, 공동 프로젝트, 협업(파트너십) 모두 환영합니다.
              </p>
            </div>

            <form ref={formRef} className="grid grid-cols-1 gap-3" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input
                  className="w-full rounded-2xl bg-white/10 px-4 py-4 text-sm text-white placeholder-white/60 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white/40 dark:bg-slate-950 dark:text-white dark:placeholder-white/50 dark:ring-slate-800"
                  name="name"
                  placeholder="담당자 성함"
                  type="text"
                  required
                />
                <input
                  className="w-full rounded-2xl bg-white/10 px-4 py-4 text-sm text-white placeholder-white/60 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white/40 dark:bg-slate-950 dark:text-white dark:placeholder-white/50 dark:ring-slate-800"
                  name="contact"
                  placeholder="이메일 또는 연락처"
                  type="text"
                  required
                />
              </div>
              <input
                className="w-full rounded-2xl bg-white/10 px-4 py-4 text-sm text-white placeholder-white/60 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white/40 dark:bg-slate-950 dark:text-white dark:placeholder-white/50 dark:ring-slate-800"
                name="org"
                placeholder="기관 / 회사 / 학교명 (선택)"
                type="text"
              />
              <textarea
                className="w-full rounded-2xl bg-white/10 px-4 py-4 text-sm text-white placeholder-white/60 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white/40 dark:bg-slate-950 dark:text-white dark:placeholder-white/50 dark:ring-slate-800"
                name="message"
                placeholder="문의 내용"
                rows={5}
                required
              />
              <button
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-slate-950 hover:bg-slate-100 disabled:opacity-50 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
                type="submit"
                disabled={loading}
              >
                {loading ? '전송 중...' : '문의 보내기'}
              </button>
              {message && (
                <div className={`text-sm ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {message.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

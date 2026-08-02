// components/admin/admin-login-panel.tsx
"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import { useAdminModal } from "@/components/admin/admin-modal-provider"

/** 모달 안에서 쓰는 로그인 폼. 인증되지 않은 상태에서 톱니바퀴를 누르면 이게 뜬다. */
export function AdminLoginPanel() {
  const { refresh } = useAdminModal()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || "로그인에 실패했습니다.")

      setPassword("")
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </span>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">관리자 로그인</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              관리자 계정으로 로그인하면 관리 메뉴가 열립니다.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="admin-email" className="mb-1 block text-sm font-semibold">
              이메일
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1 block text-sm font-semibold">
              비밀번호
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "확인 중..." : "로그인"}
        </button>
      </form>
    </div>
  )
}

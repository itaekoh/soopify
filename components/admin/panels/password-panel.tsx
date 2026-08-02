// components/admin/panels/password-panel.tsx
"use client"

import { useState } from "react"
import { PanelHeader } from "@/components/admin/panel-chrome"
import { useAdminModal } from "@/components/admin/admin-modal-provider"

const MIN_LENGTH = 10

export function PasswordPanel() {
  const { session } = useAdminModal()
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  if (!session.canChangePassword) {
    return (
      <div>
        <PanelHeader title="비밀번호 변경" />
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6">
          <p className="text-sm font-semibold">아직 사용할 수 없습니다</p>
          <p className="mt-2 text-sm text-muted-foreground">
            비밀번호가 <code className="rounded bg-muted px-1 py-0.5">ADMIN_PASSWORD</code>{" "}
            환경변수에 있어서 런타임에 바꿀 수 없습니다. 저장용 테이블을 한 번 만들어야 합니다.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Supabase 대시보드 &gt; SQL Editor 에서{" "}
            <code className="rounded bg-muted px-1 py-0.5">
              supabase/migrations/add_admin_credentials.sql
            </code>{" "}
            을 실행한 뒤 다시 열어주세요. 그 전까지 로그인은 지금처럼 계속 동작합니다.
          </p>
        </div>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (next !== confirm) {
      setError("새 비밀번호가 서로 다릅니다.")
      return
    }
    if (next.length < MIN_LENGTH) {
      setError(`새 비밀번호는 ${MIN_LENGTH}자 이상이어야 합니다.`)
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || "비밀번호 변경에 실패했습니다.")

      setCurrent("")
      setNext("")
      setConfirm("")
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "비밀번호 변경에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PanelHeader
        title="비밀번호 변경"
        description={session.email ? `${session.email} 계정의 비밀번호를 변경합니다.` : undefined}
      />

      <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
        <Field
          id="pw-current"
          label="현재 비밀번호"
          autoComplete="current-password"
          value={current}
          onChange={setCurrent}
        />
        <Field
          id="pw-next"
          label={`새 비밀번호 (${MIN_LENGTH}자 이상)`}
          autoComplete="new-password"
          value={next}
          onChange={setNext}
        />
        <Field
          id="pw-confirm"
          label="새 비밀번호 확인"
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
        />

        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}
        {done && (
          <p className="rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary">
            비밀번호를 변경했습니다. 다음 로그인부터 새 비밀번호를 사용하세요.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "변경 중..." : "비밀번호 변경"}
        </button>
      </form>
    </div>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  autoComplete,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  autoComplete: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        type="password"
        required
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  )
}

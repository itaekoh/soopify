// components/admin/panels/password-panel.tsx
"use client"

import { useState } from "react"
import { PanelHeader } from "@/components/admin/panel-chrome"
import { useAdminModal } from "@/components/admin/admin-modal-provider"

const MIN_LENGTH = 10

/**
 * 관리자 계정(이메일 + 비밀번호) 변경.
 *
 * 계정은 admin_credentials 테이블에 저장된다. 예전에는 이메일이 환경변수,
 * 비밀번호가 DB 에 있어서 두 곳으로 쪼개져 있었다.
 */
export function PasswordPanel() {
  const { session, refresh } = useAdminModal()
  const [current, setCurrent] = useState("")
  const [email, setEmail] = useState(session.email ?? "")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  if (!session.canChangePassword) {
    return (
      <div>
        <PanelHeader title="계정 관리" />
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6">
          <p className="text-sm font-semibold">아직 사용할 수 없습니다</p>
          <p className="mt-2 text-sm text-muted-foreground">
            계정 저장소가 준비되지 않았습니다. Supabase 대시보드 &gt; SQL Editor 에서{" "}
            <code className="rounded bg-muted px-1 py-0.5">
              supabase/migrations/add_admin_credentials.sql
            </code>{" "}
            을 실행한 뒤 다시 열어주세요.
          </p>
        </div>
      </div>
    )
  }

  const emailChanged = email.trim() !== "" && email.trim() !== (session.email ?? "")
  const passwordChanged = next !== ""

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setDone(null)

    if (!emailChanged && !passwordChanged) {
      setError("변경할 이메일 또는 비밀번호를 입력해주세요.")
      return
    }
    if (passwordChanged && next !== confirm) {
      setError("새 비밀번호가 서로 다릅니다.")
      return
    }
    if (passwordChanged && next.length < MIN_LENGTH) {
      setError(`새 비밀번호는 ${MIN_LENGTH}자 이상이어야 합니다.`)
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: current,
          ...(emailChanged ? { newEmail: email.trim() } : {}),
          ...(passwordChanged ? { newPassword: next } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || "계정 변경에 실패했습니다.")

      const changed = [emailChanged && "이메일", passwordChanged && "비밀번호"]
        .filter(Boolean)
        .join("과 ")
      setCurrent("")
      setNext("")
      setConfirm("")
      setDone(`${changed}를 변경했습니다. 다음 로그인부터 새 정보를 사용하세요.`)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "계정 변경에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PanelHeader
        title="계정 관리"
        description="관리자 이메일과 비밀번호를 변경합니다. 바꾸려는 항목만 채우면 됩니다."
      />

      <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
        <Field
          id="acct-email"
          label="이메일"
          type="email"
          autoComplete="username"
          value={email}
          onChange={setEmail}
          required
        />

        <div className="border-t pt-4">
          <Field
            id="acct-next"
            label={`새 비밀번호 (${MIN_LENGTH}자 이상, 안 바꾸면 비워두세요)`}
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={setNext}
          />
          {passwordChanged && (
            <div className="mt-4">
              <Field
                id="acct-confirm"
                label="새 비밀번호 확인"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={setConfirm}
                required
              />
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <Field
            id="acct-current"
            label="현재 비밀번호 (확인용)"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={setCurrent}
            required
          />
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">잊으면 초기화해야 합니다.</span> 계정은
          DB 에만 저장되고 되돌려 볼 수 없습니다. Supabase SQL Editor 에서{" "}
          <code className="rounded bg-muted px-1 py-0.5">
            delete from admin_credentials where id = 1;
          </code>{" "}
          을 실행하면 <code className="rounded bg-muted px-1 py-0.5">ADMIN_EMAIL</code> /{" "}
          <code className="rounded bg-muted px-1 py-0.5">ADMIN_PASSWORD</code> 환경변수 값으로
          다시 심어집니다.
        </div>

        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}
        {done && <p className="rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary">{done}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "변경 중..." : "저장"}
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
  type,
  required,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  autoComplete: string
  type: "text" | "email" | "password"
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  )
}

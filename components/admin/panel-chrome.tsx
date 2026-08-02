// components/admin/panel-chrome.tsx
"use client"

import type { ReactNode } from "react"

/** 관리자 패널들이 공유하는 제목 / 로딩 / 빈 상태 / 오류 표시. */

export function PanelHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function PanelLoading({ message = "불러오는 중..." }: { message?: string }) {
  return <p className="py-16 text-center text-sm text-muted-foreground">{message}</p>
}

export function PanelEmpty({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed p-12 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

export function PanelError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
      <p className="text-sm text-destructive">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-xl border px-3 py-1.5 text-sm font-semibold transition hover:bg-accent"
        >
          다시 시도
        </button>
      )}
    </div>
  )
}

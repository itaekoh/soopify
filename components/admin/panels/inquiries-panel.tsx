// components/admin/panels/inquiries-panel.tsx
"use client"

import { useCallback, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Building, MessageSquare, Calendar, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
import { PanelHeader, PanelEmpty, PanelError, PanelLoading } from "@/components/admin/panel-chrome"
import { INQUIRY_STATUSES, INQUIRY_STATUS_LABEL, type InquiryStatus } from "@/lib/inquiries"
import { cn } from "@/lib/utils"

type Inquiry = {
  id: string
  name: string
  contact: string
  org: string | null
  message: string
  created_at: string
  status: InquiryStatus
  memo: string | null
  handled_at: string | null
}

type Counts = Record<InquiryStatus, number>

type Filter = InquiryStatus | "all"

const LIMIT = 20

const EMPTY_MESSAGE: Record<Filter, string> = {
  all: "아직 접수된 문의가 없습니다.",
  new: "새로 들어온 문의가 없습니다.",
  in_progress: "처리 중인 문의가 없습니다.",
  done: "완료된 문의가 없습니다.",
}

const STATUS_BADGE_CLASS: Record<InquiryStatus, string> = {
  new: "border-transparent bg-primary text-primary-foreground",
  in_progress: "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400",
  done: "border-transparent bg-muted text-muted-foreground",
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function InquiriesPanel() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [counts, setCounts] = useState<Counts | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>("new")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  // silent: 상태 변경 직후 목록을 다시 받을 때 로딩 화면으로 깜빡이지 않게 한다.
  const fetchInquiries = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) })
        if (filter !== "all") params.set("status", filter)
        const res = await fetch(`/api/inquiries?${params}`, { cache: "no-store" })
        const data = await res.json()
        if (!res.ok || !data.ok) throw new Error(data.error || "문의 조회에 실패했습니다.")
        setInquiries(data.inquiries)
        setTotal(data.total)
        setCounts(data.counts)
      } catch (err) {
        setError(err instanceof Error ? err.message : "문의 조회에 실패했습니다.")
      } finally {
        setLoading(false)
      }
    },
    [page, filter],
  )

  useEffect(() => {
    fetchInquiries()
  }, [fetchInquiries])

  const changeFilter = (next: Filter) => {
    setFilter(next)
    setPage(1)
  }

  const totalPages = Math.ceil(total / LIMIT)
  const allCount = counts ? INQUIRY_STATUSES.reduce((sum, s) => sum + counts[s], 0) : 0

  const tabs: { id: Filter; label: string; count: number | null }[] = [
    { id: "all", label: "전체", count: counts ? allCount : null },
    ...INQUIRY_STATUSES.map((s) => ({
      id: s as Filter,
      label: INQUIRY_STATUS_LABEL[s],
      count: counts ? counts[s] : null,
    })),
  ]

  return (
    <div>
      <PanelHeader
        title="문의 관리"
        description={
          counts && counts.new > 0 ? (
            <>
              처리하지 않은 신규 문의가 <Badge variant="default">{counts.new}</Badge>건 있습니다.
            </>
          ) : (
            "접수된 문의를 확인하고 처리 상태를 관리합니다."
          )
        }
      />

      <div role="tablist" aria-label="문의 상태" className="mb-5 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={filter === tab.id}
            onClick={() => changeFilter(tab.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-semibold transition",
              filter === tab.id ? "border-transparent bg-primary text-primary-foreground" : "hover:bg-accent",
            )}
          >
            {tab.label}
            {tab.count !== null && <span className="tabular-nums opacity-70">{tab.count}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <PanelLoading />
      ) : error ? (
        <PanelError message={error} onRetry={() => fetchInquiries()} />
      ) : inquiries.length === 0 ? (
        <PanelEmpty message={EMPTY_MESSAGE[filter]} />
      ) : (
        <>
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <InquiryCard key={inquiry.id} inquiry={inquiry} onChanged={() => fetchInquiries(true)} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm font-semibold transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </button>
              <span className="px-2 text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm font-semibold transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                다음
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function InquiryCard({ inquiry, onChanged }: { inquiry: Inquiry; onChanged: () => void }) {
  const [memo, setMemo] = useState(inquiry.memo ?? "")
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const memoDirty = memo.trim() !== (inquiry.memo ?? "")

  async function update(body: { status?: InquiryStatus; memo?: string }) {
    setBusy(true)
    setActionError(null)
    try {
      const res = await fetch(`/api/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || "저장에 실패했습니다.")
      onChanged()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "저장에 실패했습니다.")
    } finally {
      setBusy(false)
    }
  }

  const buttonClass =
    "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-semibold transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"

  return (
    <article className="rounded-2xl border bg-card p-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold">{inquiry.name}</h3>
          <Badge className={STATUS_BADGE_CLASS[inquiry.status]}>{INQUIRY_STATUS_LABEL[inquiry.status]}</Badge>
          {inquiry.org && (
            <Badge variant="outline" className="text-xs">
              <Building className="mr-1 h-3 w-3" />
              {inquiry.org}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4 shrink-0" />
          <span className="break-all">{inquiry.contact}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Calendar className="h-3 w-3 shrink-0" />
            {formatDate(inquiry.created_at)}
          </span>
          {inquiry.handled_at && (
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 shrink-0" />
              {formatDate(inquiry.handled_at)} 완료
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-muted/50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-semibold">문의 내용</p>
        </div>
        <p className="whitespace-pre-wrap break-words pl-6 text-sm leading-relaxed text-muted-foreground">
          {inquiry.message}
        </p>
      </div>

      <div className="mt-4">
        <label htmlFor={`memo-${inquiry.id}`} className="mb-1.5 block text-sm font-semibold">
          내부 메모
        </label>
        <Textarea
          id={`memo-${inquiry.id}`}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          maxLength={2000}
          rows={2}
          placeholder="처리 내용, 회신 일정 등 (방문자에게는 보이지 않습니다)"
        />
        {memoDirty && (
          <button onClick={() => update({ memo })} disabled={busy} className={cn(buttonClass, "mt-2")}>
            메모 저장
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
        {inquiry.status === "new" && (
          <button onClick={() => update({ status: "in_progress" })} disabled={busy} className={buttonClass}>
            처리 시작
          </button>
        )}
        {inquiry.status !== "done" && (
          <button
            onClick={() => update({ status: "done" })}
            disabled={busy}
            className={cn(buttonClass, "border-transparent bg-primary text-primary-foreground hover:bg-primary/90")}
          >
            <CheckCircle2 className="h-4 w-4" />
            완료 처리
          </button>
        )}
        {inquiry.status === "done" && (
          <button onClick={() => update({ status: "in_progress" })} disabled={busy} className={buttonClass}>
            다시 열기
          </button>
        )}
        {actionError && <p className="text-sm text-destructive">{actionError}</p>}
      </div>
    </article>
  )
}

// components/admin/panels/inquiries-panel.tsx
"use client"

import { useCallback, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Mail, Building, MessageSquare, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { PanelHeader, PanelEmpty, PanelError, PanelLoading } from "@/components/admin/panel-chrome"

type Inquiry = {
  id: string
  name: string
  contact: string
  org: string | null
  message: string
  created_at: string
}

const LIMIT = 20

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchInquiries = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/inquiries?page=${page}&limit=${LIMIT}`, { cache: "no-store" })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || "문의 조회에 실패했습니다.")
      setInquiries(data.inquiries)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "문의 조회에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchInquiries()
  }, [fetchInquiries])

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div>
      <PanelHeader
        title="문의 관리"
        description={
          <>
            총 <Badge variant="secondary">{total}</Badge>건의 문의가 접수되었습니다.
          </>
        }
      />

      {loading ? (
        <PanelLoading />
      ) : error ? (
        <PanelError message={error} onRetry={fetchInquiries} />
      ) : inquiries.length === 0 ? (
        <PanelEmpty message="아직 접수된 문의가 없습니다." />
      ) : (
        <>
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <article key={inquiry.id} className="rounded-2xl border bg-card p-5">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold">{inquiry.name}</h3>
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
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 shrink-0" />
                    {formatDate(inquiry.created_at)}
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
              </article>
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

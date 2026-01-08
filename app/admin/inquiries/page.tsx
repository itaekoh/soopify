// app/admin/inquiries/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { V20ClientScripts } from "@/components/v20-client-scripts"
import { Badge } from "@/components/ui/badge"
import { Mail, Building, MessageSquare, Calendar, ChevronLeft, ChevronRight } from "lucide-react"

type Inquiry = {
  id: string
  name: string
  contact: string
  org: string | null
  message: string
  created_at: string
}

export default function InquiriesPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const limit = 20

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (authenticated) {
      fetchInquiries()
    }
  }, [authenticated, page])

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/check")
      const data = await res.json()

      if (!data.authenticated) {
        router.push("/admin/login")
        return
      }

      setAuthenticated(true)
    } catch (err) {
      router.push("/admin/login")
    } finally {
      setChecking(false)
    }
  }

  async function fetchInquiries() {
    try {
      setLoading(true)
      const res = await fetch(`/api/inquiries?page=${page}&limit=${limit}`)
      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "문의 조회에 실패했습니다.")
      }

      setInquiries(data.inquiries)
      setTotal(data.total)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (checking) {
    return (
      <div className="bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50">
        <V20ClientScripts />
        <AdminHeader />
        <main className="min-h-screen">
          <div className="max-w-6xl mx-auto px-4 py-20">
            <p className="text-center text-slate-600 dark:text-slate-300">인증 확인 중...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <V20ClientScripts />
      <AdminHeader />
      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
          <div className="mb-12">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">상담 문의 관리</h1>
            <p className="text-lg text-slate-700 dark:text-slate-200 mt-4">
              총 <Badge variant="secondary">{total}</Badge>건의 문의가 있습니다.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-300">로딩 중...</p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center dark:border-red-900 dark:bg-red-950/20">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-950">
              <p className="text-slate-600 dark:text-slate-300 mb-4">문의가 없습니다.</p>
              <Badge variant="outline">아직 접수된 문의가 없습니다.</Badge>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <article key={inquiry.id} className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700">
                    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{inquiry.name}</h3>
                          {inquiry.org && (
                            <Badge variant="outline" className="text-xs">
                              <Building className="h-3 w-3 mr-1" />
                              {inquiry.org}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <Mail className="h-4 w-4" />
                          {inquiry.contact}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="h-3 w-3" />
                          {formatDate(inquiry.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
                      <div className="flex items-start gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-slate-500 dark:text-slate-400 mt-0.5" />
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">문의 내용</p>
                      </div>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed text-slate-600 dark:text-slate-300 pl-6">
                        {inquiry.message}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    이전
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold transition ${
                            pageNum === page
                              ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                  >
                    다음
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

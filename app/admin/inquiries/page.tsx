// app/admin/inquiries/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

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
      <>
        <SiteHeader />
        <main className="min-h-screen bg-background">
          <div className="max-w-5xl mx-auto px-4 py-14">
            <p className="text-center text-muted-foreground">인증 확인 중...</p>
          </div>
        </main>
      </>
    )
  }

  if (!authenticated) {
    return null
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-14 md:py-16">
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                대시보드로
              </Link>
            </Button>
          </div>

          <header className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold">상담 문의 관리</h1>
            <p className="text-muted-foreground text-[15px]">
              총 {total}건의 문의가 있습니다.
            </p>
          </header>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">로딩 중...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">문의가 없습니다.</p>
              <Badge variant="outline">아직 접수된 문의가 없습니다.</Badge>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <Card key={inquiry.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {inquiry.name}
                            {inquiry.org && (
                              <span className="text-sm font-normal text-muted-foreground ml-2">
                                ({inquiry.org})
                              </span>
                            )}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {inquiry.contact}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {formatDate(inquiry.created_at)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted p-4 rounded-md">
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {inquiry.message}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    이전
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === page ? "default" : "outline"}
                          onClick={() => setPage(pageNum)}
                          className="w-10"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    다음
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}

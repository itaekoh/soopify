// app/admin/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, FileText, MessageSquare, PlusCircle } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

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

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (err) {
      console.error("Logout error:", err)
    }
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

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-14 md:py-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">관리자 대시보드</h1>
              <p className="text-muted-foreground text-[15px] mt-2">
                Soopify 관리 페이지
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 상담 문의 관리 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  상담 문의 관리
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  사용자가 제출한 상담 문의를 확인하고 관리합니다.
                </p>
                <Button asChild className="w-full">
                  <Link href="/admin/inquiries">문의 내역 보기</Link>
                </Button>
              </CardContent>
            </Card>

            {/* 공지사항 관리 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  공지사항 관리
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  공지사항을 작성, 수정, 삭제할 수 있습니다.
                </p>
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href="/board">
                      <FileText className="h-4 w-4 mr-2" />
                      목록 보기
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/board/new">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      새 공지 작성
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 빠른 링크 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">빠른 링크</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/">메인 페이지</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/board">공지사항</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/inquiries">문의 내역</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}

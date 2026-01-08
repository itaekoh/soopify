// app/admin/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AdminHeader } from "@/components/admin-header"
import { V20ClientScripts } from "@/components/v20-client-scripts"
import { FileText, MessageSquare, PlusCircle, Lightbulb, ArrowRight } from "lucide-react"

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

  return (
    <div className="bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <V20ClientScripts />
      <AdminHeader />
      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
          <div className="mb-12">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">관리자 대시보드</h1>
            <p className="text-lg text-slate-700 dark:text-slate-200 mt-4">
              Soopify 서비스를 관리합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 상담 문의 관리 */}
            <article className="group rounded-3xl border border-slate-200 bg-white p-8 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
                  <MessageSquare className="h-6 w-6 text-slate-950 dark:text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">상담 문의 관리</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                사용자가 제출한 상담 문의를 확인하고 관리합니다.
              </p>
              <Link
                href="/admin/inquiries"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white group-hover:gap-3 transition-all"
              >
                문의 내역 보기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>

            {/* 공지사항 관리 */}
            <article className="group rounded-3xl border border-slate-200 bg-white p-8 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
                  <FileText className="h-6 w-6 text-slate-950 dark:text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">공지사항 관리</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                공지사항을 작성, 수정, 삭제할 수 있습니다.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/board"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white group-hover:gap-3 transition-all"
                >
                  목록 보기
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/board/new"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300"
                >
                  <PlusCircle className="h-4 w-4" />
                  새 공지 작성
                </Link>
              </div>
            </article>

            {/* Insights 관리 */}
            <article className="group rounded-3xl border border-slate-200 bg-white p-8 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
                  <Lightbulb className="h-6 w-6 text-slate-950 dark:text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Insights 관리</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                Soopnote 블로그 글을 메인 페이지에 노출합니다.
              </p>
              <Link
                href="/admin/insights"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white group-hover:gap-3 transition-all"
              >
                Featured 글 관리
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </div>
        </div>
      </main>
    </div>
  )
}

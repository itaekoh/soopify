// components/admin-header.tsx
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { V20ThemeToggle } from "./v20-theme-toggle"

type AdminHeaderProps = {
  onLogout?: () => void
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  const router = useRouter()

  async function handleLogout() {
    if (onLogout) {
      onLogout()
    } else {
      try {
        await fetch("/api/auth/logout", { method: "POST" })
        router.push("/")
      } catch (err) {
        console.error("Logout error:", err)
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            S
          </span>
          <div className="leading-tight">
            <div className="text-base font-semibold tracking-tight">Soopify Admin</div>
            <div className="text-xs text-slate-600 dark:text-slate-300">관리자 페이지</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/admin"
            className="text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
          >
            대시보드
          </Link>
          <Link
            href="/admin/inquiries"
            className="text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
          >
            문의 관리
          </Link>
          <Link
            href="/admin/insights"
            className="text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
          >
            Insights
          </Link>
          <Link
            href="/board"
            className="text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
          >
            공지사항
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
          >
            메인 페이지
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <V20ThemeToggle />
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </div>
    </header>
  )
}

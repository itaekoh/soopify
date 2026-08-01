// components/admin-header.tsx
"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { AppHeader, type NavItem } from "@/components/app-header"

const NAV: NavItem[] = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/inquiries", label: "문의 관리" },
  { href: "/admin/insights", label: "Insights" },
  { href: "/board", label: "공지사항" },
  { href: "/", label: "메인 페이지" },
]

type AdminHeaderProps = {
  onLogout?: () => void
}

/** 관리자 페이지(/admin/*) 헤더. */
export function AdminHeader({ onLogout }: AdminHeaderProps) {
  const router = useRouter()

  async function handleLogout() {
    if (onLogout) {
      onLogout()
      return
    }
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  return (
    <AppHeader
      homeHref="/admin"
      homeLabel="Soopify 관리자 페이지"
      badge="관리자 페이지"
      nav={NAV}
      actions={
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">로그아웃</span>
        </button>
      }
    />
  )
}

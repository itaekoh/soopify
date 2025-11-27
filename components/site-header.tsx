"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

const navItems = [
  { href: "/#services", label: "서비스" },
  { href: "/#workflow", label: "프로세스" },
  { href: "/board", label: "공지사항" },
  { href: "/#contact", label: "문의" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  const toggle = () => setOpen((prev) => !prev)
  const close = () => setOpen(false)

  return (
    <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2.5 md:py-3">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/images/soopify-logo.png"
            alt="Soopify Logo"
            className="h-10 w-auto md:h-12"
          />
          <span className="sr-only">Soopify</span>
        </Link>

        {/* 데스크톱 네비 */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6 text-sm font-semibold">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover:text-primary"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              asChild
              className="rounded-full px-4 py-2 text-[13px] font-semibold"
            >
              <a href="/#contact">상담 요청</a>
            </Button>
            <ModeToggle />
          </div>
        </div>

        {/* 모바일: 다크모드 + 햄버거 버튼 */}
        <div className="flex md:hidden items-center gap-2">
          <ModeToggle />
          <button
            type="button"
            onClick={toggle}
            className="inline-flex items-center justify-center rounded-full border px-2.5 py-2 text-muted-foreground"
            aria-label="메뉴 열기"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* 모바일 드로어 메뉴 */}
      {open && (
        <div className="md:hidden border-t bg-background">
          <nav className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-3 text-sm font-semibold">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={close}
                className="py-1"
              >
                {item.label}
              </a>
            ))}

            <Button
              asChild
              className="mt-2 w-full rounded-full py-2.5 text-[13px] font-semibold"
              onClick={close}
            >
              <a href="/#contact">상담 · 개발 의뢰</a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

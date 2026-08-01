// components/app-header.tsx
"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { SoopifyLogo } from "@/components/soopify-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

/**
 * 사이트 전 영역이 공유하는 헤더 껍데기.
 *
 * 랜딩 / 공개 페이지 / 관리자 세 곳의 헤더가 각자 sticky·backdrop·로고·
 * 모바일 드로어를 따로 구현하고 있어서, 로고 하나 바꾸는 데에도 세 파일을
 * 고쳐야 했다. 다른 건 네비 항목과 우측 액션뿐이므로 그 둘만 주입받는다.
 *
 * 사용처: components/landing-header.tsx, site-header.tsx, admin-header.tsx
 */

export type NavItem = {
  href: string
  label: string
}

type AppHeaderProps = {
  /** 로고를 눌렀을 때 이동할 경로 */
  homeHref?: string
  /** 로고 링크의 접근성 레이블 */
  homeLabel?: string
  /** 로고 오른쪽에 붙는 보조 라벨 (예: "관리자 페이지") */
  badge?: string
  nav?: NavItem[]
  /** 우측 액션 영역 (CTA 버튼, 로그아웃 등). 테마 토글 다음에 놓인다. */
  actions?: ReactNode
  /** 콘텐츠 컨테이너 최대 폭 클래스 */
  containerClassName?: string
}

/** 같은 페이지 내 앵커(#...)는 Next Link 대신 평범한 a 로 렌더한다. */
function NavLink({ item, className, onClick }: { item: NavItem; className?: string; onClick?: () => void }) {
  if (item.href.startsWith("#")) {
    return (
      <a href={item.href} className={className} onClick={onClick}>
        {item.label}
      </a>
    )
  }
  return (
    <Link href={item.href} className={className} onClick={onClick}>
      {item.label}
    </Link>
  )
}

export function AppHeader({
  homeHref = "/",
  homeLabel = "Soopify 홈",
  badge,
  nav = [],
  actions,
  containerClassName = "max-w-6xl",
}: AppHeaderProps) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  // 데스크톱 폭으로 넓어지면 드로어를 닫는다 (열린 채로 md 레이아웃에 남지 않도록)
  useEffect(() => {
    if (!open) return
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [open])

  const hasNav = nav.length > 0

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className={cn("mx-auto flex items-center justify-between gap-3 px-4 py-2", containerClassName)}>
        <Link href={homeHref} className="flex items-center gap-3" aria-label={homeLabel}>
          <SoopifyLogo size="lg" markOnly />
          {badge && (
            <span className="hidden border-l pl-3 text-xs text-muted-foreground sm:inline">{badge}</span>
          )}
        </Link>

        {hasNav && (
          <nav className="hidden items-center gap-7 md:flex">
            {nav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                className="text-sm font-semibold text-foreground/75 transition hover:text-foreground"
              />
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {actions}
          {hasNav && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="app-header-menu"
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border bg-background/70 text-muted-foreground shadow-sm transition hover:bg-accent sm:h-10 sm:w-10 md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {hasNav && open && (
        <div id="app-header-menu" className="border-t bg-background md:hidden">
          <nav className={cn("mx-auto flex flex-col gap-1 px-4 py-3", containerClassName)}>
            {nav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                onClick={close}
                className="rounded-xl px-3 py-2 text-sm font-semibold transition hover:bg-accent"
              />
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

// components/landing-header.tsx
"use client"

import { AppHeader, type NavItem } from "@/components/app-header"

const NAV: NavItem[] = [
  { href: "#products", label: "Products" },
  { href: "#insights", label: "Insights" },
  { href: "#contact", label: "Contact" },
]

/** 랜딩(/) 헤더. 예전에는 app/page.tsx 에 인라인으로 박혀 있었다. */
export function LandingHeader() {
  return (
    <AppHeader
      homeHref="/"
      nav={NAV}
      actions={
        <a
          href="#contact"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-2xl bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90"
        >
          문의하기
        </a>
      }
    />
  )
}

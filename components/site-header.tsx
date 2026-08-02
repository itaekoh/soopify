// components/site-header.tsx
"use client"

import Link from "next/link"
import { AppHeader, type NavItem } from "@/components/app-header"

// 랜딩의 실제 섹션(#products / #insights / #contact)에 맞춘다.
// 이전에는 /#services, /#workflow 를 가리키고 있었는데 해당 섹션은
// docs/planning.md 개편 때 삭제돼서 클릭해도 아무 데도 가지 않았다.
const NAV: NavItem[] = [
  { href: "/#products", label: "Products" },
  { href: "/#insights", label: "Insights" },
  { href: "/#contact", label: "Contact" },
  { href: "/board", label: "공지사항" },
]

/** 공개 페이지(/board/*) 헤더. */
export function SiteHeader() {
  return (
    <AppHeader
      homeHref="/"
      nav={NAV}
      containerClassName="max-w-5xl"
      actions={
        <Link
          href="/#contact"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-2xl bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90"
        >
          상담 요청
        </Link>
      }
    />
  )
}

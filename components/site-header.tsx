// components/site-header.tsx
"use client"

import { AppHeader, type NavItem } from "@/components/app-header"

// 랜딩의 실제 섹션(#about / #products / #insights / #contact)에 맞춘다.
// 이전에는 /#services, /#workflow 를 가리키고 있었는데 해당 섹션은
// docs/planning.md 개편 때 삭제돼서 클릭해도 아무 데도 가지 않았다.
const NAV: NavItem[] = [
  { href: "/#about", label: "회사소개" },
  { href: "/#products", label: "주요사업" },
  { href: "/#insights", label: "현장기록" },
  { href: "/#contact", label: "문의하기" },
  { href: "/board", label: "공지사항" },
]

/**
 * 공개 페이지(/board/*) 헤더.
 * 랜딩과 같은 이유로 CTA 버튼은 두지 않는다 — 메뉴의 '문의하기' 와 중복이다.
 */
export function SiteHeader() {
  return <AppHeader homeHref="/" nav={NAV} containerClassName="max-w-5xl" />
}

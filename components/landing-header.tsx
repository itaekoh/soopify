// components/landing-header.tsx
"use client"

import { AppHeader, type NavItem } from "@/components/app-header"

// 국내 대상 서비스라 메뉴는 한글로 쓴다.
// 섹션 eyebrow 는 영문을 유지한다 — 한글은 uppercase 가 없고
// tracking-widest 를 주면 12px 에서 자간이 벌어져 어색하다.
const NAV: NavItem[] = [
  { href: "#about", label: "회사소개" },
  { href: "#products", label: "주요사업" },
  { href: "#insights", label: "현장기록" },
  { href: "#contact", label: "문의하기" },
]

/**
 * 랜딩(/) 헤더. 예전에는 app/page.tsx 에 인라인으로 박혀 있었다.
 *
 * CTA 버튼은 두지 않는다 — 메뉴의 '문의하기' 와 목적지가 같아서 헤더에
 * 같은 링크가 두 번 놓였다. 전환 경로는 메뉴, HERO 버튼, Contact 섹션에
 * 이미 있다.
 */
export function LandingHeader() {
  return <AppHeader homeHref="/" nav={NAV} />
}

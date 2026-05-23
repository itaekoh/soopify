// app/page.tsx
import type { Metadata } from 'next'
import { Mail, MapPin } from 'lucide-react'
import { V20ClientScripts } from '@/components/v20-client-scripts'
import { V20ContactSection } from '@/components/v20-contact-section'
import { V20ThemeToggle } from '@/components/v20-theme-toggle'
import { InsightsSection } from '@/components/insights-section'

export const metadata: Metadata = {
  title: 'Soopify | 나무의사를 위한 AI 도구',
  description: '나무병원 홈페이지 자동 제작부터 수목 보고서 작성까지. 나무의사의 업무를 AI로 바꿉니다.',
}

export default function Home() {
  return (
    <div className="bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <V20ClientScripts />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
          <a className="flex items-center" href="#">
            <img
              src="/images/soopify-logo.png"
              alt="Soopify"
              className="h-10 w-auto md:h-12"
            />
          </a>
          <nav className="hidden items-center gap-7 md:flex">
            <a className="text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white" href="#products">Products</a>
            <a className="text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white" href="#insights">Insights</a>
            <a className="text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white" href="#contact">Contact</a>
          </nav>
          <button aria-controls="mobileMenu" aria-expanded="false" aria-label="메뉴 열기" className="mr-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white/70 text-slate-700 shadow-sm transition hover:bg-white md:hidden dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:bg-slate-900" id="mobileMenuBtn" type="button">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16"></path>
              <path d="M4 12h16"></path>
              <path d="M4 18h16"></path>
            </svg>
          </button>
          <V20ThemeToggle />
          <a className="inline-flex items-center justify-center rounded-2xl whitespace-nowrap bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200" href="#contact">
            문의하기
          </a>
        </div>

        {/* Mobile Menu */}
        <div className="hidden border-t border-slate-200/70 bg-white/80 backdrop-blur md:hidden dark:border-slate-800/70 dark:bg-slate-950/70" id="mobileMenu">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <nav className="flex flex-col gap-2">
              <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" href="#products">Products</a>
              <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" href="#insights">Insights</a>
              <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" href="#contact">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        {/* HERO */}
        <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
          <img
            src="/images/창선도_왕후박나무_.jpg"
            alt="창선도 왕후박나무"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
          <div className="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">나무의사가 만드는 AI 도구</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">
              나무의사의 일,<br />AI로 도웁니다.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80 md:text-xl">
              홈페이지 자동 제작부터 수목 보고서 작성까지.<br className="hidden md:block" />
              현장 경험을 담은 두 가지 도구를 만들고 있습니다.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="#products" className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-sm font-semibold text-slate-950 hover:bg-slate-100">
                Products 보기
              </a>
              <a href="#contact" className="inline-flex items-center justify-center rounded-2xl border border-white/40 px-8 py-4 text-sm font-semibold text-white hover:bg-white/10">
                사전 문의하기
              </a>
            </div>
          </div>
        </section>

        <ProductsSection />
        <CredentialsSection />
        <InsightsSection />

        {/* CONTACT */}
        <V20ContactSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="text-base font-semibold text-slate-950 dark:text-white">Soopify</p>
              <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                수목관련 서비스는「산림보호법」에 따라 나무병원 소속 나무의사가 수행합니다.
              </p>
            </div>
            <div className="space-y-3 md:flex md:flex-col md:items-end">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span>treedoctor@kakao.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span>서울특별시 성북구 동소문로63 드림트리빌딩 6F</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-3 text-xs md:flex-row md:items-center md:justify-between">
            <p className="text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} Soopify. All rights reserved.</p>
            <div className="flex gap-3">
              <a className="hover:underline" href="#">이용약관</a>
              <a className="hover:underline" href="#">개인정보처리방침</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function PressSection() {
  return (
    <section className="border-t border-slate-200 py-16 dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Press</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">관련 기사</h2>
        <div className="mt-8">
          <a
            href="https://www.nikkei.com/article/DGXZQOGM280Z30Y6A120C2000000/?gift=g2ls5pnSNwqjA0MTczMDQ2NjekOFpRSKAyAQ.8xe6mXsD"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-6 rounded-3xl border border-slate-200 bg-white p-7 transition hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-600"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v8a2 2 0 01-2 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 2v6h6M9 13h6M9 17h4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-400">日本経済新聞 · 2026.02.22</p>
              <p className="mt-1.5 text-base font-semibold group-hover:underline">
                한국 고도인재의 창업, 5년간 2.5배 증가 — "재벌 안녕" 출세 경쟁 심화
              </p>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                전문 지식을 가진 중년층이 AI·디지털 기반 창업을 주도하는 한국의 고도인재 창업 트렌드를 조명합니다.
              </p>
            </div>
            <svg className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700 dark:group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

function CredentialsSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 text-white">
      <img
        src="/images/청와대_복자기.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/35 to-slate-950/55" />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Founder</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">IT × 나무의사 융합</h2>
          <p className="mt-3 text-white/60">대기업 IT 27년의 실무 경험 위에 나무의사 전문성을 더했습니다.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* IT Career */}
          <article className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <span className="inline-block rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/60">
              IT 경력 27년
            </span>
            <h3 className="mt-4 text-xl font-semibold">대기업 IT 전문가</h3>
            <p className="mt-3 text-sm text-white/60">시스템 기획·구축·운영 전반을 아우르는 현장 경험</p>
            <ul className="mt-6 space-y-3">
              {["KCC", "LOTTE", "SK", "GS"].map((co) => (
                <li key={co} className="border-l-2 border-white/20 pl-4">
                  <p className="text-sm font-semibold">{co}</p>
                </li>
              ))}
            </ul>
          </article>

          {/* Tree Doctor */}
          <article className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <span className="inline-block rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/60">
              2024.05 – 2025.05
            </span>
            <h3 className="mt-4 text-xl font-semibold">나무병원 소속 나무의사</h3>
            <ul className="mt-6 space-y-4">
              {[
                { label: "청와대 수목관리", desc: "천연기념물, 대통령 기념식수목, 경관수목" },
                { label: "강원도 수목", desc: "천연기념물 및 보호수" },
                { label: "경상도 수목", desc: "함양 상림, 하동 송림, 천연기념물 및 보호수" },
              ].map((item) => (
                <li key={item.label} className="border-l-2 border-white/20 pl-4">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="mt-0.5 text-sm text-white/60">{item.desc}</p>
                </li>
              ))}
            </ul>
          </article>

          {/* Association */}
          <article className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <span className="inline-block rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/60">
              2025.10 – 현재
            </span>
            <h3 className="mt-4 text-xl font-semibold">나무의사협회 대위원</h3>
            <ul className="mt-6 space-y-4">
              {[
                { label: "나무의사협회장 표창 수상", desc: "" },
                { label: "학교숲 컨설팅", desc: "수락고등학교, 서울사대부고 등" },
                { label: "가로수 조사 및 컨설팅", desc: "마포대로 소나무 등" },
              ].map((item) => (
                <li key={item.label} className="border-l-2 border-white/20 pl-4">
                  <p className="text-sm font-semibold">{item.label}</p>
                  {item.desc && <p className="mt-0.5 text-sm text-white/60">{item.desc}</p>}
                </li>
              ))}
            </ul>
          </article>
        </div>

        {/* Press */}
        <div className="mt-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">Press</p>
          <a
            href="https://www.nikkei.com/article/DGXZQOGM280Z30Y6A120C2000000/?gift=g2ls5pnSNwqjA0MTczMDQ2NjekOFpRSKAyAQ.8xe6mXsD"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-6 rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur transition hover:border-white/20"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v8a2 2 0 01-2 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 2v6h6M9 13h6M9 17h4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-white/40">日本経済新聞 · 2026.02.22</p>
              <p className="mt-1.5 text-base font-semibold group-hover:underline">
                한국 고도인재의 창업, 5년간 2.5배 증가 — "재벌 안녕" 출세 경쟁 심화
              </p>
              <p className="mt-1.5 text-sm text-white/60">
                전문 지식을 가진 중년층이 AI·디지털 기반 창업을 주도하는 한국의 고도인재 창업 트렌드를 조명합니다.
              </p>
            </div>
            <svg className="h-5 w-5 shrink-0 text-white/40 transition group-hover:translate-x-1 group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

function ProductsSection() {
  return (
    <section id="products" className="mt-20 md:mt-28 mb-16 md:mb-24">
      <div className="mx-auto max-w-6xl px-4 space-y-10">
        {/* Soopsite */}
        <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:grid-cols-2">
          <div className="relative aspect-[4/3] md:aspect-auto">
            <img
              src="/images/soopsite.png"
              alt="Soopsite"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-10 py-10 md:px-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Coming Soon</span>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Soopsite</h2>
            <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">나무병원 홈페이지 자동 제작 에이전트</p>
            <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              병원 정보를 입력하면 AI가 홈페이지를 자동으로 제작합니다. 전문 디자이너 없이도 신뢰감 있는 나무병원 웹사이트를 바로 운영할 수 있습니다.
            </p>
            <div className="mt-6">
              <a href="#contact" className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                사전 문의하기
              </a>
            </div>
          </div>
        </div>

        {/* Soopdoc */}
        <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:grid-cols-2">
          <div className="flex flex-col justify-center px-10 py-10 md:px-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Coming Soon</span>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Soopdoc</h2>
            <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">수목 조사 → 보고서 자동 작성 에이전트</p>
            <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              현장 조사 데이터를 입력하면 표준 수목 보고서를 자동으로 완성합니다. 작성 시간을 줄이고 품질은 높입니다.
            </p>
            <div className="mt-6">
              <a href="#contact" className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                사전 문의하기
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3] md:aspect-auto">
            <img
              src="/images/soopreport.png"
              alt="Soopdoc"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}


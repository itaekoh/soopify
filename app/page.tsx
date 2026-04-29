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
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a className="flex items-center" href="#">
            <img
              src="/images/soopify-logo.png"
              alt="Soopify"
              className="h-14 w-auto md:h-16"
            />
          </a>
          <nav className="hidden items-center gap-7 md:flex">
            <a className="text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white" href="#products">Products</a>
            <a className="text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white" href="#insights">Insights</a>
            <a className="text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white" href="#contact">문의</a>
          </nav>
          <button aria-controls="mobileMenu" aria-expanded="false" aria-label="메뉴 열기" className="mr-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white/70 text-slate-700 shadow-sm transition hover:bg-white md:hidden dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:bg-slate-900" id="mobileMenuBtn" type="button">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16"></path>
              <path d="M4 12h16"></path>
              <path d="M4 18h16"></path>
            </svg>
          </button>
          <V20ThemeToggle />
          <a className="inline-flex items-center justify-center rounded-2xl whitespace-nowrap bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200" href="#contact">
            문의하기
          </a>
        </div>

        {/* Mobile Menu */}
        <div className="hidden border-t border-slate-200/70 bg-white/80 backdrop-blur md:hidden dark:border-slate-800/70 dark:bg-slate-950/70" id="mobileMenu">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <nav className="flex flex-col gap-2">
              <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" href="#products">Products</a>
              <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" href="#insights">Insights</a>
              <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" href="#contact">문의</a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 pt-12 md:pt-16">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
              {/* Left */}
              <div className="md:col-span-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                  나무의사가 만드는 AI 도구
                </div>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
                  나무의사의 일,<br className="hidden md:block"/>
                  <span className="underline decoration-4 underline-offset-4">AI</span>로 바꿉니다.
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-slate-700 dark:text-slate-200 md:text-xl">
                  홈페이지 자동 제작부터 수목 보고서 작성까지.<br className="hidden md:block"/>
                  현장 경험을 담은 두 가지 도구를 만들고 있습니다.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200" href="#products">
                    제품 살펴보기
                  </a>
                  <a className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-4 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-800 dark:text-white dark:hover:bg-slate-900" href="#contact">
                    사전 문의하기
                  </a>
                </div>
              </div>

              {/* Right: Visual */}
              <div className="md:col-span-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                    <div className="aspect-[16/10]">
                      <img alt="Soopsite preview" className="js-media" data-kind="dashboard" data-src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80" loading="lazy"/>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Soopsite</p>
                          <p className="mt-1 text-lg font-semibold">나무병원 홈페이지 자동 제작</p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            병원 정보를 입력하면 AI가 홈페이지를 자동으로 만들어 드립니다.
                          </p>
                        </div>
                        <span className="shrink-0 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                          출시 예정
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                    <div className="aspect-[16/10]">
                      <img alt="Soopdoc preview" className="js-media" data-kind="lifecycle" data-src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80" loading="lazy"/>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Soopdoc</p>
                          <p className="mt-1 text-lg font-semibold">수목 보고서 자동 작성</p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            현장 조사 데이터를 입력하면 표준 보고서를 자동으로 완성합니다.
                          </p>
                        </div>
                        <span className="shrink-0 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                          출시 예정
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

function CredentialsSection() {
  return (
    <section className="border-t border-slate-200 py-16 dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">나무의사 이력</h2>
          <p className="mt-4 text-lg text-slate-700 dark:text-slate-200">
            현장 경험에서 출발한 도구입니다.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">2024.05 – 2026.05</p>
            <h3 className="mt-2 text-xl font-semibold">나무병원 소속 나무의사</h3>
            <ul className="mt-5 space-y-3">
              {[
                { label: "청와대 수목관리", desc: "천연기념물, 대통령 기념식수목, 경관수목" },
                { label: "강원도 수목", desc: "천연기념물 및 보호수" },
                { label: "경상도 수목", desc: "함양 상림, 하동 송림, 천연기념물 및 보호수" },
              ].map((item) => (
                <li key={item.label} className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">{item.label}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-300">{item.desc}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">2025.10 – 현재</p>
            <h3 className="mt-2 text-xl font-semibold">나무의사협회 대위원</h3>
            <ul className="mt-5 space-y-3">
              {[
                { label: "나무의사협회장 표창 수상", desc: "" },
                { label: "학교숲 컨설팅", desc: "수락고등학교, 서울사대부고 등" },
                { label: "가로수 조사 및 컨설팅", desc: "마포대로 소나무 등" },
              ].map((item) => (
                <li key={item.label} className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">{item.label}</span>
                  {item.desc && <span className="text-sm text-slate-600 dark:text-slate-300">{item.desc}</span>}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}

function ProductsSection() {
  return (
    <section className="mt-14 border-t border-slate-200 py-16 dark:border-slate-800" id="products">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Products</h2>
          <p className="mt-4 text-lg text-slate-700 dark:text-slate-200">
            현장에서 직접 느낀 불편함을 해결하는 두 가지 도구를 만들고 있습니다.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-2xl font-semibold">Soopsite</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">출시 예정</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">나무병원 홈페이지 자동 제작 에이전트</p>
            <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              병원 정보를 입력하면 AI가 홈페이지를 자동으로 제작합니다. 전문 디자이너 없이도 신뢰감 있는 나무병원 웹사이트를 바로 운영할 수 있습니다.
            </p>
            <ul className="mt-6 space-y-2">
              {["병원 정보 입력만으로 자동 생성", "나무의사 자격·경력 자동 구성", "모바일 최적화 및 문의 폼 포함"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-950 dark:bg-white" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              <a href="#contact" className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                사전 문의하기
              </a>
            </div>
          </article>

          <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-2xl font-semibold">Soopdoc</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">출시 예정</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">수목 조사 → 보고서 자동 작성 에이전트</p>
            <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              현장 조사 데이터를 입력하면 표준 수목 보고서를 자동으로 완성합니다. 작성 시간을 줄이고 품질은 높입니다.
            </p>
            <ul className="mt-6 space-y-2">
              {["현장 데이터 입력 → 보고서 자동 완성", "결재·민원·감사 대응 가능한 근거 문서", "수목 건강·위험도 평가 항목 포함"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-950 dark:bg-white" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              <a href="#contact" className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                사전 문의하기
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}


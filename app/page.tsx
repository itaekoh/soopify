// app/page.tsx
import type { Metadata } from 'next'
import { Mail, MapPin } from 'lucide-react'
import { V20ClientScripts } from '@/components/v20-client-scripts'
import { V20ContactSection } from '@/components/v20-contact-section'
import { V20ThemeToggle } from '@/components/v20-theme-toggle'
import { InsightsSection } from '@/components/insights-section'

export const metadata: Metadata = {
  title: 'Soopify | Urban Tree Management',
  description: '도시 수목 관리를 시스템으로. 현장 기반 + 데이터 기반 운영 체계.',
}

export default function Home() {
  return (
    <div className="bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <V20ClientScripts />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a className="flex items-center gap-3" href="#">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">S</span>
            <div className="leading-tight">
              <div className="text-base font-semibold tracking-tight">Soopify</div>
              <div className="text-xs text-slate-600 dark:text-slate-300">Urban Tree Management</div>
            </div>
          </a>
          <nav className="hidden items-center gap-7 md:flex">
            <a className="text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white" href="#solutions">Solutions</a>
            <a className="text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white" href="#services">Services</a>
            <a className="text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white" href="#cases">Case Studies</a>
            <a className="text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white" href="#insights">Insights</a>
            <a className="text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white" href="#contact">Support</a>
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
              <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" href="#solutions">Solutions</a>
              <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" href="#services">Services</a>
              <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" href="#cases">Case Studies</a>
              <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" href="#insights">Insights</a>
              <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" href="#contact">Support</a>
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
                  Field + Data + Standardized Operations
                </div>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
                  도시 수목 관리,<br className="hidden md:block"/>
                  이제 <span className="underline decoration-4 underline-offset-4">시스템</span>으로 합니다.
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-slate-700 dark:text-slate-200 md:text-xl">
                  진단 이후의 관리까지 표준화합니다.<br className="hidden md:block"/>
                  리스크를 줄이고 수명을 늘리는 운영 체계를 만듭니다.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200" href="#solutions">
                    솔루션 보기
                  </a>
                  <a className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-4 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-800 dark:text-white dark:hover:bg-slate-900" href="#services">
                    서비스 살펴보기
                  </a>
                </div>
                <div className="mt-10 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 dark:bg-slate-900 dark:text-slate-100">학교숲</span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 dark:bg-slate-900 dark:text-slate-100">공공·지자체</span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 dark:bg-slate-900 dark:text-slate-100">아파트 단지</span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 dark:bg-slate-900 dark:text-slate-100">가로수</span>
                </div>
              </div>

              {/* Right: Visual */}
              <div className="md:col-span-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <div className="md:col-span-2 relative overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                      <div className="aspect-[16/10] hero-media-lg">
                        <img alt="Dashboard preview" className="js-media" data-kind="dashboard" data-src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80" loading="lazy"/>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Soopify Standard Report</p>
                            <p className="mt-1 text-lg font-semibold">Tree Health & Risk Overview</p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                              상태 · 위험도 · 우선순위 · 조치 권고를 한 장으로 정리합니다.
                            </p>
                          </div>
                          <span className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            Preview
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                    <div className="aspect-[21/9] hero-media-sm">
                      <img alt="Lifecycle preview" className="js-media" data-kind="lifecycle" data-src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80" loading="lazy"/>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Lifecycle</p>
                      <p className="mt-2 text-sm font-semibold">연차별 관리 계획</p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">계절·입지에 따른 반복 업무를 표준화합니다.</p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                    <div className="aspect-[21/9] hero-media-sm">
                      <img alt="Operations preview" className="js-media" data-kind="operations" data-src="https://otthqvsekttrljmonvdg.supabase.co/storage/v1/object/public/images/public/6c9a3c66-b1a1-47a7-8a1a-a666b238dcdb/meeting.jpg" loading="lazy"/>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Operations</p>
                      <p className="mt-2 text-sm font-semibold">현장 → 기록 → 비교</p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">데이터가 쌓일수록 판단이 더 정확해집니다.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature strip */}
            <div className="mt-12 grid grid-cols-1 gap-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900">
                <p className="text-sm font-semibold">표준 프로세스</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">관찰·평가·결정·관리·기록의 흐름을 고정합니다.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900">
                <p className="text-sm font-semibold">관리 중심</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">사후 대응이 아니라 예방·유지관리 체계에 집중합니다.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900">
                <p className="text-sm font-semibold">리포트 품질</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">결재·민원·감사 대응이 가능한 근거 문서를 제공합니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Continue with other sections... File is getting too long */}
        {/* I'll split into separate file */}
        <SolutionsSection />
        <ServicesSection />
        <CaseStudiesSection />
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

// Section Components
function SolutionsSection() {
  return (
    <section className="mt-14 border-t border-slate-200 py-16 dark:border-slate-800" id="solutions">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Solutions</h2>
          <p className="mt-4 text-lg text-slate-700 dark:text-slate-200">
            Soopify는 "진단"을 목적이 아니라 <span className="font-semibold">운영의 시작</span>으로 봅니다.
            수목을 기록하고, 비교하고, 관리하는 방식으로 품질과 리스크를 동시에 잡습니다.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 p-7 dark:border-slate-800">
            <h3 className="text-xl font-semibold">Tree Health Intelligence</h3>
            <p className="mt-3 text-base text-slate-700 dark:text-slate-200">상태를 기록하고 비교합니다.</p>
          </article>
          <article className="rounded-3xl border border-slate-200 p-7 dark:border-slate-800">
            <h3 className="text-xl font-semibold">Risk & Safety Management</h3>
            <p className="mt-3 text-base text-slate-700 dark:text-slate-200">위험을 점수화하고 우선순위를 정합니다.</p>
          </article>
          <article className="rounded-3xl border border-slate-200 p-7 dark:border-slate-800">
            <h3 className="text-xl font-semibold">Lifecycle Operations</h3>
            <p className="mt-3 text-base text-slate-700 dark:text-slate-200">연차별 관리 로드맵을 설계합니다.</p>
          </article>
        </div>
      </div>
    </section>
  )
}

// Due to file length, I'll create separate component files for Services, Cases, and Insights
function ServicesSection() {
  const services = [
    {
      title: "나무병원 운영 시스템 구축",
      category: "Tree Clinic System",
      description: "진단·리포트·서비스 안내를 하나의 운영 구조로 정리합니다. 홈페이지부터 업무 흐름까지 실제 운영 기준에 맞춰 설계합니다.",
      output: "산출물: 운영 구조·웹/리포트 템플릿",
      image: "https://otthqvsekttrljmonvdg.supabase.co/storage/v1/object/public/images/public/6c9a3c66-b1a1-47a7-8a1a-a666b238dcdb/treesystem.jpg",
      kind: "service-dx",
      link: "#contact"
    },
    {
      title: "수목 건강 진단 프로그램",
      category: "Tree Health Program",
      description: "상태를 기준화하고 관리 우선순위를 도출합니다.",
      output: "산출물: 표준 리포트(PDF)",
      image: "https://otthqvsekttrljmonvdg.supabase.co/storage/v1/object/public/images/public/6c9a3c66-b1a1-47a7-8a1a-a666b238dcdb/HhflsOjoXrgcIPRpk73-x.jpg",
      kind: "service-health",
      link: "#"
    },
    {
      title: "수목 위험성 평가 프로그램",
      category: "Tree Risk Program",
      description: "위험 요소를 평가하고 대응 우선순위를 제시합니다.",
      output: "산출물: 위험성 평가서",
      image: "https://otthqvsekttrljmonvdg.supabase.co/storage/v1/object/public/images/public/6c9a3c66-b1a1-47a7-8a1a-a666b238dcdb/tree_risk.png",
      kind: "service-risk",
      link: "#"
    },
    {
      title: "소나무 케어 프로그램",
      category: "Pine Care Program",
      description: "계절·입지 기반으로 관리 루틴을 설계합니다.",
      output: "산출물: 연간 로드맵",
      image: "https://otthqvsekttrljmonvdg.supabase.co/storage/v1/object/public/images/public/6c9a3c66-b1a1-47a7-8a1a-a666b238dcdb/bluehouse_pine.jpg",
      kind: "service-pine",
      link: "#"
    }
  ]

  return (
    <section className="border-t border-slate-200 py-16 dark:border-slate-800" id="services">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Services</h2>
          <p className="mt-4 text-lg text-slate-700 dark:text-slate-200">
            개별 업무가 아닌, <span className="font-semibold">기준·산출물·진행 방식</span>이 포함된 표준 프로그램으로 제공합니다.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 svc-grid">
          {services.map((service, idx) => (
            <article key={idx} className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 h-full">
              <div className="aspect-[16/10]">
                <img alt={service.title} className="js-media object-center tone-unify" data-kind={service.kind} data-src={service.image} loading="lazy"/>
              </div>
              <div className="p-6 flex flex-col h-full">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{service.category}</p>
                <h3 className="mt-2 text-xl font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {service.description}
                </p>
                <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{service.output}</span>
                  <a className="text-sm font-semibold hover:underline" href={service.link}>
                    {service.link === "#contact" ? "문의하기" : "상품 보기"}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900">
              <p className="text-sm font-semibold">진행 방식</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">접수 → 사전 협의 → 현장 방문 → 리포트 제공</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900">
              <p className="text-sm font-semibold">산출물 기준</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">결재·민원·감사 대응을 고려해 "근거 중심"으로 작성합니다.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900">
              <p className="text-sm font-semibold">스토어 연계</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">프로그램을 상품화해 접수·범위를 표준화합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CaseStudiesSection() {
  const cases = [
    {
      title: "현장 기록 기반 관리 설계",
      category: "학교숲",
      description: "우선순위와 연차별 관리계획을 정리.",
      image: "https://otthqvsekttrljmonvdg.supabase.co/storage/v1/object/public/images/public/6c9a3c66-b1a1-47a7-8a1a-a666b238dcdb/school_soop.jpg",
      kind: "school"
    },
    {
      title: "리스크 중심 점검·대응 체계",
      category: "가로수",
      description: "위험 요소 분류와 사전 조치 계획.",
      image: "https://otthqvsekttrljmonvdg.supabase.co/storage/v1/object/public/images/public/6c9a3c66-b1a1-47a7-8a1a-a666b238dcdb/tree_street.jpg",
      kind: "street"
    },
    {
      title: "민원/하자 대응 리포트",
      category: "아파트",
      description: "근거 중심 문서로 커뮤니케이션 단순화.",
      image: "https://otthqvsekttrljmonvdg.supabase.co/storage/v1/object/public/images/public/6c9a3c66-b1a1-47a7-8a1a-a666b238dcdb/apt.jpg",
      kind: "apartment"
    }
  ]

  return (
    <section className="py-16" id="cases">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Case Studies</h2>
          <p className="mt-4 text-lg text-slate-700 dark:text-slate-200">사례는 "현장 + 표준 + 기록"이 작동하는 방식입니다.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 case-grid">
          {cases.map((caseStudy, idx) => (
            <article key={idx} className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 h-full">
              <div className="aspect-[16/10]">
                <img alt={caseStudy.title} className="js-media object-center tone-unify" data-kind={caseStudy.kind} data-src={caseStudy.image} loading="lazy"/>
              </div>
              <div className="p-6 flex flex-col h-full">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{caseStudy.category}</p>
                <h3 className="mt-2 text-xl font-semibold">{caseStudy.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{caseStudy.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// app/page.tsx
import { Fragment } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowUpRight, ChevronRight, ClipboardList, FileCheck2, Images, Mail, MapPin } from 'lucide-react'
import { V20ClientScripts } from '@/components/v20-client-scripts'
import { V20ContactSection } from '@/components/v20-contact-section'
import { InsightsSection } from '@/components/insights-section'
import { SoopifyLockup } from '@/components/soopify-logo'
import { LandingHeader } from '@/components/landing-header'

export const metadata: Metadata = {
  title: 'Soopify | 나무의사를 위한 AI 도구',
  description: '나무병원 홈페이지 제작부터 사진대지·수목 보고서 작성까지, Soopify 하나로 처리합니다.',
}

// InsightsSection 이 매 요청마다 DB 를 조회한다. 방문마다 새로 조회할 만큼
// 자주 바뀌는 데이터가 아니므로 5분 단위로만 갱신한다.
export const revalidate = 300

export default function Home() {
  return (
    <div className="bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <V20ClientScripts />

      <LandingHeader />

      <main>
        {/* HERO */}
        <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
          <Image
            src="/images/창선도_왕후박나무_.jpg"
            alt="창선도 왕후박나무"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
          <div className="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">나무의사가 만드는 AI 도구</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">
              나무의사의 일,<br />AI가 함께합니다.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80 md:text-xl">
              나무병원 홈페이지 제작부터 수목 보고서 작성까지.<br className="hidden md:block" />
              나무의사의 현장 경험을 담아 만들고 있습니다.
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

        <AboutSection />
        <ProductsSection />
        <InsightsSection />

        {/* CONTACT */}
        <V20ContactSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <SoopifyLockup height={32} />
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
              <a className="hover:underline" href="/terms">이용약관</a>
              <a className="hover:underline" href="/privacy">개인정보처리방침</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function AboutSection() {
  return (
    <section id="about" className="border-y border-slate-200 bg-slate-50 py-16 md:py-20 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">About</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
          나무를 이해하는 기술,<br />수목관리의 새로운 기준
        </h2>

        {/* 좌: 포지셔닝 + 대표이사 말 (원래 둘로 나뉘어 같은 얘기를 반복했다)
            우: 이력 */}
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-5 md:gap-14">
          <div className="md:col-span-3">
            <p className="text-sm font-semibold text-primary">IT Engineering &times; Arboriculture</p>
            <figure className="mt-4 border-l-2 border-primary/40 pl-6">
              <blockquote className="text-xl font-semibold leading-snug tracking-tight md:text-2xl">
                &ldquo;나무도 이제 데이터로 관리되어야 합니다.&rdquo;
              </blockquote>
              <figcaption className="mt-4">
                <p className="text-sm font-semibold">대표이사</p>
                <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-200">
                  27년간의 IT 경험과 나무의사 현장 경험을 결합해, 기존 수목관리 업무를
                  데이터 기반 서비스로 전환하고 있습니다.
                </p>
              </figcaption>
            </figure>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Career</p>
            <dl className="mt-4 space-y-5">
              {[
                {
                  period: '1997.04 – 2024.04',
                  title: '대기업 IT 27년',
                  detail: '프로젝트관리전문가(PMP) · KCC · LOTTE · SK · GS',
                },
                {
                  period: '2024.05 – 2025.05',
                  title: '나무병원 소속 나무의사',
                  detail: '청와대 수목관리 · 천연기념물 및 보호수(강원·경남)',
                },
                {
                  period: '2025.10 – 현재',
                  title: '나무의사협회 대위원',
                  detail: '협회장 표창 · 학교숲·가로수 컨설팅',
                },
              ].map((item) => (
                <div key={item.period} className="border-l-2 border-slate-200 pl-4 dark:border-slate-700">
                  <dt className="text-xs font-semibold tabular-nums text-slate-500 dark:text-slate-400">
                    {item.period}
                  </dt>
                  <dd>
                    <p className="mt-1 text-sm font-semibold">{item.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {item.detail}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* 언론보도 — 한 줄 띠 */}
        <a
          href="https://www.nikkei.com/article/DGXZQOGM280Z30Y6A120C2000000/?gift=g2ls5pnSNwqjA0MTczMDQ2NjekOFpRSKAyAQ.8xe6mXsD"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="日本経済新聞 기사 새 창에서 열기"
          className="group mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700"
        >
          <span className="shrink-0 rounded-full bg-slate-900/10 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200">
            언론보도
          </span>
          <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
            日本経済新聞 &middot; 2026.02.22
          </span>
          <span className="min-w-0 flex-1 font-semibold group-hover:underline">
            한국 고도인재의 창업, 5년간 2.5배 증가
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
        </a>
      </div>
    </section>
  )
}

function ProductsSection() {
  // 로드맵은 진척률(%)을 쓰지 않는다. 지금 쓸 수 있는 것과 목표만 구분한다.
  // 마지막 단계(목표)만 아이콘 칩을 반전시켜 도착점으로 읽히게 한다.
  const roadmap = [
    { title: '사진대지', note: '지금 쓸 수 있습니다', icon: Images, tone: 'now' },
    { title: '나무병원 양식', note: '추가하는 중', icon: ClipboardList, tone: 'wip' },
    { title: '종합보고서', note: '목표', icon: FileCheck2, tone: 'goal' },
  ] as const

  const chipClass = {
    now: 'bg-primary/10 text-primary',
    wip: 'bg-slate-500/10 text-slate-500 dark:text-slate-400',
    goal: 'bg-slate-950 text-white dark:bg-white dark:text-slate-950',
  } as const

  const titleClass = {
    now: 'text-primary',
    wip: 'text-slate-600 dark:text-slate-300',
    goal: 'text-slate-950 dark:text-white',
  } as const

  return (
    <section id="products" className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Products</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          나무의사의 일을 돕는 도구
        </h2>
        <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
          수목 조사부터 보고서 작성까지, Soopify 하나로 잇고 있습니다.
        </p>

        <div className="mt-10 space-y-5">
          {/* 유일한 제품. docnamu 브랜드를 버리고 app.soopify.com 으로 통합했으므로
              "Soopify Workspace" 로 부른다. 로드맵은 이 카드 하단에서 보여준다. */}
          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-[16/10] md:aspect-auto">
                <Image
                  src="/images/soopreport.jpg"
                  alt="Soopify로 만든 수목 보고서"
                  fill
                  sizes="(min-width: 768px) 576px, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col justify-center p-8 md:p-10">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  진행 중
                </span>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Soopify Workspace</h3>
                <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  수목 조사 &rarr; 보고서 작성
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
                  현장 사진을 올리면 사진대지가 만들어집니다. 나무병원에서 쓰는 양식을
                  하나씩 더해, 최종적으로는 종합보고서까지 잇는 것을 목표로 합니다.
                </p>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  나무병원 홈페이지 제작도 함께 문의해 주세요.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="https://app.soopify.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                  >
                    Soopify Workspace
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                  >
                    문의하기
                  </a>
                </div>
              </div>
            </div>

            {/* 로드맵 — 카드 하단, 전체 폭 */}
            <div className="border-t border-slate-200 bg-slate-50 px-8 py-6 md:px-10 dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
                {roadmap.map((step, i) => (
                  <Fragment key={step.title}>
                    <div className="flex min-w-0 items-center gap-3 sm:flex-1">
                      <span
                        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${chipClass[step.tone]}`}
                      >
                        <step.icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold ${titleClass[step.tone]}`}>{step.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{step.note}</p>
                      </div>
                    </div>
                    {i < roadmap.length - 1 && (
                      <ChevronRight
                        aria-hidden="true"
                        className="hidden h-4 w-4 shrink-0 text-slate-300 sm:block dark:text-slate-600"
                      />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

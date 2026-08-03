// app/page.tsx
import type { Metadata } from 'next'
import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { V20ClientScripts } from '@/components/v20-client-scripts'
import { V20ContactSection } from '@/components/v20-contact-section'
import { InsightsSection } from '@/components/insights-section'
import { SoopifyLockup } from '@/components/soopify-logo'
import { LandingHeader } from '@/components/landing-header'

export const metadata: Metadata = {
  title: 'Soopify | 나무의사를 위한 AI 도구',
  description: '나무병원 홈페이지 제작부터 수목 보고서 작성까지. 나무의사의 업무를 AI로 바꿉니다.',
}

export default function Home() {
  return (
    <div className="bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <V20ClientScripts />

      <LandingHeader />

      <main>
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
              나무의사의 일,<br />AI가 함께합니다.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80 md:text-xl">
              홈페이지 제작부터 수목 보고서 작성까지.<br className="hidden md:block" />
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
              <a className="hover:underline" href="#">이용약관</a>
              <a className="hover:underline" href="#">개인정보처리방침</a>
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
  return (
    <section id="products" className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Products</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          나무의사의 일을 돕는 도구
        </h2>
        <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
          홈페이지 제작부터 수목 보고서 작성까지, 두 가지를 만들고 있습니다.
        </p>

        {/* 카드 두 장의 높이를 맞춘다. 예전에는 이미지에 max-h 를 걸어서
            이미지가 카드 바닥에 닿지 않았고, 둥근 모서리가 아래쪽만 각지게
            남으면서 카드마다 여백이 달랐다. 이제 높이는 카드가 정하고
            이미지는 grid stretch 로 꽉 채운다. h 대신 min-h 를 쓴 이유는
            문구가 길어지면 잘리는 대신 늘어나도록 하기 위함. */}
        <div className="mt-10 space-y-6">
        {/* Soopsite */}
        <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:min-h-[380px] md:grid-cols-2">
          <div className="relative aspect-[16/10] md:aspect-auto">
            <img
              src="/images/soopsite.jpg"
              alt="Soopsite"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Coming Soon</span>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">Soopsite</h3>
            <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">나무병원 홈페이지 제작 에이전트</p>
            <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              병원 정보를 입력하면 AI가 홈페이지를 제작합니다. 전문 디자이너 없이도 신뢰감 있는 나무병원 웹사이트를 바로 운영할 수 있습니다.
            </p>
            <div className="mt-6">
              <a href="#contact" className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                사전 문의하기
              </a>
            </div>
          </div>
        </div>

        {/* Soopdoc */}
        <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:min-h-[380px] md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 md:p-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Coming Soon</span>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">Soopdoc</h3>
            <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">수목 조사 → 보고서 작성 에이전트</p>
            <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              현장 조사 데이터를 입력하면 표준 수목 보고서를 완성합니다. 작성 시간을 줄이고 품질은 높입니다.
            </p>
            <div className="mt-6">
              <a href="#contact" className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                사전 문의하기
              </a>
            </div>
          </div>
          <div className="relative aspect-[16/10] md:aspect-auto">
            <img
              src="/images/soopreport.jpg"
              alt="Soopdoc"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}


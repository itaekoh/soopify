// components/insights-section.tsx
"use client"

import { useEffect, useState } from "react"

type Insight = {
  id: number
  title: string
  excerpt: string | null
  content: string
  featured_image_url: string | null
  published_date: string
  category_id: number
  slug: string
  sn_categories: {
    slug: string
  } | null
}

/** 랜딩에 노출할 글 수. 3열 한 행으로 맞춘다 — 6건이면 두 행이 되어
 *  섹션이 다른 섹션보다 훨씬 커진다. 전체는 블로그에서 본다. */
const VISIBLE = 3

export function InsightsSection() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInsights()
  }, [])

  async function fetchInsights() {
    try {
      const res = await fetch("/api/insights")
      const data = await res.json()
      setInsights((data.data || []).slice(0, VISIBLE))
    } catch (err) {
      console.error("Failed to fetch insights:", err)
    } finally {
      setLoading(false)
    }
  }

  // excerpt 또는 content에서 텍스트 추출 (HTML 태그 제거)
  function extractText(html: string, maxLength: number = 100): string {
    const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  // Products 와의 사이에는 구분선을 두지 않는다 — 섹션이 갈라져 보인다.
  // About/Products 는 배경색 차이로 이미 나뉘어 있다.
  return (
    <section className="py-16" id="insights">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Insights</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              현장에서의 판단 기준과 운영 사례
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
              나무를 보는 눈과 실무 기록을 공유합니다.
            </p>
          </div>
          <a
            className="inline-flex w-fit items-center justify-center rounded-2xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            href="https://www.soopnote.com/"
            rel="noreferrer"
            target="_blank"
          >
            블로그 전체 보기
          </a>
        </div>

        {loading ? (
          <div className="mt-10 text-center text-slate-500">
            로딩 중...
          </div>
        ) : insights.length === 0 ? (
          <div className="mt-10 text-center text-slate-500">
            아직 등록된 Insights가 없습니다.
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight) => (
              <article
                key={insight.id}
                className="rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700 overflow-hidden"
              >
                {/* 썸네일 이미지 */}
                {insight.featured_image_url && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={insight.featured_image_url}
                      alt={insight.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {new Date(insight.published_date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug">
                    <a
                      className="hover:underline"
                      href={insight.sn_categories?.slug ? `https://www.soopnote.com/${insight.sn_categories.slug}/${insight.id}` : '#'}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {insight.title}
                    </a>
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                    {insight.excerpt || extractText(insight.content)}
                  </p>
                  <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Soopnote</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

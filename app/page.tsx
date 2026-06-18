// app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Soopify | 준비중',
  description: '나무의사를 위한 AI 도구, Soopify. 곧 돌아옵니다.',
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center dark:bg-slate-950">
      <img
        src="/images/soopify-logo.png"
        alt="Soopify"
        className="h-24 w-auto md:h-32"
      />
      <p className="mt-10 text-sm font-semibold uppercase tracking-widest text-slate-400">준비중</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
        홈페이지를 구축하고 있습니다.
      </h1>
      <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
        나무의사를 위한 AI 도구, 곧 만납니다.
      </p>
      <a
        href="mailto:treedoctor@kakao.com"
        className="mt-10 text-sm text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
      >
        treedoctor@kakao.com
      </a>
    </div>
  )
}

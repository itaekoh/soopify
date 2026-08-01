// components/soopify-logo.tsx
//
// Soopify 브랜드 락업. 헤더는 모두 이 컴포넌트를 쓴다.
//
// 마크는 assets/brand/soopify-mark.png 가 원본이고,
// 여기서 참조하는 PNG는 scripts/build-brand-assets.mjs (`npm run brand`)가 생성한다.
//
// 워드마크를 이미지가 아니라 HTML 텍스트로 두는 이유:
//   - 원본 워드마크 색 #285030 은 slate-950 배경에서 대비 2.2:1 로 다크모드에서
//     거의 안 보인다. 텍스트라면 색만 바꾸면 된다.
//   - 어떤 배율에서도 선명하고, 헤더 높이를 바꿔도 리사이즈 아티팩트가 없다.
import { cn } from "@/lib/utils"

/** 마크 원본 종횡비 (트리밍 후 815 x 605) */
const MARK_RATIO = 815 / 605

const SIZES = {
  sm: { mark: 26, word: "text-base", gap: "gap-2" },
  md: { mark: 32, word: "text-xl", gap: "gap-2.5" },
  lg: { mark: 44, word: "text-3xl", gap: "gap-3" },
} as const

type Size = keyof typeof SIZES

export function SoopifyMark({ className, size = "md" }: { className?: string; size?: Size }) {
  const h = SIZES[size].mark
  return (
    <img
      src="/images/soopify-mark.png"
      alt=""
      aria-hidden="true"
      width={Math.round(h * MARK_RATIO)}
      height={h}
      className={cn("w-auto shrink-0", className)}
      style={{ height: h }}
    />
  )
}

type LogoProps = {
  className?: string
  size?: Size
  /** 워드마크 없이 잎 마크만. */
  markOnly?: boolean
}

export function SoopifyLogo({ className, size = "md", markOnly = false }: LogoProps) {
  const s = SIZES[size]

  if (markOnly) {
    return (
      <span className={cn("inline-flex items-center", className)}>
        <SoopifyMark size={size} />
        <span className="sr-only">Soopify</span>
      </span>
    )
  }

  return (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      <SoopifyMark size={size} />
      <span
        className={cn(
          "font-semibold leading-none tracking-tight text-[#285030] dark:text-slate-50",
          s.word
        )}
      >
        Soopify
      </span>
    </span>
  )
}

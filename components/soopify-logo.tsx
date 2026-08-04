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

// 모바일에서 한 단계 작게 렌더한다. 헤더가 61px 밖에 안 되는데 마크가 44px 면
// 메뉴바가 두껍게 느껴진다. px 는 종횡비 계산용 기준값(데스크톱 크기)이다.
const SIZES = {
  sm: { mark: "h-6 md:h-7", px: 28, word: "text-base", gap: "gap-2" },
  md: { mark: "h-8 md:h-9", px: 36, word: "text-xl", gap: "gap-2.5" },
  lg: { mark: "h-9 md:h-10", px: 40, word: "text-3xl", gap: "gap-3" },
} as const

type Size = keyof typeof SIZES

export function SoopifyMark({ className, size = "md" }: { className?: string; size?: Size }) {
  const { mark, px } = SIZES[size]
  return (
    <img
      src="/images/soopify-mark.png"
      alt=""
      aria-hidden="true"
      // width/height 는 종횡비 힌트로만 쓰인다. 실제 크기는 아래 클래스가 정한다.
      width={Math.round(px * MARK_RATIO)}
      height={px}
      className={cn("w-auto shrink-0", mark, className)}
    />
  )
}

/** 락업 원본 종횡비 (트리밍 후 883 x 202) */
const LOCKUP_RATIO = 883 / 202

/**
 * 마크 + 워드마크가 한 장으로 그려진 공식 락업 이미지.
 *
 * 라이트/다크 두 장을 쓴다. 원본 워드마크 #2d5233 은 흰 배경에서 8.9:1 이지만
 * slate-950 에서는 2.27:1 이라 어두운 배경에서 흐리다. 다크용은 잎은 원본
 * 그대로 두고 글자만 slate-50 으로 바꾼 reversed 버전이다 (19.3:1).
 */
export function SoopifyLockup({ className, height = 32 }: { className?: string; height?: number }) {
  const width = Math.round(height * LOCKUP_RATIO)
  const common = { width, height, style: { height } }

  return (
    <>
      <img
        {...common}
        src="/images/soopify-lockup.png"
        alt="Soopify"
        className={cn("w-auto dark:hidden", className)}
      />
      <img
        {...common}
        src="/images/soopify-lockup-dark.png"
        alt=""
        aria-hidden="true"
        className={cn("hidden w-auto dark:block", className)}
      />
    </>
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

// components/theme-toggle.tsx
"use client"

import { useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

/** `<html class="dark">` 를 단일 진실 공급원으로 삼아 구독한다. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => observer.disconnect()
}

const getSnapshot = () => document.documentElement.classList.contains("dark")
// 서버는 사용자의 테마를 알 수 없다. 하이드레이션 직후 실제 값으로 교체된다.
const getServerSnapshot = () => null

/**
 * 라이트/다크 토글.
 *
 * app/layout.tsx 의 부팅 스크립트와 같은 방식으로 동작한다 —
 * `<html>` 의 dark 클래스를 직접 토글하고 localStorage.theme 에 기록한다.
 *
 * 예전에는 next-themes 를 쓰는 토글이 따로 있었는데 ThemeProvider 가 트리에
 * 없어서 setTheme 가 아무 일도 하지 않았다(그래서 /board 의 토글이 죽어
 * 있었다). 부팅 스크립트가 이미 이 규약을 쓰고 있으므로 여기에 맞추고,
 * next-themes 의존성은 제거했다.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function toggle() {
    const next = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", next)
    try {
      localStorage.setItem("theme", next ? "dark" : "light")
    } catch {
      // 프라이빗 모드 등에서 쓰기 실패해도 토글 자체는 동작해야 한다
    }
    // 클래스 변경은 MutationObserver 가 잡아서 리렌더한다
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="테마 전환"
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border",
        "bg-background/70 text-muted-foreground shadow-sm transition hover:bg-accent",
        "sm:h-10 sm:w-10",
        className
      )}
    >
      {/* 전환될 상태를 아이콘으로 보여준다: 다크면 해, 라이트면 달 */}
      {dark === null ? (
        <span className="h-5 w-5" />
      ) : dark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">라이트/다크 모드 전환</span>
    </button>
  )
}

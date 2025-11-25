"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 클라이언트 마운트 후에만 렌더링 (Hydration 에러 방지)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" aria-label="테마 전환">
        <div className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="테마 전환"
    >
      {isDark ? (
        // 다크 모드일 때 → 초승달 아이콘
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        // 라이트 모드일 때 → 햇님 아이콘
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">라이트/다크 모드 전환</span>
    </Button>
  )
}

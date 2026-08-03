// components/admin/admin-modal.tsx
"use client"

import { useEffect, useRef, useState, type ComponentType } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  KeyRound,
  LayoutGrid,
  Lightbulb,
  LogOut,
  Menu,
  MessageSquare,
  FileText,
  X,
} from "lucide-react"
import { SoopifyMark } from "@/components/soopify-logo"
import { useAdminModal } from "@/components/admin/admin-modal-provider"
import { AdminLoginPanel } from "@/components/admin/admin-login-panel"
import { InquiriesPanel } from "@/components/admin/panels/inquiries-panel"
import { PostsPanel } from "@/components/admin/panels/posts-panel"
import { InsightsPanel } from "@/components/admin/panels/insights-panel"
import { PasswordPanel } from "@/components/admin/panels/password-panel"
import { cn } from "@/lib/utils"

type SectionId = "dashboard" | "inquiries" | "posts" | "insights" | "password"

type Section = {
  id: SectionId
  label: string
  description: string
  icon: ComponentType<{ className?: string }>
  Panel?: ComponentType
}

const SECTIONS: Section[] = [
  {
    id: "inquiries",
    label: "문의 관리",
    description: "접수된 문의를 확인합니다.",
    icon: MessageSquare,
    Panel: InquiriesPanel,
  },
  {
    id: "posts",
    label: "공지사항 관리",
    description: "공지사항을 작성·수정·삭제합니다.",
    icon: FileText,
    Panel: PostsPanel,
  },
  {
    id: "insights",
    label: "Insights 관리",
    description: "메인에 노출할 블로그 글을 고릅니다.",
    icon: Lightbulb,
    Panel: InsightsPanel,
  },
  {
    id: "password",
    label: "계정 관리",
    description: "관리자 이메일과 비밀번호를 변경합니다.",
    icon: KeyRound,
    Panel: PasswordPanel,
  },
]

/**
 * 열려 있을 때만 내용을 마운트한다.
 *
 * 예전에는 AdminModal 이 항상 마운트된 채 open 이 false 면 null 을 반환했고,
 * 열릴 때마다 effect 안에서 setSection/setNavOpen 으로 상태를 되돌렸다.
 * effect 에서 동기적으로 setState 하면 렌더가 연쇄되므로, 열릴 때 새로
 * 마운트해서 useState 초기값이 곧 리셋이 되게 했다.
 */
export function AdminModal() {
  const { open } = useAdminModal()
  if (!open) return null
  return <AdminModalContent />
}

function AdminModalContent() {
  const router = useRouter()
  const { loading, session, closeModal, refresh } = useAdminModal()
  const [section, setSection] = useState<SectionId>("dashboard")
  const [navOpen, setNavOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // 배경 스크롤 잠금
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  // Esc 로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [closeModal])

  // 섹션이 바뀌면 본문을 맨 위로
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 })
  }, [section])

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (err) {
      console.error("Logout error:", err)
    }
    await refresh()
    closeModal()
    router.refresh()
  }

  const active = SECTIONS.find((s) => s.id === section)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="관리자"
      className="fixed inset-0 z-[100] flex items-stretch justify-center bg-black/50 backdrop-blur-sm md:items-center md:p-6"
      onMouseDown={(e) => {
        // 바깥 여백을 눌렀을 때만 닫는다 (드래그로 잘못 닫히지 않도록 mousedown 기준)
        if (e.target === e.currentTarget) closeModal()
      }}
    >
      {/* text-foreground 를 명시한다. 이 모달은 layout 에서 페이지 래퍼 밖에
          마운트되므로 색을 물려받을 조상이 body 뿐이다. */}
      <div className="flex h-full w-full flex-col overflow-hidden bg-background text-foreground shadow-2xl md:h-[88vh] md:max-w-6xl md:rounded-2xl md:border">
        {/* 모달 헤더 */}
        <header className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            {session.authenticated && (
              <button
                type="button"
                onClick={() => setNavOpen((v) => !v)}
                aria-label={navOpen ? "메뉴 닫기" : "메뉴 열기"}
                aria-expanded={navOpen}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:bg-accent md:hidden"
              >
                {navOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            )}
            <SoopifyMark size="sm" />
            <span className="text-sm font-semibold">관리자</span>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            {session.email && (
              <span className="hidden max-w-[220px] truncate text-sm text-muted-foreground sm:inline">
                {session.email}
              </span>
            )}
            {session.authenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition hover:bg-accent"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            )}
            <button
              type="button"
              onClick={closeModal}
              aria-label="닫기"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {loading ? (
          <p className="flex-1 py-20 text-center text-sm text-muted-foreground">인증 확인 중...</p>
        ) : !session.authenticated ? (
          <div className="flex-1 overflow-y-auto">
            <AdminLoginPanel />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1">
            {/* 사이드바 — 모바일에서는 헤더 버튼으로 여닫는다 */}
            <nav
              className={cn(
                "shrink-0 overflow-y-auto border-r bg-muted/30 p-3",
                "md:block md:w-56",
                navOpen
                  ? "absolute inset-x-0 top-[57px] bottom-0 z-10 block w-full bg-background"
                  : "hidden",
              )}
            >
              <SidebarItem
                icon={LayoutGrid}
                label="대시보드"
                active={section === "dashboard"}
                onClick={() => {
                  setSection("dashboard")
                  setNavOpen(false)
                }}
              />
              {SECTIONS.map((s) => (
                <SidebarItem
                  key={s.id}
                  icon={s.icon}
                  label={s.label}
                  active={section === s.id}
                  onClick={() => {
                    setSection(s.id)
                    setNavOpen(false)
                  }}
                />
              ))}
            </nav>

            {/* 본문 */}
            <div ref={panelRef} className="min-w-0 flex-1 overflow-y-auto p-4 md:p-8">
              {section === "dashboard" ? (
                <Dashboard onSelect={setSection} />
              ) : active?.Panel ? (
                <active.Panel />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SidebarItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
        active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-accent",
      )}
    >
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight className="h-4 w-4 shrink-0 opacity-40" />
    </button>
  )
}

function Dashboard({ onSelect }: { onSelect: (id: SectionId) => void }) {
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold tracking-tight md:text-2xl">관리자 대시보드</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map(({ id, label, description, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className="rounded-2xl border bg-card p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </span>
            <p className="font-semibold">{label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

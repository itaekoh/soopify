// components/admin/admin-modal-provider.tsx
"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { usePathname } from "next/navigation"

export type AdminSession = {
  authenticated: boolean
  email: string | null
  canChangePassword: boolean
}

type AdminModalContextValue = {
  open: boolean
  /** 인증 상태를 아직 모를 때 true */
  loading: boolean
  session: AdminSession
  openModal: () => void
  closeModal: () => void
  /** 로그인/로그아웃 후 서버 상태를 다시 읽는다 */
  refresh: () => Promise<AdminSession>
}

const EMPTY: AdminSession = { authenticated: false, email: null, canChangePassword: false }

const AdminModalContext = createContext<AdminModalContextValue | null>(null)

/** 관리자 모달을 열어둔 채로 진입할 때 쓰는 쿼리 파라미터 (`/?admin=1`) */
export const ADMIN_QUERY_KEY = "admin"

export function AdminModalProvider({ children }: { children: ReactNode }) {
  // useSearchParams 를 쓰면 이 프로바이더가 Suspense 경계를 요구하고, 앱 전체를
  // 그 안에 넣게 되면서 경계가 풀리지 않아 헤더까지 하이드레이션되지 않았다.
  // 쿼리는 window.location 에서 직접 읽는다 — 어차피 클라이언트 전용 관심사다.
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<AdminSession>(EMPTY)

  const refresh = useCallback(async (): Promise<AdminSession> => {
    try {
      const res = await fetch("/api/auth/check", { cache: "no-store" })
      const data = await res.json()
      const next: AdminSession = {
        authenticated: Boolean(data.authenticated),
        email: data.email ?? null,
        canChangePassword: Boolean(data.canChangePassword),
      }
      setSession(next)
      return next
    } catch {
      setSession(EMPTY)
      return EMPTY
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // /admin/* 에서 넘어오거나 링크를 직접 열었을 때 (`?admin=1`) 모달을 띄운다.
  // 주소는 곧바로 정리해서 새로고침 때 다시 열리지 않게 한다.
  // pathname 을 의존성에 둔 이유: 리다이렉트나 router.push 로 넘어오면 경로가
  // 바뀌므로 그때 다시 확인한다.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get(ADMIN_QUERY_KEY) !== "1") return

    setOpen(true)
    params.delete(ADMIN_QUERY_KEY)
    const query = params.toString()
    window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname)
  }, [pathname])

  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])

  const value = useMemo(
    () => ({ open, loading, session, openModal, closeModal, refresh }),
    [open, loading, session, openModal, closeModal, refresh],
  )

  return <AdminModalContext.Provider value={value}>{children}</AdminModalContext.Provider>
}

export function useAdminModal() {
  const ctx = useContext(AdminModalContext)
  if (!ctx) throw new Error("useAdminModal 은 AdminModalProvider 안에서만 쓸 수 있습니다.")
  return ctx
}

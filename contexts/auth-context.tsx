"use client"

import { useAdminModal } from "@/components/admin/admin-modal-provider"

/**
 * 인증 상태 조회용 얇은 어댑터.
 *
 * 예전에는 여기서 직접 /api/auth/check 를 불렀는데, 관리자 모달이 같은 것을
 * 부르면서 페이지마다 요청이 두 번 나갔다. 이제 세션의 단일 소스는
 * AdminModalProvider 이고 여기서는 필요한 필드만 꺼내 쓴다.
 *
 * 사용처: components/board-list.tsx, app/board/[id]/page.tsx (수정 버튼 노출용)
 */
export function useAuth() {
  const { session, loading, refresh } = useAdminModal()
  return {
    authenticated: session.authenticated,
    loading,
    checkAuth: refresh,
  }
}

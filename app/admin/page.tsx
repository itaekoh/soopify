// app/admin/page.tsx
import { redirect } from "next/navigation"

// 관리 화면은 헤더의 톱니바퀴로 여는 모달로 옮겼다
// (components/admin/admin-modal.tsx). 예전 주소로 들어오면 홈에서 모달을 연다.
export default function AdminRedirect() {
  redirect("/?admin=1")
}

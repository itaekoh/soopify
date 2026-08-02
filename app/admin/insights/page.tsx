import { redirect } from "next/navigation"

// 관리 화면은 헤더의 톱니바퀴로 여는 모달로 통합했다.
export default function AdminRedirect() {
  redirect("/?admin=1")
}

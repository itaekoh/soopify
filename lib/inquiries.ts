// lib/inquiries.ts
// 서버(API)와 클라이언트(관리자 패널)가 함께 쓰는 문의 상태 정의.

export const INQUIRY_STATUSES = ["new", "in_progress", "done"] as const
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number]

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "신규",
  in_progress: "처리중",
  done: "완료",
}

export function isInquiryStatus(value: unknown): value is InquiryStatus {
  return typeof value === "string" && (INQUIRY_STATUSES as readonly string[]).includes(value)
}

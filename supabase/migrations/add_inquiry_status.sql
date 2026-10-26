-- contact_inquiries 에 처리 상태 관리용 컬럼 추가
-- 작성일: 2026-10-26
--
-- Supabase Dashboard > SQL Editor 에서 실행한다 (README.md 참고).
-- 기존 문의는 모두 'new'(신규)로 시작한다.

ALTER TABLE contact_inquiries
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'in_progress', 'done')),
  ADD COLUMN IF NOT EXISTS memo text,
  ADD COLUMN IF NOT EXISTS handled_at timestamptz;

-- 상태별 목록 조회(최신순) 최적화
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status_created_at
ON contact_inquiries (status, created_at DESC);

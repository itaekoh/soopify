-- Supabase Posts 테이블 성능 최적화를 위한 인덱스 추가
-- 작성일: 2025-12-15

-- 1. created_at 컬럼에 내림차순 인덱스 추가
-- 게시글 목록 조회 시 ORDER BY created_at DESC 성능 향상
CREATE INDEX IF NOT EXISTS idx_posts_created_at_desc
ON posts (created_at DESC);

-- 2. author 컬럼에 인덱스 추가 (특정 작성자 게시글 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_posts_author
ON posts (author);

-- 3. 복합 인덱스: author + created_at (작성자별 최신 게시글 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_posts_author_created_at
ON posts (author, created_at DESC);

-- 인덱스 생성 완료 확인
-- 아래 쿼리로 생성된 인덱스 확인 가능:
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'posts';

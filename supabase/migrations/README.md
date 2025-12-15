# Supabase 데이터베이스 인덱스 추가 가이드

## 개요
게시판 성능을 대폭 향상시키기 위한 데이터베이스 인덱스를 추가합니다.

## 예상 성능 개선
- **게시글 목록 조회**: 70-90% 속도 향상
- **특정 작성자 게시글 필터링**: 80-95% 속도 향상
- **대량 데이터(1000+ 게시글)**: 10배 이상 속도 향상

## 적용 방법

### 방법 1: Supabase Dashboard (권장)

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard 접속
   - 프로젝트 선택

2. **SQL Editor 열기**
   - 왼쪽 메뉴에서 `SQL Editor` 클릭
   - 또는 `Database` > `SQL Editor` 선택

3. **SQL 스크립트 실행**
   - `New query` 버튼 클릭
   - `add_posts_indexes.sql` 파일의 내용을 복사하여 붙여넣기
   - 또는 아래 SQL을 직접 복사:

```sql
-- created_at 인덱스 (게시글 목록 정렬 최적화)
CREATE INDEX IF NOT EXISTS idx_posts_created_at_desc
ON posts (created_at DESC);

-- author 인덱스 (작성자별 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_posts_author
ON posts (author);

-- 복합 인덱스 (작성자별 최신 게시글 조회)
CREATE INDEX IF NOT EXISTS idx_posts_author_created_at
ON posts (author, created_at DESC);
```

4. **실행**
   - 우측 하단 `Run` 버튼 클릭 또는 `Ctrl + Enter`
   - "Success. No rows returned" 메시지 확인

### 방법 2: Supabase CLI (선택사항)

```bash
# Supabase CLI 설치 (아직 설치 안 했다면)
npm install -g supabase

# 프로젝트 링크
supabase link --project-ref <your-project-ref>

# 마이그레이션 실행
supabase db push
```

## 인덱스 생성 확인

SQL Editor에서 아래 쿼리 실행:

```sql
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'posts'
ORDER BY indexname;
```

**확인할 인덱스:**
- `idx_posts_created_at_desc`
- `idx_posts_author`
- `idx_posts_author_created_at`

## 성능 테스트

인덱스 적용 전후 비교:

```sql
-- 실행 계획 확인 (인덱스 사용 여부 확인)
EXPLAIN ANALYZE
SELECT * FROM posts
ORDER BY created_at DESC
LIMIT 10;
```

**인덱스 적용 전:**
- Seq Scan (전체 테이블 스캔) - 느림

**인덱스 적용 후:**
- Index Scan using idx_posts_created_at_desc - 빠름!

## 주의사항

1. **자동 생성된 인덱스**: `id` 컬럼은 Primary Key이므로 이미 인덱스가 있습니다.
2. **인덱스 비용**: 인덱스는 약간의 저장 공간을 사용하지만, 조회 성능이 대폭 향상됩니다.
3. **INSERT 성능**: 인덱스가 많으면 데이터 삽입 시 약간 느려질 수 있지만, 게시판은 읽기가 훨씬 많으므로 문제없습니다.

## 트러블슈팅

### 에러: "permission denied"
- Supabase Dashboard의 SQL Editor를 사용하세요 (자동으로 관리자 권한)

### 에러: "relation posts does not exist"
- posts 테이블이 생성되어 있는지 확인
- 올바른 프로젝트에 접속했는지 확인

## 추가 최적화 (선택사항)

### 전체 텍스트 검색 인덱스
게시글 제목/내용 검색 기능 추가 시:

```sql
-- 전체 텍스트 검색 인덱스
CREATE INDEX IF NOT EXISTS idx_posts_search
ON posts USING gin(to_tsvector('korean', title || ' ' || content));
```

### VACUUM ANALYZE (인덱스 최적화)
대량 데이터 작업 후 실행:

```sql
VACUUM ANALYZE posts;
```

## 완료!

인덱스 적용 후 웹사이트를 새로고침하여 속도 개선을 체감하세요!

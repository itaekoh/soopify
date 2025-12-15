# 데이터베이스 통합 전략

## 📊 현재 상황 분석

### Supabase 프로젝트 현황

#### 1. soopify DB (현재 사용 중)
```
프로젝트: soopify
주요 테이블:
- posts (공지사항) - 약 1-2개 게시글
- contact_inquiries (문의) - 약 10개 미만
- sn_* (SoopNote 전용) - 건드리면 안됨!

인증:
- Supabase Auth 사용
- 관리자 쿠키 기반 인증

문제점:
- soopnote와 테이블 공유 (sn_ 접두어)
- 향후 충돌 가능성
- 관리 복잡도 증가
```

#### 2. docnamu DB (통합 대상)
```
프로젝트: docnamu
주요 테이블:
- discussions (토론 게시판) - 많은 데이터
- discussion_comments (댓글)
- discussion_votes (투표)
- discussion_tags (태그)
- qna_* (Q&A 게시판)
- tree_hospitals (나무병원 정보) - 800개
- protected_trees (보호수 정보) - 5,234개
- 기타 11개 테이블 + 25개 인덱스

인증:
- Supabase Auth 사용
- 이미 사용자 데이터 존재 가능

장점:
- 이미 완성도 높은 스키마
- 최적화된 인덱스
- 실제 데이터 존재
```

#### 3. soopnote DB (독립)
```
프로젝트: soopify DB의 sn_ 테이블
상태: 별도 서비스, 건드리지 않음
```

---

## 🎯 최종 결정: **docnamu DB 사용**

### 선택 이유

#### ✅ 합리적인 근거
1. **데이터 마이그레이션 최소화**
   - docnamu: 11개 테이블 + 대량 데이터 → 마이그레이션 불필요
   - soopify: 2개 테이블 + 소량 데이터 → 쉽게 이전 가능

2. **soopnote 완전 분리**
   - soopnote는 계속 soopify DB 사용
   - 통합 프로젝트와 물리적으로 분리
   - 향후 충돌/혼란 방지

3. **스키마 완성도**
   - docnamu DB가 이미 최적화된 구조
   - 25개 인덱스, 트리거, RLS 정책 완비
   - 처음부터 다시 만들 필요 없음

4. **명확한 역할 분리**
   ```
   docnamu DB (새 통합 DB)
   └─ soopify.com (통합 플랫폼)

   soopify DB (기존 유지)
   └─ soopnote.com (독립 서비스)
   ```

---

## 🔄 마이그레이션 계획

### Phase 1: 준비 (1일)

#### soopify DB에서 가져올 데이터 확인
```sql
-- 1. posts 테이블 (공지사항)
SELECT COUNT(*) FROM posts;
-- 예상: 1-5개

-- 2. contact_inquiries 테이블 (문의)
SELECT COUNT(*) FROM contact_inquiries;
-- 예상: 10개 미만
```

#### docnamu DB 현황 파악
```sql
-- 기존 테이블 확인
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- 기존 사용자 확인
SELECT COUNT(*) FROM auth.users;
```

### Phase 2: docnamu DB 확장 (1일)

#### 새 테이블 추가
```sql
-- soopify 비즈니스 관련 테이블 추가
-- (docnamu에는 없던 것들)

-- 1. 공지사항 (posts 통합)
-- docnamu에 이미 공지사항 테이블 있는지 확인 필요
-- 없으면 생성, 있으면 soopify 데이터 병합

-- 2. 문의 (contact_inquiries)
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact VARCHAR(100) NOT NULL,
  org VARCHAR(200),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 관리자 인증 테이블 (필요시)
-- Supabase Auth 활용
```

### Phase 3: 데이터 이전 (1일)

#### 옵션 A: 수동 이전 (권장 - 데이터 적음)
```sql
-- soopify DB에서 추출
-- 1. SQL Editor에서 데이터 조회
-- 2. CSV 내보내기
-- 3. docnamu DB에서 가져오기

-- 또는 간단히 재생성
-- (게시글 1-2개면 그냥 다시 작성하는 게 빠름)
```

#### 옵션 B: 스크립트 이전
```javascript
// Node.js 스크립트로 데이터 복사
// 필요시 작성
```

### Phase 4: 환경변수 변경 (10분)

#### .env.local 수정
```bash
# 기존 (soopify DB)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# 변경 후 (docnamu DB)
NEXT_PUBLIC_SUPABASE_URL=https://docnamu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...(docnamu 키)
SUPABASE_SERVICE_ROLE_KEY=eyJ...(docnamu 키)
```

### Phase 5: 테스트 (1일)

#### 확인 사항
- [ ] 인증 작동 확인
- [ ] 기존 공지사항 표시 확인
- [ ] 문의 기능 작동 확인
- [ ] docnamu 기능들 정상 작동
- [ ] API 연결 확인

---

## 📋 최종 데이터베이스 구조

### docnamu DB (통합 메인 DB)

```sql
-- ========================================
-- 1. 인증 및 사용자 (Supabase Auth)
-- ========================================
auth.users                    -- Supabase 기본
profiles                      -- 사용자 프로필 확장

-- ========================================
-- 2. 커뮤니티 (기존 docnamu)
-- ========================================
discussions                   -- 토론 게시판
discussion_comments           -- 댓글
discussion_votes              -- 투표
discussion_tags               -- 태그
discussion_post_tags          -- 게시글-태그 연결
discussion_bookmarks          -- 북마크
discussion_post_views         -- 조회수

qna_questions                 -- Q&A 질문
qna_answers                   -- Q&A 답변
qna_votes                     -- Q&A 투표

-- ========================================
-- 3. 전국 현황 (기존 docnamu)
-- ========================================
tree_hospitals                -- 나무병원 정보
protected_trees               -- 보호수 정보
statistics                    -- 통계 데이터

-- ========================================
-- 4. 정보센터 (기존 docnamu + 추가)
-- ========================================
notices                       -- 공지사항 (posts 통합)
education_info                -- 교육 정보
news                          -- 뉴스
events                        -- 이벤트
regulations                   -- 법령/제도

-- ========================================
-- 5. 비즈니스 (soopify 추가)
-- ========================================
contact_inquiries             -- 상담 문의
service_requests              -- 서비스 의뢰 (향후)
projects                      -- 프로젝트 관리 (향후)

-- ========================================
-- 6. 공통
-- ========================================
categories                    -- 카테고리
tags                          -- 태그 마스터
attachments                   -- 첨부파일
```

### soopify DB (soopnote 전용)

```sql
-- ========================================
-- SoopNote 테이블 (건드리지 않음!)
-- ========================================
sn_notes
sn_folders
sn_tags
sn_... (기타 soopnote 테이블)
```

---

## ⚡ 실행 순서

### 1단계: 즉시 (오늘)
- [x] DB 전략 문서 작성
- [ ] docnamu DB 접속 키 확인
- [ ] 현재 soopify 데이터 백업

### 2단계: 내일
- [ ] docnamu DB에 부족한 테이블 추가
- [ ] soopify 소량 데이터 이전
- [ ] 환경변수 변경
- [ ] 로컬 테스트

### 3단계: 모레
- [ ] 통합 테스트
- [ ] 배포
- [ ] 모니터링

---

## 🔐 보안 고려사항

### API 키 관리
```bash
# docnamu DB 키 (새로 추가)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Vercel 환경변수도 업데이트 필요!
```

### RLS 정책
- docnamu의 기존 RLS 정책 검토
- soopify 관리자 권한 추가
- 테스트 철저히

---

## 🚨 리스크 및 대비책

### 리스크 1: 데이터 손실
**대비**:
- soopify DB 전체 백업
- docnamu DB 백업
- 마이그레이션 전 스냅샷

### 리스크 2: 인증 충돌
**대비**:
- 기존 사용자 확인
- 중복 이메일 처리 계획
- 테스트 계정으로 먼저 확인

### 리스크 3: 롤백 필요
**대비**:
- .env.local.backup 보관
- 언제든 soopify DB로 복귀 가능
- Vercel 이전 배포 버전 유지

---

## ✅ 체크리스트

### 마이그레이션 전
- [ ] soopify DB 백업 완료
- [ ] docnamu DB 백업 완료
- [ ] 데이터 양 확인 (posts, contact_inquiries)
- [ ] docnamu DB 키 확보
- [ ] .env.local 백업

### 마이그레이션 중
- [ ] 새 테이블 생성 확인
- [ ] 데이터 이전 완료
- [ ] 인덱스 생성 확인
- [ ] RLS 정책 적용

### 마이그레이션 후
- [ ] 로컬 테스트 통과
- [ ] 인증 작동 확인
- [ ] 모든 API 작동 확인
- [ ] Vercel 환경변수 업데이트
- [ ] Production 배포
- [ ] 모니터링 24시간

---

## 📞 다음 단계

1. **docnamu DB 접속 키 확인**
   - Supabase 대시보드에서 docnamu 프로젝트 API 키 확인
   - 메모해두기

2. **현재 데이터 확인**
   - soopify DB에서 posts, contact_inquiries 내보내기
   - 얼마나 있는지 확인

3. **승인 받기**
   - 이 전략으로 진행해도 되는지 확인
   - 추가 요구사항 있는지 확인

**결정해주세요:**
- ✅ docnamu DB로 통합 진행?
- ✅ soopify DB는 soopnote 전용으로 유지?
- ✅ 언제 시작할까요?

---

**작성일**: 2025-12-15
**최종 수정**: 2025-12-15
**상태**: 승인 대기

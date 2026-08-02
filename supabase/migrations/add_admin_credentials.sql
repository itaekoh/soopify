-- supabase/migrations/add_admin_credentials.sql
--
-- 관리자 비밀번호를 DB 에 보관한다.
--
-- 왜 필요한가: 로그인 비밀번호가 ADMIN_PASSWORD 환경변수라서 런타임에 바꿀 수
-- 없었다. 관리자 화면의 "비밀번호 변경" 이 동작하려면 쓰기 가능한 저장소가
-- 있어야 한다.
--
-- 이 테이블이 없어도 로그인은 계속 동작한다 (ADMIN_PASSWORD 로 폴백).
-- 다만 비밀번호 변경 기능은 이 마이그레이션을 실행해야 켜진다.
--
-- 실행: Supabase 대시보드 > SQL Editor 에 붙여넣고 Run

create table if not exists admin_credentials (
  -- 관리자는 한 명뿐이므로 항상 id = 1 인 단일 행만 존재한다
  id            smallint primary key default 1,
  password_hash text        not null,
  updated_at    timestamptz not null default now(),
  constraint admin_credentials_single_row check (id = 1)
);

-- anon/authenticated 키로는 접근할 수 없게 막는다.
-- 서버는 service_role 키로 접근하므로 RLS 를 우회한다.
alter table admin_credentials enable row level security;

comment on table admin_credentials is
  '관리자 비밀번호 해시(scrypt). 행은 항상 하나. 서버에서 service_role 로만 접근.';

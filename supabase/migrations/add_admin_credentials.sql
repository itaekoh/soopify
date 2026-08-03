-- supabase/migrations/add_admin_credentials.sql
--
-- 관리자 계정(이메일 + 비밀번호)을 DB 에 보관한다.
--
-- 예전에는 이메일은 ADMIN_EMAIL 환경변수, 비밀번호는 이 테이블에 있어서
-- 계정 정보가 두 곳으로 쪼개져 있었다. 이제 이 테이블이 단일 진실 공급원이고,
-- 환경변수는 행이 비었을 때 최초 1회 심는 씨앗으로만 쓴다.
--
-- 이미 이 테이블을 만든 적이 있어도 그대로 다시 실행할 수 있다 (멱등).
--
-- 실행: Supabase 대시보드 > SQL Editor 에 붙여넣고 Run

create table if not exists admin_credentials (
  -- 관리자는 한 명뿐이므로 항상 id = 1 인 단일 행만 존재한다
  id            smallint primary key default 1,
  password_hash text        not null,
  updated_at    timestamptz not null default now(),
  constraint admin_credentials_single_row check (id = 1)
);

-- 이메일: 예전 버전에는 없었다
alter table admin_credentials add column if not exists email text;

-- 세션 서명 키: 이게 있으면 쿠키 서명이 환경변수에 의존하지 않는다.
-- 최초 로그인 때 앱이 무작위로 생성해 넣는다.
alter table admin_credentials add column if not exists session_secret text;

-- anon/authenticated 키로는 접근할 수 없게 막는다.
-- 서버는 service_role 키로 접근하므로 RLS 를 우회한다.
alter table admin_credentials enable row level security;

comment on table admin_credentials is
  '관리자 계정. 이메일 + 비밀번호 해시(scrypt) + 세션 서명 키. 행은 항상 하나. service_role 로만 접근.';

-- 비밀번호를 잊었을 때: 아래를 실행하면 행이 지워지고, 다음 로그인에서
-- ADMIN_EMAIL / ADMIN_PASSWORD 환경변수로 다시 심어진다.
--   delete from admin_credentials where id = 1;

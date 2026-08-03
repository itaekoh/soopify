// lib/auth.ts
import { cookies } from "next/headers"
import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"
import { supabaseAdmin } from "@/lib/supabase"

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>

// 환경변수는 "씨앗"이다. admin_credentials 테이블이 비어 있을 때 최초 1회
// 로그인을 통과시키고 그 값을 DB 에 심는 용도로만 쓴다. 행이 생긴 뒤에는
// 완전히 무시된다.
//
// 예전에는 이메일이 환경변수, 비밀번호가 DB 에 있어서 계정 정보가 두 곳으로
// 쪼개져 있었다. 지금은 DB 가 단일 진실 공급원이다.
const SEED_EMAIL = process.env.ADMIN_EMAIL
const SEED_PASSWORD = process.env.ADMIN_PASSWORD

const AUTH_COOKIE_NAME = "soopify_admin_auth"
const SESSION_MS = 7 * 24 * 60 * 60 * 1000 // 7일
const TABLE = "admin_credentials"
const SCRYPT_KEYLEN = 64
const MIN_PASSWORD_LENGTH = 10

type Credentials = {
  email: string | null
  password_hash: string | null
  session_secret: string | null
}

// ─── 문자열 비교 ────────────────────────────────────────────────────────────
/** 상수 시간 비교. 길이가 다르면 즉시 false. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

const normalizeEmail = (v: string) => v.trim().toLowerCase()

// ─── 비밀번호 해시 ──────────────────────────────────────────────────────────
/** 저장 형식: `scrypt$<salt(hex)>$<hash(hex)>` */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const hash = await scrypt(password, salt, SCRYPT_KEYLEN)
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$")
  if (parts.length !== 3 || parts[0] !== "scrypt") return false

  const salt = Buffer.from(parts[1], "hex")
  const expected = Buffer.from(parts[2], "hex")
  if (salt.length === 0 || expected.length !== SCRYPT_KEYLEN) return false

  const actual = await scrypt(password, salt, SCRYPT_KEYLEN)
  return timingSafeEqual(actual, expected)
}

// ─── DB 접근 ────────────────────────────────────────────────────────────────
/** 저장된 관리자 계정. 테이블이 없거나 행이 없으면 null. */
async function readCredentials(): Promise<Credentials | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select("email, password_hash, session_secret")
      .eq("id", 1)
      .maybeSingle()

    if (error || !data) return null
    return data as Credentials
  } catch {
    return null
  }
}

/** 환경변수 값을 DB 에 심는다 (최초 1회). 실패해도 로그인 자체는 막지 않는다. */
async function seedCredentials(email: string, password: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from(TABLE).upsert({
      id: 1,
      email: normalizeEmail(email),
      password_hash: await hashPassword(password),
      session_secret: randomBytes(32).toString("hex"),
      updated_at: new Date().toISOString(),
    })
    if (error) console.error("관리자 계정 초기 저장 실패:", error.message)
  } catch (e) {
    console.error("관리자 계정 초기 저장 실패:", e)
  }
}

/** 계정 저장소를 쓸 수 있는지 (마이그레이션 실행 여부). */
export async function credentialsStoreReady(): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from(TABLE).select("id").limit(1)
    return !error
  } catch {
    return false
  }
}

// ─── 세션 토큰 ──────────────────────────────────────────────────────────────
// 쿠키에는 만료 시각과 HMAC 서명이 들어간다. 예전에는 "authenticated" 라는
// 고정 문자열만 넣어서, 누구나 같은 쿠키를 만들면 관리자 API 가 열렸다.
//
// 서명 키 우선순위: AUTH_SECRET > DB session_secret > 환경변수 파생(부트스트랩용).
// DB 에 키가 생기면 환경변수 없이도 세션이 유지된다.
async function signingKey(): Promise<string | null> {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET

  const row = await readCredentials()
  if (row?.session_secret) return row.session_secret

  if (SEED_EMAIL && SEED_PASSWORD) return `${SEED_EMAIL}:${SEED_PASSWORD}`
  return null
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("base64url")
}

/** 토큰 형식: `v1.<만료시각(ms)>.<HMAC>` */
export function createToken(key: string, expiresAt: number): string {
  const payload = `v1.${expiresAt}`
  return `${payload}.${sign(payload, key)}`
}

export function verifyToken(token: string, key: string, now = Date.now()): boolean {
  const parts = token.split(".")
  if (parts.length !== 3) return false

  const [version, expRaw, mac] = parts
  if (version !== "v1") return false

  const exp = Number(expRaw)
  if (!Number.isFinite(exp) || exp <= now) return false

  return safeEqual(mac, sign(`${version}.${expRaw}`, key))
}

// ─── 공개 API ───────────────────────────────────────────────────────────────
/** 화면에 표시할 관리자 이메일. DB 우선, 없으면 씨앗값. */
export async function adminEmail(): Promise<string | null> {
  const row = await readCredentials()
  return row?.email ?? SEED_EMAIL ?? null
}

export async function verifyAdmin(email: string, password: string): Promise<boolean> {
  const row = await readCredentials()

  // 저장된 계정이 있으면 그것만 본다.
  if (row?.email && row.password_hash) {
    const emailOk = safeEqual(normalizeEmail(email), normalizeEmail(row.email))
    const passwordOk = await verifyPassword(password, row.password_hash)
    return emailOk && passwordOk
  }

  // 저장된 계정이 없을 때만 환경변수로 통과시키고, 통과하면 DB 에 심는다.
  if (!SEED_EMAIL || !SEED_PASSWORD) {
    console.error(
      "관리자 계정이 없습니다. admin_credentials 행이 비었고 ADMIN_EMAIL/ADMIN_PASSWORD 도 없습니다.",
    )
    return false
  }

  const emailOk = safeEqual(normalizeEmail(email), normalizeEmail(SEED_EMAIL))
  const passwordOk = safeEqual(password, SEED_PASSWORD)
  if (emailOk && passwordOk) await seedCredentials(SEED_EMAIL, SEED_PASSWORD)
  return emailOk && passwordOk
}

/**
 * 관리자 계정 변경. 이메일만, 비밀번호만, 또는 둘 다 바꿀 수 있다.
 * 성공하면 null, 실패하면 사용자에게 보여줄 메시지를 돌려준다.
 */
export async function updateAdminCredentials(input: {
  currentPassword: string
  newEmail?: string
  newPassword?: string
}): Promise<string | null> {
  const { currentPassword, newEmail, newPassword } = input

  if (!(await credentialsStoreReady())) {
    return "계정 저장소가 준비되지 않았습니다. supabase/migrations/add_admin_credentials.sql 을 실행해주세요."
  }
  if (!newEmail && !newPassword) return "변경할 항목이 없습니다."
  if (newPassword && newPassword.length < MIN_PASSWORD_LENGTH) {
    return `새 비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`
  }
  if (newPassword && newPassword === currentPassword) {
    return "현재 비밀번호와 다른 값을 입력해주세요."
  }
  if (newEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim())) {
    return "이메일 형식이 올바르지 않습니다."
  }

  const row = await readCredentials()
  const currentEmail = row?.email ?? SEED_EMAIL
  if (!currentEmail) return "관리자 계정이 설정되지 않았습니다."

  if (!(await verifyAdmin(currentEmail, currentPassword))) {
    return "현재 비밀번호가 올바르지 않습니다."
  }

  // verifyAdmin 이 부트스트랩으로 행을 심었을 수 있으므로 다시 읽는다.
  const after = await readCredentials()

  const { error } = await supabaseAdmin.from(TABLE).upsert({
    id: 1,
    email: normalizeEmail(newEmail ?? currentEmail),
    password_hash: newPassword ? await hashPassword(newPassword) : after?.password_hash,
    session_secret: after?.session_secret ?? randomBytes(32).toString("hex"),
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error("관리자 계정 저장 실패:", error.message)
    return "계정 저장에 실패했습니다."
  }
  return null
}

export async function setAuthCookie() {
  const key = await signingKey()
  if (!key) throw new Error("세션 서명 키가 없습니다.")

  const expiresAt = Date.now() + SESSION_MS
  const cookieStore = await cookies()

  cookieStore.set(AUTH_COOKIE_NAME, createToken(key, expiresAt), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(expiresAt),
    sameSite: "lax",
    path: "/",
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false

  const key = await signingKey()
  if (!key) return false

  return verifyToken(token, key)
}

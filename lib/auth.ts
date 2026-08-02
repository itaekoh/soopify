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

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const AUTH_COOKIE_NAME = "soopify_admin_auth"
const SESSION_MS = 7 * 24 * 60 * 60 * 1000 // 7일
const CREDENTIALS_TABLE = "admin_credentials"

// ─── 세션 토큰 ──────────────────────────────────────────────────────────────
// 예전에는 쿠키에 "authenticated" 라는 고정 문자열만 넣고 그 값이 같은지 봤다.
// 서명이 없으니 누구나 같은 쿠키를 만들어 보내면 관리자 API 가 열렸다.
// 지금은 만료 시각에 HMAC 서명을 붙이고 서버에서 검증한다.
//
// 서명 키는 AUTH_SECRET 을 쓰고, 없으면 환경변수 자격증명에서 파생한다.
// (비밀번호를 DB 에서 바꿔도 이 키는 그대로라 기존 세션이 유지된다.)
function secret(): string | null {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET
  if (ADMIN_EMAIL && ADMIN_PASSWORD) return `${ADMIN_EMAIL}:${ADMIN_PASSWORD}`
  return null
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("base64url")
}

/** 상수 시간 비교. 길이가 다르면 즉시 false. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
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

// ─── 비밀번호 해시 ──────────────────────────────────────────────────────────
const SCRYPT_KEYLEN = 64

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

// ─── 저장된 자격증명 ────────────────────────────────────────────────────────
/**
 * DB 에 저장된 비밀번호 해시. 테이블이 없거나 행이 없으면 null 을 돌려주고,
 * 호출부는 ADMIN_PASSWORD 환경변수로 폴백한다.
 */
async function storedPasswordHash(): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from(CREDENTIALS_TABLE)
      .select("password_hash")
      .eq("id", 1)
      .maybeSingle()

    if (error) return null
    return data?.password_hash ?? null
  } catch {
    return null
  }
}

/** 비밀번호 변경 기능을 쓸 수 있는지 (마이그레이션 실행 여부). */
export async function passwordChangeAvailable(): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from(CREDENTIALS_TABLE).select("id").limit(1)
    return !error
  } catch {
    return false
  }
}

// ─── 공개 API ───────────────────────────────────────────────────────────────
export function adminEmail(): string | null {
  return ADMIN_EMAIL ?? null
}

export async function verifyAdmin(email: string, password: string): Promise<boolean> {
  if (!ADMIN_EMAIL) {
    console.error("ADMIN_EMAIL 이 설정되지 않았습니다.")
    return false
  }

  const emailOk = safeEqual(email.trim().toLowerCase(), ADMIN_EMAIL.trim().toLowerCase())

  const hash = await storedPasswordHash()
  let passwordOk: boolean
  if (hash) {
    passwordOk = await verifyPassword(password, hash)
  } else {
    if (!ADMIN_PASSWORD) {
      console.error("ADMIN_PASSWORD 가 설정되지 않았고 저장된 비밀번호도 없습니다.")
      return false
    }
    passwordOk = safeEqual(password, ADMIN_PASSWORD)
  }

  // 조기 반환으로 인한 타이밍 차이를 줄이기 위해 둘 다 평가한 뒤 판정한다.
  return emailOk && passwordOk
}

/** 비밀번호 변경. 성공하면 null, 실패하면 사용자에게 보여줄 메시지를 돌려준다. */
export async function changeAdminPassword(
  currentPassword: string,
  nextPassword: string,
): Promise<string | null> {
  if (!(await passwordChangeAvailable())) {
    return "비밀번호 저장소가 준비되지 않았습니다. supabase/migrations/add_admin_credentials.sql 을 실행해주세요."
  }
  if (!ADMIN_EMAIL) return "관리자 계정이 설정되지 않았습니다."
  if (nextPassword.length < 10) return "새 비밀번호는 10자 이상이어야 합니다."
  if (nextPassword === currentPassword) return "현재 비밀번호와 다른 값을 입력해주세요."

  if (!(await verifyAdmin(ADMIN_EMAIL, currentPassword))) {
    return "현재 비밀번호가 올바르지 않습니다."
  }

  const password_hash = await hashPassword(nextPassword)
  const { error } = await supabaseAdmin
    .from(CREDENTIALS_TABLE)
    .upsert({ id: 1, password_hash, updated_at: new Date().toISOString() })

  if (error) {
    console.error("Password update error:", error)
    return "비밀번호 저장에 실패했습니다."
  }
  return null
}

export async function setAuthCookie() {
  const key = secret()
  if (!key) throw new Error("AUTH_SECRET 또는 ADMIN_EMAIL/ADMIN_PASSWORD 가 필요합니다.")

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
  const key = secret()
  if (!key) return false

  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false

  return verifyToken(token, key)
}

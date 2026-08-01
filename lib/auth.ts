// lib/auth.ts
import { cookies } from "next/headers"
import { createHmac, timingSafeEqual } from "node:crypto"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const AUTH_COOKIE_NAME = "soopify_admin_auth"
const SESSION_MS = 7 * 24 * 60 * 60 * 1000 // 7일

// 이전 구현은 쿠키에 "authenticated" 라는 고정 문자열을 넣고 그 값이 같은지만
// 봤다. 서명이 없으니 누구나 같은 쿠키를 만들어 보내면 관리자 API 가 열렸다
// (문의 열람, 글 작성·수정·삭제, 파일 업로드). 이제 만료 시각에 HMAC 서명을
// 붙이고 서버에서 검증한다.
//
// 서명 키는 AUTH_SECRET 을 쓰고, 없으면 기존 관리자 자격증명에서 파생한다.
// 배포에 새 환경변수를 추가하지 않아도 바로 동작하게 하기 위함이며,
// 운영에서는 AUTH_SECRET 을 따로 두는 편이 낫다.
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

export async function verifyAdmin(email: string, password: string): Promise<boolean> {
  // 자격증명이 설정돼 있지 않으면 로그인 자체를 막는다.
  // (빈 값끼리 일치해서 통과되는 일이 없도록)
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("ADMIN_EMAIL / ADMIN_PASSWORD 가 설정되지 않았습니다.")
    return false
  }
  // 둘 다 평가해서 조기 반환에 따른 타이밍 차이를 줄인다.
  const emailOk = safeEqual(email, ADMIN_EMAIL)
  const passwordOk = safeEqual(password, ADMIN_PASSWORD)
  return emailOk && passwordOk
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

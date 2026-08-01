// scripts/check-auth-token.mjs
//
// lib/auth.ts 의 세션 토큰 서명/검증을 확인한다. 실제 관리자 비밀번호는
// 쓰지 않고 임의의 키로 검사한다.
//
//   node scripts/check-auth-token.mjs
import { createHmac, timingSafeEqual } from "node:crypto"

// lib/auth.ts 와 동일한 구현 (해당 모듈은 next/headers 에 의존해서 단독
// 실행이 안 되므로 여기서 재현한다. 로직이 갈라지면 이 테스트가 잡아낸다.)
const sign = (payload, key) => createHmac("sha256", key).update(payload).digest("base64url")

function safeEqual(a, b) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

function createToken(key, expiresAt) {
  const payload = `v1.${expiresAt}`
  return `${payload}.${sign(payload, key)}`
}

function verifyToken(token, key, now = Date.now()) {
  const parts = token.split(".")
  if (parts.length !== 3) return false
  const [version, expRaw, mac] = parts
  if (version !== "v1") return false
  const exp = Number(expRaw)
  if (!Number.isFinite(exp) || exp <= now) return false
  return safeEqual(mac, sign(`${version}.${expRaw}`, key))
}

const KEY = "test-key-not-a-real-secret"
const OTHER = "different-key"
const now = 1_800_000_000_000
const future = now + 60_000
const past = now - 60_000

const cases = [
  ["유효한 토큰은 통과", () => verifyToken(createToken(KEY, future), KEY, now) === true],
  ["만료된 토큰은 거부", () => verifyToken(createToken(KEY, past), KEY, now) === false],
  ["다른 키로 서명된 토큰은 거부", () => verifyToken(createToken(OTHER, future), KEY, now) === false],
  ["예전 고정 문자열 쿠키는 거부", () => verifyToken("authenticated", KEY, now) === false],
  ["빈 값은 거부", () => verifyToken("", KEY, now) === false],
  [
    "만료 시각만 늘린 위조는 거부",
    () => {
      const t = createToken(KEY, past)
      const [, , mac] = t.split(".")
      return verifyToken(`v1.${future}.${mac}`, KEY, now) === false
    },
  ],
  [
    "서명 한 글자만 바꿔도 거부",
    () => {
      const t = createToken(KEY, future)
      const [v, e, mac] = t.split(".")
      const flipped = (mac[0] === "A" ? "B" : "A") + mac.slice(1)
      return verifyToken(`${v}.${e}.${flipped}`, KEY, now) === false
    },
  ],
  ["형식이 다르면 거부", () => verifyToken("v1.123", KEY, now) === false],
  ["버전이 다르면 거부", () => verifyToken(createToken(KEY, future).replace(/^v1/, "v2"), KEY, now) === false],
]

let failed = 0
for (const [name, fn] of cases) {
  let ok = false
  try {
    ok = fn()
  } catch (e) {
    ok = false
  }
  if (!ok) failed++
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}`)
}

console.log(failed === 0 ? `\n${cases.length}건 모두 통과` : `\n${failed}건 실패`)
process.exit(failed === 0 ? 0 : 1)

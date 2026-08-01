// scripts/build-brand-assets.mjs
//
// assets/brand/ 의 원본에서 웹용 브랜드 에셋과 파비콘 세트를 생성한다.
// 원본을 교체하면 이 스크립트만 다시 돌리면 된다.
//
//   npm run brand
//
// 원본 (public/ 밖에 둔다 — 원본이 그대로 배포되지 않도록)
//   assets/brand/soopify-mark.png     885x663  잎 + 심전도 마크 (투명 PNG)
//   assets/brand/soopify-lockup.png  1024x558  마크 + 워드마크 (투명 PNG)
//   assets/brand/soopify-og.jpeg     1024x558  가로 락업 (흰 배경)
//   assets/brand/_archive/                     교체된 이전 시안
//
// 생성물
//   app/icon.png                       32x32 파비콘
//   app/favicon.ico                    16+32 PNG-in-ICO 폴백
//   app/apple-icon.png                 180x180, 흰 배경
//   public/images/soopify-mark.png     마크 (헤더용, 여백 트림)
//   public/images/soopify-lockup.png       마크 + 워드마크 (여백 트림)
//   public/images/soopify-lockup-dark.png  위와 동일하되 글자만 흰색 (reversed)
//   public/images/soopify-og.jpg           1200x630 OG 이미지
//
// 트리밍은 완전 투명한 여백만 잘라낸다. 잎의 색·형태는 어느 산출물에서도
// 원본 그대로이며, reversed 락업에서 글자 색만 치환한다(알파는 원본 재사용).
//
// 워드마크는 이미지로 굽지 않는다. 헤더는 components/soopify-logo.tsx 에서
// HTML 텍스트로 렌더한다 — 다크모드 색 전환과 선명도 때문.
import sharp from "sharp"
import { writeFile, mkdir } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const p = (...seg) => path.join(ROOT, ...seg)

const SRC_MARK = p("assets/brand/soopify-mark.png")
const SRC_LOCKUP = p("assets/brand/soopify-lockup.png")
const SRC_OG = p("assets/brand/soopify-og.jpeg")

/** 다크모드 reversed 락업의 워드마크 색 (slate-50, slate-950 대비 19.3:1) */
const DARK_WORDMARK = "#f8fafc"

await mkdir(p("public/images"), { recursive: true })

/** 알파 > 8 인 픽셀의 바운딩 박스 */
async function contentBox(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  let minX = w, minY = h, maxX = -1, maxY = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 8) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
}

/**
 * 락업에서 잎과 워드마크를 가르는 x 좌표.
 * 완전히 비어 있는 열(column) 중 가장 넓은 구간의 중앙을 경계로 삼는다.
 * 하드코딩하지 않으므로 원본을 다시 내보내도 따라간다.
 */
async function leafWordmarkSplit(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const empty = []
  for (let x = 0; x < w; x++) {
    let ink = false
    for (let y = 0; y < h && !ink; y++) if (data[(y * w + x) * 4 + 3] > 8) ink = true
    empty.push(!ink)
  }
  const gaps = []
  let start = null
  for (let x = 0; x < w; x++) {
    if (empty[x]) { if (start === null) start = x }
    else if (start !== null) { gaps.push([start, x - 1]); start = null }
  }
  if (!gaps.length) throw new Error("락업에서 잎/워드마크 경계를 찾지 못했다")
  const widest = gaps.reduce((a, b) => (b[1] - b[0] > a[1] - a[0] ? b : a))
  return Math.round((widest[0] + widest[1]) / 2)
}

const markBox = await contentBox(SRC_MARK)
const markTrim = await sharp(SRC_MARK).extract(markBox).png().toBuffer()

/**
 * 정사각 캔버스에 마크를 담는다.
 * 마크는 가로로 긴 잎(약 1.35:1)이라 정사각에서는 위아래 여백이 생긴다.
 * pad 는 캔버스 대비 여백 비율.
 */
async function square(size, { pad = 0.04, background = "#00000000" } = {}) {
  const inner = Math.round(size * (1 - pad * 2))
  const fitted = await sharp(markTrim).resize(inner, inner, { fit: "inside" }).png().toBuffer()
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: fitted, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

// ── 웹용 마크 ─────────────────────────────────────────────────────────────
// 헤더용은 여백 없이 딱 맞게 자른다. 정사각으로 만들면 잎이 세로 74%만
// 차지해서 헤더 높이를 그만큼 낭비한다. 정사각이 필요한 곳은 파비콘뿐.
await sharp(markTrim)
  .resize({ height: 256 })
  .png({ compressionLevel: 9 })
  .toFile(p("public/images/soopify-mark.png"))

// ── 가로 락업 (마크 + 워드마크) ───────────────────────────────────────────
// 원본은 1024x558 캔버스에 실제 그림이 883x202 뿐이라 그대로 쓰면 높이의
// 36%만 로고가 차지한다. 완전 투명한 여백만 잘라낸다 — 픽셀은 손대지 않는다.
{
  const box = await contentBox(SRC_LOCKUP)

  // 리사이즈를 먼저 끝내고 그 결과를 두 변형이 공유한다. 순서를 반대로 하면
  // 라이트/다크가 각자 리샘플링을 거쳐 잎에 미세한 오차가 남는다.
  const base = await sharp(SRC_LOCKUP)
    .extract(box)
    .resize({ height: 128 })
    .png()
    .toBuffer()

  await sharp(base).png({ compressionLevel: 9 }).toFile(p("public/images/soopify-lockup.png"))

  // 다크모드용 reversed 락업.
  // 워드마크 #2d5233 은 slate-950 대비 2.27:1 이라 어두운 배경에서 흐리다.
  // 잎은 그대로 두고(3.30:1 로 충분) 글자 영역의 RGB만 slate-50 으로 바꾼다.
  //
  // raw 버퍼를 직접 고친다. composite 로 합치면 sharp 가 premultiply /
  // unpremultiply 를 거치면서 반투명 픽셀의 RGB 를 미세하게 바꿔놓는다.
  // 이렇게 하면 경계 왼쪽은 바이트 단위로 동일하고, 알파는 전 영역 보존된다.
  const split = await leafWordmarkSplit(base)
  const { data, info } = await sharp(base).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: TW, height: TH } = info
  const [wr, wg, wb] = [1, 3, 5].map((i) => parseInt(DARK_WORDMARK.slice(i, i + 2), 16))

  for (let y = 0; y < TH; y++) {
    for (let x = split; x < TW; x++) {
      const i = (y * TW + x) * 4
      if (data[i + 3] === 0) continue // 완전 투명한 픽셀은 손대지 않는다
      data[i] = wr
      data[i + 1] = wg
      data[i + 2] = wb
    }
  }

  await sharp(data, { raw: { width: TW, height: TH, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(p("public/images/soopify-lockup-dark.png"))
}

// ── 파비콘 ────────────────────────────────────────────────────────────────
await writeFile(p("app/icon.png"), await square(32, { pad: 0 }))

const icoEntries = await Promise.all(
  [16, 32].map(async (size) => ({ size, png: await square(size, { pad: 0 }) }))
)
{
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(icoEntries.length, 4)

  let offset = 6 + icoEntries.length * 16
  const dir = []
  for (const { size, png } of icoEntries) {
    const e = Buffer.alloc(16)
    e.writeUInt8(size, 0)
    e.writeUInt8(size, 1)
    e.writeUInt8(0, 2)
    e.writeUInt8(0, 3)
    e.writeUInt16LE(1, 4)
    e.writeUInt16LE(32, 6)
    e.writeUInt32LE(png.length, 8)
    e.writeUInt32LE(offset, 12)
    offset += png.length
    dir.push(e)
  }
  await writeFile(p("app/favicon.ico"), Buffer.concat([header, ...dir, ...icoEntries.map((e) => e.png)]))
}

// apple-touch-icon: 투명은 구형 iOS에서 검게 나오므로 흰 배경
await writeFile(p("app/apple-icon.png"), await square(180, { pad: 0.08, background: "#ffffff" }))

// ── OG 이미지 ─────────────────────────────────────────────────────────────
// 원본은 1024x558(1.835:1). OG 권장은 1200x630(1.905:1)이므로
// 높이에 맞춰 키우고 좌우를 흰색으로 채운다.
{
  const W = 1200
  const H = 630
  const scaled = await sharp(SRC_OG).resize({ height: H }).toBuffer()
  const sw = (await sharp(scaled).metadata()).width

  await sharp({ create: { width: W, height: H, channels: 3, background: "#ffffff" } })
    .composite([{ input: scaled, left: Math.round((W - sw) / 2), top: 0 }])
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toFile(p("public/images/soopify-og.jpg"))
}

console.log("brand assets rebuilt from assets/brand/")

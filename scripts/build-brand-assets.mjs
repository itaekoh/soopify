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
// 생성물 중 하나는 원본 폴더로 되돌아간다:
//   assets/brand/soopify-lockup-restored.png  심전도를 복원한 락업 (1024x558).
//   Photoroom 파일의 드롭인 교체본. 외부에서 쓸 일이 있을 때 이걸 쓴다.
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
 * 그림이 실제로 있는 구간 안에서 가장 넓은 빈 열 구간의 중앙을 경계로 삼는다.
 * 하드코딩하지 않으므로 원본을 다시 내보내도 따라간다.
 *
 * 바깥 여백은 반드시 제외해야 한다. 트리밍 안 된 원본은 좌우 여백이
 * 잎/워드마크 사이 간격보다 넓어서, 그냥 훑으면 여백 한가운데를 경계로
 * 잡아버린다.
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

  const first = empty.indexOf(false)
  const last = empty.lastIndexOf(false)
  if (first === -1) throw new Error("락업이 비어 있다")

  const gaps = []
  let start = null
  for (let x = first; x <= last; x++) {
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

/** 알파는 그대로 두고 RGB 만 한 색으로 덮는다 (자형·안티앨리어싱 보존).
 *  composite 로 합치면 sharp 가 premultiply/unpremultiply 를 거치며 반투명
 *  픽셀의 RGB 를 미세하게 바꿔놓기 때문에 raw 버퍼를 직접 고친다. */
async function recolor(buf, hex) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue // 완전 투명한 픽셀은 손대지 않는다
    data[i] = r
    data[i + 1] = g
    data[i + 2] = b
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer()
}

// ── 가로 락업 (마크 + 워드마크) ───────────────────────────────────────────
// 락업 원본은 Photoroom 으로 흰 배경을 지운 파일인데, 심전도선도 흰색이라
// 배경으로 오인돼 잎 안쪽 흰 픽셀 425개가 같이 지워졌다(오른쪽 끝이 잘림).
// 라이트 배경에서는 흰 페이지와 섞여 안 보였지만 다크 배경에서 드러난다.
//
// 그래서 락업을 두 조각으로 재조립한다:
//   잎    — assets/brand/soopify-mark.png (배경 제거를 거치지 않아 온전함)
//   워드마크 — Photoroom 락업의 오른쪽 부분 (진한 초록이라 손상되지 않음)
// 배치 좌표는 하드코딩하지 않고 원본 락업에서 측정한 값을 그대로 쓴다.
{
  const lockupMeta = await sharp(SRC_LOCKUP).metadata()
  const CW = lockupMeta.width
  const CH = lockupMeta.height

  // 원본 락업에서 잎 / 워드마크 슬롯을 측정한다
  const split = await leafWordmarkSplit(SRC_LOCKUP)
  const full = await contentBox(SRC_LOCKUP)
  const leafSlot = await contentBox(
    await sharp(SRC_LOCKUP)
      .extract({ left: 0, top: 0, width: split, height: CH })
      .png()
      .toBuffer(),
  )

  // 워드마크는 원본 픽셀 그대로 잘라 쓴다
  const wordLeft = split
  const wordWidth = full.left + full.width - split
  const wordStrip = await sharp(SRC_LOCKUP)
    .extract({ left: wordLeft, top: 0, width: wordWidth, height: CH })
    .png()
    .toBuffer()

  // 온전한 마크를 잎 슬롯 높이에 맞춰 넣는다 (가로는 종횡비대로)
  const leaf = await sharp(markTrim).resize({ height: leafSlot.height }).png().toBuffer()

  const compose = async (word) =>
    sharp({ create: { width: CW, height: CH, channels: 4, background: "#00000000" } })
      .composite([
        { input: leaf, left: leafSlot.left, top: leafSlot.top },
        { input: word, left: wordLeft, top: 0 },
      ])
      .png()
      .toBuffer()

  const lightFull = await compose(wordStrip)
  const darkFull = await compose(await recolor(wordStrip, DARK_WORDMARK))

  // 복원된 락업을 원본과 같은 해상도(1024x558)로도 남긴다.
  // Photoroom 파일의 드롭인 교체본이며, 외부 문서·디자인 툴에서 쓸 수 있다.
  // (워드마크는 원본 픽셀 그대로, 잎만 온전한 마크에서 축소해 넣은 것)
  await sharp(lightFull)
    .png({ compressionLevel: 9 })
    .toFile(p("assets/brand/soopify-lockup-restored.png"))

  // 두 변형이 어긋나지 않도록 같은 박스로 자르고 같은 높이로 줄인다
  const box = await contentBox(lightFull)
  const finish = (buf, out) =>
    sharp(buf)
      .extract(box)
      .resize({ height: 128 })
      .png({ compressionLevel: 9 })
      .toFile(p(out))

  await finish(lightFull, "public/images/soopify-lockup.png")
  await finish(darkFull, "public/images/soopify-lockup-dark.png")
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

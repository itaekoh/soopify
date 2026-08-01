// scripts/build-brand-assets.mjs
//
// assets/brand/ 의 원본에서 웹용 브랜드 에셋과 파비콘 세트를 생성한다.
// 원본을 교체하면 이 스크립트만 다시 돌리면 된다.
//
//   npm run brand
//
// 원본 (public/ 밖에 둔다 — 원본이 그대로 배포되지 않도록)
//   assets/brand/soopify-mark.png   885x663  잎 + 심전도 마크 (투명 PNG)
//   assets/brand/soopify-og.jpeg   1024x558  가로 락업 (흰 배경)
//   assets/brand/_archive/                   교체된 이전 시안
//
// 생성물
//   app/icon.png                     32x32 파비콘
//   app/favicon.ico                  16+32 PNG-in-ICO 폴백
//   app/apple-icon.png               180x180, 흰 배경
//   public/images/soopify-mark.png   512x512 정사각 마크 (헤더·범용)
//   public/images/soopify-og.jpg     1200x630 OG 이미지
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
const SRC_OG = p("assets/brand/soopify-og.jpeg")

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

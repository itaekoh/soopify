// scripts/optimize-product-images.mjs
//
// assets/product/ 의 원본 목업에서 웹용 이미지를 생성한다.
//
//   npm run images
//
// 하는 일 세 가지
//  1. 원본 우하단의 AI 생성 워터마크(스파클)를 잘라낸다. 덧칠하면 티가 나므로
//     해당 영역을 crop 으로 제외한다. 픽셀을 만들어내지 않는다.
//  2. 두 이미지를 같은 종횡비 · 같은 픽셀 크기로 맞춘다. 그래야 카드 안에서
//     object-cover 크롭이 서로 다르게 걸리지 않는다.
//  3. 9MB PNG 를 웹용 JPEG 로 줄인다. 실제 렌더 크기는 559x380 이라
//     원본 2400~2800px 이 그대로 갈 이유가 없다.
import sharp from "sharp"
import { mkdir, stat } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const p = (...seg) => path.join(ROOT, ...seg)

const SRC_DIR = p("assets/product")
const OUT_DIR = p("public/images")

/** 카드 슬롯은 데스크톱에서 약 559x380(1.47)이다. 3:2 가 가장 가깝다. */
const ASPECT = 3 / 2
/** 레티나 2배 + 여유 */
const OUT_WIDTH = 1400
const OUT_HEIGHT = Math.round(OUT_WIDTH / ASPECT) // 933
const QUALITY = 82

/**
 * 워터마크는 우하단에 있다. 아래·오른쪽을 이만큼 버린 영역 안에서만
 * 3:2 창을 잡는다. 창의 가로 위치는 anchorX(피사체 중심)에 맞춘다.
 */
const SOURCES = [
  { file: "soopsite.png", dropRight: 0.12, dropBottom: 0.15, anchorX: 0.5 },
  { file: "soopreport.png", dropRight: 0.12, dropBottom: 0.15, anchorX: 0.46 },
]

await mkdir(OUT_DIR, { recursive: true })

for (const s of SOURCES) {
  const src = path.join(SRC_DIR, s.file)
  const name = s.file.replace(/\.[^.]+$/, "")
  const out = path.join(OUT_DIR, `${name}.jpg`)

  const { width: W, height: H } = await sharp(src).metadata()

  // 워터마크를 제외한 사용 가능 영역
  const usableW = Math.floor(W * (1 - s.dropRight))
  const usableH = Math.floor(H * (1 - s.dropBottom))

  // 그 안에 들어가는 최대 3:2 창
  let cropW = usableW
  let cropH = Math.round(cropW / ASPECT)
  if (cropH > usableH) {
    cropH = usableH
    cropW = Math.round(cropH * ASPECT)
  }

  // 세로는 위쪽 고정(아래를 버려야 워터마크가 빠진다), 가로는 anchorX 기준
  const top = 0
  const left = Math.max(0, Math.min(usableW - cropW, Math.round(W * s.anchorX - cropW / 2)))

  const before = (await stat(src)).size
  await sharp(src)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(OUT_WIDTH, OUT_HEIGHT, { fit: "cover" })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(out)
  const after = (await stat(out)).size

  const kb = (n) => `${Math.round(n / 1024)}KB`
  console.log(
    `${s.file} ${W}x${H} ${kb(before)}\n` +
      `  crop ${cropW}x${cropH} @ (${left},${top})  (우 ${W - (left + cropW)}px · 하 ${H - cropH}px 제외)\n` +
      `  -> ${name}.jpg ${OUT_WIDTH}x${OUT_HEIGHT} ${kb(after)}  (${Math.round((1 - after / before) * 100)}% 감소)`,
  )
}

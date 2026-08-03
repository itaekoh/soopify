// scripts/optimize-product-images.mjs
//
// assets/product/ 의 원본 목업에서 웹용 이미지를 생성한다.
//
//   npm run images
//
// 하는 일은 용량 최적화뿐이다. 원본 9MB PNG 를 그대로 서비스하면 랜딩 첫
// 화면에서 18MB 를 내려받게 되는데, 실제 렌더 크기는 559x380 이라 그럴
// 이유가 없다.
//
// 크롭하지 않는다. 이전에 우하단 AI 워터마크를 없애려고 그 영역을 잘라냈는데,
// 워터마크를 지우는 게 아니라 사진 하단을 버리는 결과가 됐다. 워터마크 제거는
// 원본 단계에서 처리하고, 여기서는 프레임을 손대지 않는다.
import sharp from "sharp"
import { readdir, mkdir, stat } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const p = (...seg) => path.join(ROOT, ...seg)

const SRC_DIR = p("assets/product")
const OUT_DIR = p("public/images")

/** 카드는 최대 559px 폭으로 렌더된다. 레티나 2배 + 여유로 1400px. */
const TARGET_WIDTH = 1400
const QUALITY = 82

await mkdir(OUT_DIR, { recursive: true })

const files = (await readdir(SRC_DIR)).filter((f) => /\.(png|jpe?g)$/i.test(f))
if (!files.length) {
  console.log("assets/product/ 에 원본이 없다")
  process.exit(0)
}

for (const file of files) {
  const src = path.join(SRC_DIR, file)
  const name = file.replace(/\.[^.]+$/, "")
  const out = path.join(OUT_DIR, `${name}.jpg`)

  const before = (await stat(src)).size
  const meta = await sharp(src).metadata()

  await sharp(src)
    .resize({ width: Math.min(TARGET_WIDTH, meta.width), withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(out)

  const after = (await stat(out)).size
  const outMeta = await sharp(out).metadata()
  const kb = (n) => `${Math.round(n / 1024)}KB`
  console.log(
    `${file} ${meta.width}x${meta.height} ${kb(before)}` +
      `  ->  ${name}.jpg ${outMeta.width}x${outMeta.height} ${kb(after)}` +
      `  (${Math.round((1 - after / before) * 100)}% 감소, 크롭 없음)`,
  )
}

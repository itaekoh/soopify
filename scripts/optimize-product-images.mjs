// scripts/optimize-product-images.mjs
//
// assets/ 아래 원본 이미지에서 웹용 이미지를 생성한다.
//
//   npm run images
//
// 하는 일은 용량 최적화뿐이다. 원본을 그대로 서비스하면 실제 렌더 크기보다
// 훨씬 큰 용량을 내려받게 되는데 그럴 이유가 없다.
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

const OUT_DIR = p("public/images")
const QUALITY = 82

const JOBS = [
  // 제품 카드는 최대 559px 폭으로 렌더된다. 레티나 2배 + 여유로 1400px.
  { srcDir: p("assets/product"), targetWidth: 1400 },
  // 히어로는 뷰포트 전체 폭 배경(h-[90vh])이라 카드보다 큰 폭이 필요하다.
  // 레티나 2배 기준 1920 뷰포트 + 여유로 2400px.
  { srcDir: p("assets/hero"), targetWidth: 2400 },
]

await mkdir(OUT_DIR, { recursive: true })

let processed = 0

for (const { srcDir, targetWidth } of JOBS) {
  const files = (await readdir(srcDir).catch(() => [])).filter((f) => /\.(png|jpe?g)$/i.test(f))
  if (!files.length) {
    console.log(`${path.relative(ROOT, srcDir)} 에 원본이 없다`)
    continue
  }

  for (const file of files) {
    const src = path.join(srcDir, file)
    const name = file.replace(/\.[^.]+$/, "")
    const out = path.join(OUT_DIR, `${name}.jpg`)

    const before = (await stat(src)).size
    const meta = await sharp(src).metadata()

    await sharp(src)
      .resize({ width: Math.min(targetWidth, meta.width), withoutEnlargement: true })
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
    processed++
  }
}

if (!processed) process.exit(0)

import { mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const sourceRoot = path.join(projectRoot, 'public', 'images', 'people')
const outputRoot = path.join(projectRoot, 'public', 'images', 'people-heatmap')
const maxDimension = 1280
const webpQuality = 86

async function collectWebpFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await collectWebpFiles(entryPath)))
      continue
    }

    if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.webp') {
      files.push(entryPath)
    }
  }

  return files
}

function outputPathFor(filePath) {
  return path.join(outputRoot, path.relative(sourceRoot, filePath))
}

async function optimize(filePath) {
  const outputPath = outputPathFor(filePath)
  await mkdir(path.dirname(outputPath), { recursive: true })

  await sharp(filePath, { limitInputPixels: false })
    .rotate()
    .resize({
      width: maxDimension,
      height: maxDimension,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({
      quality: webpQuality,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(outputPath)

  const [inputStats, outputStats] = await Promise.all([stat(filePath), stat(outputPath)])
  return { inputBytes: inputStats.size, outputBytes: outputStats.size, outputPath }
}

const imageFiles = await collectWebpFiles(sourceRoot)
let inputBytes = 0
let outputBytes = 0

for (const filePath of imageFiles) {
  const result = await optimize(filePath)
  inputBytes += result.inputBytes
  outputBytes += result.outputBytes

  const inputMb = (result.inputBytes / 1024 / 1024).toFixed(2)
  const outputMb = (result.outputBytes / 1024 / 1024).toFixed(2)
  console.log(
    `optimized ${path.relative(projectRoot, filePath)} -> ${path.relative(projectRoot, result.outputPath)} (${inputMb}MB -> ${outputMb}MB)`,
  )
}

const savedPercent = inputBytes === 0 ? 0 : (1 - outputBytes / inputBytes) * 100
console.log(
  `\nDone. Optimized ${imageFiles.length} images. ${(inputBytes / 1024 / 1024).toFixed(1)}MB -> ${(
    outputBytes /
    1024 /
    1024
  ).toFixed(1)}MB (${savedPercent.toFixed(1)}% smaller).`,
)

import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import heicConvert from 'heic-convert'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const peopleRoot = path.join(projectRoot, 'public', 'images', 'people')
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.heic'])

async function collectImageFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await collectImageFiles(entryPath)))
      continue
    }

    const extension = path.extname(entry.name).toLowerCase()
    if (entry.isFile() && imageExtensions.has(extension)) {
      files.push(entryPath)
    }
  }

  return files
}

function toWebpPath(filePath) {
  return path.join(path.dirname(filePath), `${path.basename(filePath, path.extname(filePath))}.webp`)
}

async function convertToWebp(filePath) {
  const outputPath = toWebpPath(filePath)
  const extension = path.extname(filePath).toLowerCase()

  if (extension === '.heic') {
    const inputBuffer = await readFile(filePath)
    const jpegBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 1,
    })

    await sharp(jpegBuffer, { limitInputPixels: false })
      .rotate()
      .webp({
        quality: 100,
        effort: 6,
        smartSubsample: false,
      })
      .toFile(outputPath)

    return outputPath
  }

  await sharp(filePath, { limitInputPixels: false })
    .rotate()
    .webp({
      quality: 100,
      effort: 6,
      smartSubsample: false,
    })
    .toFile(outputPath)

  return outputPath
}

const imageFiles = await collectImageFiles(peopleRoot)
let converted = 0
const failed = []

for (const filePath of imageFiles) {
  try {
    const outputPath = await convertToWebp(filePath)
    converted += 1
    console.log(`converted ${path.relative(projectRoot, filePath)} -> ${path.relative(projectRoot, outputPath)}`)
  } catch (error) {
    failed.push({ filePath, error })
    console.error(`failed ${path.relative(projectRoot, filePath)}: ${error.message}`)
  }
}

console.log(`\nDone. Converted ${converted}/${imageFiles.length} images.`)

if (failed.length > 0) {
  process.exitCode = 1
}

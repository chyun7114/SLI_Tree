import { mkdir, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const heatmapRoot = path.join(projectRoot, 'public', 'images', 'people-heatmap')
const thumbnailRoot = path.join(projectRoot, 'public', 'images', 'people-heatmap-thumbnails')
const valuesPath = path.join(projectRoot, 'src', 'data', 'values.ts')
const thumbnailMaxDimension = 520
const thumbnailQuality = 76
const tileRatios = [1, 4 / 3, 16 / 9]
const folders = ['integrity', 'value', 'professionalism', 'ai']

function nearestTileRatio(width, height) {
  const originalRatio = width / Math.max(height, 1)
  return tileRatios.reduce((closest, ratio) =>
    Math.abs(Math.log(originalRatio / ratio)) < Math.abs(Math.log(originalRatio / closest)) ? ratio : closest,
  )
}

async function collectWebpFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === '.webp')
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

async function preparePhotoMetadata(folderName, fileName) {
  const sourcePath = path.join(heatmapRoot, folderName, fileName)
  const thumbnailDirectory = path.join(thumbnailRoot, folderName)
  const thumbnailPath = path.join(thumbnailDirectory, fileName)
  const image = sharp(sourcePath, { limitInputPixels: false }).rotate()
  const metadata = await image.metadata()
  const width = metadata.width || 1
  const height = metadata.height || 1

  await mkdir(thumbnailDirectory, { recursive: true })
  await image
    .clone()
    .resize({
      width: thumbnailMaxDimension,
      height: thumbnailMaxDimension,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({
      quality: thumbnailQuality,
      effort: 5,
      smartSubsample: true,
    })
    .toFile(thumbnailPath)

  return {
    fileName,
    width,
    height,
    ratio: nearestTileRatio(width, height),
  }
}

function renderValuesFile(photoMetadataByFolder) {
  const folderBlocks = folders.map((folderName) => {
    const photos = photoMetadataByFolder[folderName]
      .map((photo) => `    { fileName: '${photo.fileName}', width: ${photo.width}, height: ${photo.height}, ratio: ${Number(photo.ratio.toFixed(4))} },`)
      .join('\n')

    return `  ${folderName}: [\n${photos}\n  ],`
  })

  return `import type { GrowthValue } from '../types/growth'

const peoplePhotoFiles = {
${folderBlocks.join('\n')}
} as const

function createPeoplePhotos(archiveId: GrowthValue['id'], folderName: keyof typeof peoplePhotoFiles) {
  return peoplePhotoFiles[folderName].map((photo, index) => {
    return {
      id: \`\${archiveId}-\${index + 1}\`,
      src: \`/images/people-heatmap/\${folderName}/\${photo.fileName}\`,
      thumbnailSrc: \`/images/people-heatmap-thumbnails/\${folderName}/\${photo.fileName}\`,
      alt: \`아카이브 사진 \${index + 1}\`,
      caption: \`\${index + 1}\`,
      width: photo.width,
      height: photo.height,
      ratio: photo.ratio,
    }
  })
}

export const growthValues: GrowthValue[] = [
  {
    id: 'droplet1',
    title: 'AI',
    archiveLabel: '사진 아카이브 1',
    modalVariant: 'heatmap',
    sphereOffset: { x: -30, y: -34 },
    photos: createPeoplePhotos('droplet1', 'ai'),
  },
  {
    id: 'droplet2',
    title: 'Integrity',
    archiveLabel: '사진 아카이브 2',
    modalVariant: 'heatmap',
    sphereOffset: { x: 22, y: -8 },
    photos: createPeoplePhotos('droplet2', 'integrity'),
  },
  {
    id: 'droplet3',
    title: 'Professionalism',
    archiveLabel: '사진 아카이브 3',
    modalVariant: 'heatmap',
    sphereOffset: { x: -46, y: 26 },
    photos: createPeoplePhotos('droplet3', 'professionalism'),
  },
  {
    id: 'droplet4',
    title: 'Value',
    archiveLabel: '사진 아카이브 4',
    modalVariant: 'heatmap',
    sphereOffset: { x: 36, y: 12 },
    photos: createPeoplePhotos('droplet4', 'value'),
  },
]
`
}

const photoMetadataByFolder = {}

for (const folderName of folders) {
  const fileNames = await collectWebpFiles(path.join(heatmapRoot, folderName))
  photoMetadataByFolder[folderName] = []

  for (const fileName of fileNames) {
    const photo = await preparePhotoMetadata(folderName, fileName)
    photoMetadataByFolder[folderName].push(photo)
    console.log(`prepared ${folderName}/${fileName}`)
  }
}

await writeFile(valuesPath, renderValuesFile(photoMetadataByFolder))
console.log('\nDone. Generated heatmap thumbnails and photo metadata.')

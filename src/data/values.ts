import type { GrowthValue } from '../types/growth'

function createArchivePhotos(archiveId: GrowthValue['id'], folderName: string, count = 30) {
  return Array.from({ length: count }, (_, index) => {
    const number = String(index + 1).padStart(2, '0')

    return {
      id: `${archiveId}-${number}`,
      src: `/images/archive/${folderName}/${number}.jpg`,
      alt: `아카이브 사진 ${index + 1}`,
      caption: `${index + 1}`,
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
    photos: createArchivePhotos('droplet1', 'droplet-1'),
  },
  {
    id: 'droplet2',
    title: 'Integrity',
    archiveLabel: '사진 아카이브 2',
    modalVariant: 'slider',
    sphereOffset: { x: 22, y: -8 },
    photos: createArchivePhotos('droplet2', 'droplet-2'),
  },
  {
    id: 'droplet3',
    title: 'Professionalism',
    archiveLabel: '사진 아카이브 3',
    modalVariant: 'heatmap',
    sphereOffset: { x: -46, y: 26 },
    photos: createArchivePhotos('droplet3', 'droplet-3'),
  },
  {
    id: 'droplet4',
    title: 'Value',
    archiveLabel: '사진 아카이브 4',
    modalVariant: 'slider',
    sphereOffset: { x: 36, y: 12 },
    photos: createArchivePhotos('droplet4', 'droplet-4'),
  },
]

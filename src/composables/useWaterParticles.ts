import { computed, ref } from 'vue'

interface AmbientDroplet {
  id: number
  keyword: string
  size: number
  keywordFontSize: number
  letterFontSize: number
  x: number
  y: number
  driftX: number
  driftY: number
  attractX: number
  attractY: number
  streamX: number
  streamY: number
  impactX: number
  seedX: number
  seedY: number
  delay: number
  duration: number
  opacity: number
}

export const AMBIENT_DROPLET_KEYWORDS = [
  '동기부여',
  '성장',
  'AI',
  '동기',
  '사랑',
  '열정',
  '교육',
  '자신감',
  '목표',
  '자극',
  '인사이트',
  '협업',
  '동료',
  '프로의식',
  '프로',
  '팀워크',
  '보험지식',
  '소속감',
  '보험업에 대한 이해',
  '경험',
  '발전',
  '자아성찰',
  '소통',
  '체력',
  '실력',
  '믿음',
  '연대감',
] as const

export function useWaterParticles(count = 24) {
  const seed = ref(Date.now())

  function createDroplet(id: number): AmbientDroplet {
    const keyword = AMBIENT_DROPLET_KEYWORDS[id % AMBIENT_DROPLET_KEYWORDS.length]
    const keywordLength = keyword.replace(/\s/g, '').length
    const keywordFontRatio =
      keywordLength <= 2
        ? 0.42
        : keywordLength <= 3
          ? 0.36
          : keywordLength <= 5
            ? 0.24
            : keywordLength <= 7
              ? 0.18
              : 0.12
    const keywordMinFontSize =
      keywordLength <= 3
        ? 6.2
        : keywordLength <= 5
          ? 5
          : keywordLength <= 7
            ? 4.2
            : 3.5
    const sizeOptions = [24, 26, 28, 30, 32, 36]
    const size = sizeOptions[Math.floor(Math.random() * sizeOptions.length)]
    const pullPoints = [
      { x: -68, y: -58 },
      { x: 78, y: -42 },
      { x: -82, y: 54 },
      { x: 72, y: 46 },
    ]
    const pullPoint = pullPoints[id % pullPoints.length]

    return {
      id,
      keyword,
      size,
      keywordFontSize: Math.max(keywordMinFontSize, size * keywordFontRatio * 0.9),
      letterFontSize: Math.max(6, size * 0.42),
      x: 8 + Math.random() * 84,
      y: 8 + Math.random() * 40,
      driftX: -22 + Math.random() * 44,
      driftY: -28 - Math.random() * 34,
      attractX: pullPoint.x + (-16 + Math.random() * 32),
      attractY: pullPoint.y + (-12 + Math.random() * 24),
      streamX: pullPoint.x * 1.25 + (-20 + Math.random() * 40),
      streamY: pullPoint.y * 0.55 + (-28 + Math.random() * 56),
      impactX: -54 + Math.random() * 108,
      seedX: -16 + Math.random() * 32,
      seedY: 6 + Math.random() * 14,
      delay: Math.random() * -9,
      duration: 6.4 + Math.random() * 5.6,
      opacity: 0.38 + Math.random() * 0.34,
    }
  }

  const droplets = computed(() => {
    seed.value
    return Array.from({ length: count }, (_, index) => createDroplet(index))
  })

  function refresh() {
    seed.value = Date.now()
  }

  return {
    droplets,
    refresh,
  }
}

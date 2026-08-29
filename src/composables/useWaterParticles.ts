import { computed, ref } from 'vue'

interface AmbientDroplet {
  id: number
  size: number
  x: number
  y: number
  driftX: number
  driftY: number
  attractX: number
  attractY: number
  streamX: number
  streamY: number
  delay: number
  duration: number
  opacity: number
}

export function useWaterParticles(count = 24) {
  const seed = ref(Date.now())

  function createDroplet(id: number): AmbientDroplet {
    const sizeOptions = [4, 5, 6, 8, 10, 12]
    const pullPoints = [
      { x: -68, y: -58 },
      { x: 78, y: -42 },
      { x: -82, y: 54 },
      { x: 72, y: 46 },
    ]
    const pullPoint = pullPoints[id % pullPoints.length]

    return {
      id,
      size: sizeOptions[Math.floor(Math.random() * sizeOptions.length)],
      x: 42 + Math.random() * 16,
      y: 30 + Math.random() * 24,
      driftX: -22 + Math.random() * 44,
      driftY: -28 - Math.random() * 34,
      attractX: pullPoint.x + (-16 + Math.random() * 32),
      attractY: pullPoint.y + (-12 + Math.random() * 24),
      streamX: pullPoint.x * 1.25 + (-20 + Math.random() * 40),
      streamY: pullPoint.y * 0.55 + (-28 + Math.random() * 56),
      delay: Math.random() * -12,
      duration: 8 + Math.random() * 7,
      opacity: 0.32 + Math.random() * 0.32,
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

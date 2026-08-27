import { computed, ref } from 'vue'

interface AmbientDroplet {
  id: number
  size: number
  x: number
  y: number
  driftX: number
  driftY: number
  delay: number
  duration: number
  opacity: number
}

export function useWaterParticles(count = 24) {
  const seed = ref(Date.now())

  function createDroplet(id: number): AmbientDroplet {
    const sizeOptions = [4, 6, 8, 10, 14, 18]

    return {
      id,
      size: sizeOptions[Math.floor(Math.random() * sizeOptions.length)],
      x: 16 + Math.random() * 68,
      y: 12 + Math.random() * 42,
      driftX: -28 + Math.random() * 56,
      driftY: -16 + Math.random() * 32,
      delay: Math.random() * -12,
      duration: 9 + Math.random() * 11,
      opacity: 0.35 + Math.random() * 0.38,
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

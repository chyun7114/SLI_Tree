<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useWaterParticles } from '../../composables/useWaterParticles'

const { droplets, refresh } = useWaterParticles(26)
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(refresh, 11800)
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<template>
  <div class="ambient-droplets" aria-hidden="true">
    <span
      v-for="droplet in droplets"
      :key="droplet.id"
      class="ambient-droplet"
      :style="{
        '--size': `${droplet.size}px`,
        '--x': `${droplet.x}%`,
        '--y': `${droplet.y}%`,
        '--drift-x': `${droplet.driftX}px`,
        '--drift-y': `${droplet.driftY}px`,
        '--delay': `${droplet.delay}s`,
        '--duration': `${droplet.duration}s`,
        '--opacity': droplet.opacity,
      }"
    ></span>
  </div>
</template>

<style scoped>
.ambient-droplets {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}

.ambient-droplet {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--size);
  height: var(--size);
  border-radius: 999px;
  opacity: var(--opacity);
  background:
    radial-gradient(circle at 32% 24%, rgba(255, 255, 255, 0.92) 0 14%, transparent 28%),
    radial-gradient(circle at 60% 70%, rgba(92, 203, 222, 0.34), transparent 46%),
    rgba(198, 246, 255, 0.3);
  box-shadow:
    inset 2px 3px 6px rgba(255, 255, 255, 0.45),
    inset -3px -4px 6px rgba(19, 84, 100, 0.2),
    0 8px 18px rgba(8, 42, 48, 0.16);
  animation: ambient-life var(--duration) ease-in-out var(--delay) infinite both;
}

@keyframes ambient-life {
  0% {
    opacity: 0;
    transform: translate3d(0, 0, 0) scale(0.82);
  }
  15% {
    opacity: var(--opacity);
  }
  62% {
    opacity: calc(var(--opacity) * 0.88);
    transform: translate3d(var(--drift-x), var(--drift-y), 0) scale(1.06);
  }
  100% {
    opacity: 0;
    transform: translate3d(calc(var(--drift-x) * 1.45), 58vh, 0) scale(0.52);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ambient-droplet {
    animation: none;
  }
}
</style>

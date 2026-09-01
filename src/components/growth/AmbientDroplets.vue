<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useWaterParticles } from '../../composables/useWaterParticles'

const { droplets, refresh } = useWaterParticles(28)
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(refresh, 8800)
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
        '--attract-x': `${droplet.attractX}px`,
        '--attract-y': `${droplet.attractY}px`,
        '--stream-x': `${droplet.streamX}px`,
        '--stream-y': `${droplet.streamY}px`,
        '--fall-x': `${droplet.fallX}px`,
        '--fall-y': `${droplet.fallY}vh`,
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
  z-index: 4;
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
  animation: ambient-life var(--duration) cubic-bezier(0.3, 0.02, 0.24, 1) var(--delay) infinite both;
  will-change: transform, opacity;
}

.ambient-droplet::after {
  position: absolute;
  left: 50%;
  bottom: -6px;
  width: 180%;
  height: 42%;
  border-radius: 999px;
  content: '';
  background: radial-gradient(ellipse, rgba(188, 240, 248, 0.38), transparent 68%);
  opacity: 0;
  transform: translateX(-50%) scaleX(0.3);
  animation: ambient-splash var(--duration) ease-out var(--delay) infinite both;
}

@keyframes ambient-life {
  0% {
    opacity: 0;
    transform: translate3d(0, -28px, 0) scale(0.32);
  }
  12% {
    opacity: var(--opacity);
    transform: translate3d(var(--drift-x), var(--drift-y), 0) scale(0.82);
  }
  44% {
    opacity: calc(var(--opacity) * 0.96);
    transform: translate3d(var(--attract-x), var(--attract-y), 0) scale(1.06);
  }
  70% {
    opacity: calc(var(--opacity) * 0.88);
    transform: translate3d(var(--stream-x), var(--stream-y), 0) scale(0.86);
  }
  92% {
    opacity: calc(var(--opacity) * 0.82);
    transform: translate3d(var(--fall-x), var(--fall-y), 0) scale(0.94, 1.08);
  }
  100% {
    opacity: 0;
    transform: translate3d(var(--fall-x), calc(var(--fall-y) + 20px), 0) scale(1.35, 0.18);
  }
}

@keyframes ambient-splash {
  0%,
  86% {
    opacity: 0;
    transform: translateX(-50%) scaleX(0.3);
  }
  94% {
    opacity: calc(var(--opacity) * 0.7);
    transform: translateX(-50%) scaleX(1);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) scaleX(1.45);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ambient-droplet,
  .ambient-droplet::after {
    animation: none;
  }
}
</style>

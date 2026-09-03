<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useWaterParticles } from '../../composables/useWaterParticles'

const { droplets, refresh } = useWaterParticles(10)
let timer: number | undefined

function getKeywordParticleStyle(droplet: { seedX: number; seedY: number }, index: number, count: number) {
  const center = (count - 1) / 2
  const side = index - center
  const wave = index % 2 === 0 ? -1 : 1
  const startSpacing = count === 2 ? 10 : 12
  const scatterSpacing = count === 2 ? 10 : 18

  return {
    '--letter-start-x': `${side * startSpacing}px`,
    '--letter-x': `${droplet.seedX + side * scatterSpacing}px`,
    '--letter-y': `${droplet.seedY + Math.abs(side) * 2.2 + wave * 8}px`,
    '--letter-rotate': `${side * 16 + wave * 22}deg`,
    '--letter-delay': `${index * 5}ms`,
  }
}

onMounted(() => {
  timer = window.setInterval(refresh, 17600)
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
        '--keyword-font-size': `${droplet.keywordFontSize}px`,
        '--letter-font-size': `${droplet.letterFontSize}px`,
        '--x': `${droplet.x}%`,
        '--y': `${droplet.y}vh`,
        '--drift-x': `${droplet.driftX}px`,
        '--drift-y': `${droplet.driftY}px`,
        '--attract-x': `${droplet.attractX}px`,
        '--attract-y': `${droplet.attractY}px`,
        '--stream-x': `${droplet.streamX}px`,
        '--stream-y': `${droplet.streamY}px`,
        '--impact-x': `${droplet.impactX}px`,
        '--seed-x': `${droplet.seedX}px`,
        '--seed-y': `${droplet.seedY}px`,
        '--delay': `${droplet.delay}s`,
        '--duration': `${droplet.duration}s`,
        '--opacity': droplet.opacity,
      }"
    >
      <span class="ambient-droplet__body">
        <span class="ambient-droplet__keyword">{{ droplet.keyword }}</span>
      </span>
      <span
        v-for="(letter, letterIndex) in droplet.keyword.split('')"
        :key="`${droplet.id}-${letterIndex}`"
        class="ambient-droplet__letter"
        :class="{ 'ambient-droplet__letter--space': letter === ' ' }"
        :style="getKeywordParticleStyle(droplet, letterIndex, droplet.keyword.length)"
      >
        {{ letter === ' ' ? '\u00a0' : letter }}
      </span>
    </span>
  </div>
</template>

<style scoped>
.ambient-droplets {
  --soil-height: clamp(132px, 21vh, 228px);
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  overflow: hidden;
}

.ambient-droplet {
  --fall-distance: calc(100svh - var(--soil-height) - var(--y) - var(--size));
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--size);
  height: var(--size);
  animation: ambient-path var(--duration) ease-in-out var(--delay) infinite both;
  will-change: transform;
}

.ambient-droplet__body {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background:
    radial-gradient(circle at 32% 24%, rgba(255, 255, 255, 0.92) 0 14%, transparent 28%),
    radial-gradient(circle at 60% 70%, rgba(92, 203, 222, 0.34), transparent 46%),
    rgba(198, 246, 255, 0.3);
  box-shadow:
    inset 2px 3px 6px rgba(255, 255, 255, 0.45),
    inset -3px -4px 6px rgba(19, 84, 100, 0.2),
    0 8px 18px rgba(8, 42, 48, 0.16);
  opacity: 0;
  overflow: hidden;
  animation: droplet-impact var(--duration) cubic-bezier(0.3, 0.02, 0.24, 1) var(--delay) infinite both;
  will-change: opacity, transform, filter;
}

.ambient-droplet__body::before {
  position: absolute;
  inset: 18% 14% auto auto;
  width: 28%;
  height: 34%;
  border-radius: 999px;
  content: '';
  background: rgba(255, 255, 255, 0.34);
  filter: blur(2px);
}

.ambient-droplet__body::after {
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

.ambient-droplet__keyword {
  position: relative;
  z-index: 1;
  max-width: calc(var(--size) - 2px);
  color: rgba(23, 75, 88, 0.58);
  font-size: var(--keyword-font-size);
  font-weight: 600;
  letter-spacing: 0.08em;
  line-height: 1.05;
  overflow: hidden;
  text-align: center;
  text-overflow: clip;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.66);
  white-space: nowrap;
  transform: translateZ(0);
  font-kerning: normal;
  animation: keyword-held var(--duration) ease-out var(--delay) infinite both;
}

.ambient-droplet__letter {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 2;
  color: rgba(76, 48, 28, 0.76);
  font-size: var(--letter-font-size);
  font-weight: 800;
  line-height: 1;
  opacity: 0;
  text-shadow: 0 2px 5px rgba(26, 16, 8, 0.12);
  transform: translate(calc(-50% + var(--letter-start-x)), -50%) scale(0.72);
  animation: keyword-scatter var(--duration) ease-out calc(var(--delay) + var(--letter-delay)) infinite both;
  will-change: opacity, transform, filter;
}

.ambient-droplet__letter--space {
  opacity: 0 !important;
}

@keyframes ambient-path {
  0% {
    transform: translate3d(0, -28px, 0) rotate(-3deg) scale(0.32);
  }
  12% {
    transform: translate3d(var(--drift-x), 0, 0) rotate(4deg) scale(0.82);
  }
  28% {
    transform: translate3d(calc(var(--attract-x) * 0.55 + 24px), calc(var(--fall-distance) * 0.18), 0) rotate(-5deg) scale(0.96);
  }
  44% {
    transform: translate3d(calc(var(--attract-x) * 0.55 - 24px), calc(var(--fall-distance) * 0.38), 0) rotate(5deg) scale(1.06);
  }
  58% {
    transform: translate3d(calc(var(--stream-x) * 0.5 + 28px), calc(var(--fall-distance) * 0.58), 0) rotate(-4deg) scale(0.98);
  }
  70% {
    transform: translate3d(calc(var(--stream-x) * 0.5 - 24px), calc(var(--fall-distance) * 0.76), 0) rotate(4deg) scale(0.86);
  }
  80% {
    transform: translate3d(calc(var(--impact-x) + 16px), calc(var(--fall-distance) * 0.9), 0) rotate(-2deg) scale(0.94);
  }
  88% {
    transform: translate3d(var(--impact-x), var(--fall-distance), 0) rotate(0deg) scale(0.94, 1.08);
  }
  100% {
    transform: translate3d(var(--impact-x), var(--fall-distance), 0) scale(1);
  }
}

@keyframes droplet-impact {
  0% {
    opacity: 0;
    transform: scale(1);
    filter: blur(0);
  }
  12% {
    opacity: var(--opacity);
    transform: scale(1);
  }
  84% {
    opacity: calc(var(--opacity) * 0.92);
    transform: scale(1);
  }
  88% {
    opacity: calc(var(--opacity) * 0.8);
    transform: scale(1.06, 0.7);
    filter: blur(0);
  }
  92% {
    opacity: calc(var(--opacity) * 0.28);
    transform: scale(1.75, 0.2);
    filter: blur(1px);
  }
  100% {
    opacity: 0;
    transform: scale(2.2, 0.08);
    filter: blur(3px);
  }
}

@keyframes keyword-held {
  0%,
  82% {
    opacity: 0.72;
    filter: blur(0);
    transform: translate3d(0, 0, 0);
  }
  88% {
    opacity: 0.56;
    transform: translate3d(0, 1px, 0);
  }
  100% {
    opacity: 0;
    filter: blur(1px);
    transform: translate3d(0, 3px, 0) scale(0.72);
  }
}

@keyframes keyword-scatter {
  0%,
  84% {
    opacity: 0;
    filter: blur(0);
    transform: translate(calc(-50% + var(--letter-start-x)), -50%) scale(0.72) rotate(0);
  }
  88% {
    opacity: 0.7;
    transform: translate(calc(-50% + var(--letter-start-x)), -50%) scale(0.9) rotate(0);
  }
  92% {
    opacity: 0.74;
    transform: translate(calc(-50% + var(--letter-start-x)), -50%) scale(0.92) rotate(0);
  }
  100% {
    opacity: 0;
    filter: blur(2px);
    transform: translate(calc(-50% + var(--letter-x)), calc(-50% + var(--letter-y))) scale(0.36) rotate(var(--letter-rotate));
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
  .ambient-droplet__body,
  .ambient-droplet__body::after,
  .ambient-droplet__keyword,
  .ambient-droplet__letter {
    animation: none;
  }
}
</style>

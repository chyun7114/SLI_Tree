<script setup lang="ts">
import { useWaterParticles } from '../../composables/useWaterParticles'

const { droplets } = useWaterParticles(10)

function getKeywordParticleStyle(droplet: { seedX: number; seedY: number; letterFontSize: number }, index: number, count: number) {
  const center = (count - 1) / 2
  const side = index - center
  const wave = index % 2 === 0 ? -1 : 1
  const startSpacing = Math.max(22, droplet.letterFontSize * (count === 2 ? 1.5 : 1.3))
  const scatterSpacing = Math.max(startSpacing + 12, droplet.letterFontSize * (count === 2 ? 2.4 : 2))

  return {
    '--letter-start-x': `${side * startSpacing * 0.7}px`,
    '--letter-x': `${droplet.seedX + side * scatterSpacing * 0.7}px`,
    '--letter-y': `${droplet.seedY + Math.abs(side) * 2.2 + wave * 8}px`,
    '--letter-rotate': `${side * 16 + wave * 22}deg`,
    '--letter-delay': `${index * 5}ms`,
  }
}

function getSplashStyle(size: number, index: number) {
  const angle = index * Math.PI / 4
  return {
    '--splash-x': `${Math.cos(angle) * size * 1.35}px`,
    '--splash-y': `${Math.sin(angle) * size * 0.95}px`,
  }
}
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
      <span class="ambient-droplet__burst-ring"></span>
      <span
        v-for="index in 8"
        :key="`splash-${index}`"
        class="ambient-droplet__splash"
        :style="getSplashStyle(droplet.size, index - 1)"
      ></span>
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
  background: transparent;
  opacity: 0;
  overflow: hidden;
  animation: droplet-impact var(--duration) cubic-bezier(0.3, 0.02, 0.24, 1) var(--delay) infinite both;
  will-change: opacity, transform, filter;
}

.ambient-droplet__body::before {
  position: absolute;
  inset: 0;
  content: '';
  background: url('/images/ambient-water-droplet.png') center / contain no-repeat;
}

.ambient-droplet__burst-ring {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(225, 249, 255, 0.95);
  border-radius: 50%;
  opacity: 0;
  box-shadow: 0 0 8px rgba(100, 193, 255, 0.7);
  animation: ambient-burst-ring var(--duration) ease-out var(--delay) infinite both;
}

.ambient-droplet__splash {
  position: absolute;
  left: 50%;
  top: 50%;
  width: calc(var(--size) * 0.18);
  height: calc(var(--size) * 0.18);
  border-radius: 50%;
  background: url('/images/ambient-water-droplet.png') center / cover no-repeat;
  opacity: 0;
  animation: ambient-splash var(--duration) ease-out var(--delay) infinite both;
}

.ambient-droplet__keyword {
  position: relative;
  z-index: 1;
  max-width: calc(var(--size) - 2px);
  color: #fff;
  font-size: var(--keyword-font-size);
  font-weight: 600;
  letter-spacing: 0.08em;
  line-height: 1.05;
  overflow: hidden;
  text-align: center;
  text-overflow: clip;
  text-shadow: 0 1px 3px rgba(0, 35, 90, 0.8);
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
  color: #fff;
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
  0%,
  86% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
  88% {
    opacity: 1;
    transform: scale(1.2, 0.65);
    filter: blur(0);
  }
  90% {
    opacity: 0.4;
    transform: scale(1.5, 1.15);
    filter: blur(1px);
  }
  92%,
  100% {
    opacity: 0;
    transform: scale(1.8, 1.4);
    filter: blur(3px);
  }
}

@keyframes keyword-held {
  0%,
  82% {
    opacity: 1;
    filter: blur(0);
    transform: translate3d(0, 0, 0);
  }
  84% {
    opacity: 0;
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
    opacity: 1;
    transform: translate(calc(-50% + var(--letter-start-x)), -50%) scale(0.9) rotate(0);
  }
  92% {
    opacity: 1;
    transform: translate(calc(-50% + var(--letter-start-x)), -50%) scale(0.92) rotate(0);
  }
  100% {
    opacity: 0;
    filter: blur(2px);
    transform: translate(calc(-50% + var(--letter-x)), calc(-50% + var(--letter-y))) scale(0.36) rotate(var(--letter-rotate));
  }
}

@keyframes ambient-burst-ring {
  0%,
  87% {
    opacity: 0;
    transform: scale(0.65);
  }
  89% {
    opacity: 0.95;
    transform: scale(1.1);
  }
  96%,
  100% {
    opacity: 0;
    transform: scale(2.6);
  }
}

@keyframes ambient-splash {
  0%,
  87% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.4);
  }
  89% {
    opacity: 1;
    transform: translate(calc(-50% + var(--splash-x) * 0.3), calc(-50% + var(--splash-y) * 0.3)) scale(1);
  }
  96%,
  100% {
    opacity: 0;
    transform: translate(calc(-50% + var(--splash-x)), calc(-50% + var(--splash-y))) scale(0.3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ambient-droplet,
  .ambient-droplet__body,
  .ambient-droplet__burst-ring,
  .ambient-droplet__splash,
  .ambient-droplet__keyword,
  .ambient-droplet__letter {
    animation: none;
  }
}
</style>

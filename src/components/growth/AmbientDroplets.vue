<script setup lang="ts">
import { useWaterParticles } from '../../composables/useWaterParticles'

const { droplets } = useWaterParticles(10)

function floorToFourPx(size: number) {
  return `${Math.max(4, Math.floor(size / 4) * 4)}px`
}

function getSoilImpactDepth(x: number) {
  if (x < 25) {
    if (x < 25 / 3) return 'clamp(96px, 15vh, 156px)'
    if (x < 50 / 3) return 'clamp(72px, 10vh, 112px)'
    return 'clamp(48px, 6vh, 76px)'
  }

  if (x > 75) {
    if (x > 100 - 25 / 3) return 'clamp(96px, 15vh, 156px)'
    if (x > 100 - 50 / 3) return 'clamp(72px, 10vh, 112px)'
    return 'clamp(48px, 6vh, 76px)'
  }

  return 'clamp(24px, 4vh, 48px)'
}

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
  const splashDistance = size * 2.052

  return {
    '--splash-x': `${Math.cos(angle) * splashDistance * 0.6}px`,
    '--splash-y': `${Math.sin(angle) * splashDistance * 0.42}px`,
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
        '--keyword-font-size': floorToFourPx(droplet.keywordFontSize * 1.5),
        '--letter-font-size': floorToFourPx(droplet.letterFontSize * 1.18),
        '--x': `${droplet.x}%`,
        '--y': `${droplet.y}vh`,
        '--drift-x': `${droplet.driftX}px`,
        '--drift-y': `${droplet.driftY}px`,
        '--attract-x': `${droplet.attractX}px`,
        '--attract-y': `${droplet.attractY}px`,
        '--stream-x': `${droplet.streamX}px`,
        '--stream-y': `${droplet.streamY}px`,
        '--impact-x': `${droplet.impactX}px`,
        '--soil-impact-depth': getSoilImpactDepth(droplet.x),
        '--seed-x': `${droplet.seedX}px`,
        '--seed-y': `${droplet.seedY}px`,
        '--delay': `${droplet.delay}s`,
        '--duration': `${droplet.duration}s`,
        '--opacity': droplet.opacity,
      }"
    >
      <span class="ambient-droplet__body">
        <img class="ambient-droplet__surface" src="/images/water-droplet.png" alt="" aria-hidden="true" />
        <span class="ambient-droplet__keyword">{{ droplet.keyword }}</span>
      </span>
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
  --droplet-frame: calc(var(--size) * 2.052);
  --soil-impact-depth: clamp(18px, 2.8vh, 30px);
  --pop-start: 91.69%;
  --pop-point-a: 93.02%;
  --pop-point-b: 94.68%;
  --pop-point-c: 96.51%;
  --label-point-a: 93.5%;
  --label-end: 95.62%;
  --surface-point-a: 93.18%;
  --surface-point-b: 94.85%;
  --surface-point-c: 96.84%;
  --fall-distance: calc(100svh - var(--soil-height) - var(--y) - var(--droplet-frame) + var(--soil-impact-depth));
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--droplet-frame);
  height: var(--droplet-frame);
  opacity: 0.7;
  animation: ambient-path var(--duration) ease-in-out var(--delay) infinite both;
  will-change: transform;
}

.ambient-droplet__body {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: transparent;
  opacity: 0;
  animation: ambient-pop-burst var(--duration) cubic-bezier(0.22, 0.78, 0.28, 1) var(--delay) infinite both;
  will-change: opacity, transform;
}

.ambient-droplet__surface {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 20px 34px rgba(9, 72, 92, 0.24));
  transform-origin: center;
  animation: ambient-click-wobble var(--duration) cubic-bezier(0.2, 0.8, 0.2, 1) var(--delay) infinite both;
  will-change: transform;
}

.ambient-droplet__keyword {
  position: absolute;
  left: 50%;
  top: 51%;
  z-index: 1;
  display: grid;
  min-width: 68%;
  max-width: 82%;
  min-height: 34%;
  place-items: center;
  padding: 0 9px;
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.96);
  background: radial-gradient(ellipse, rgba(20, 113, 147, 0.34), rgba(20, 113, 147, 0.08) 62%, transparent 72%);
  font-family: 'Jalnan2', var(--font-sans);
  font-size: var(--keyword-font-size);
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  text-shadow:
    0 1px 3px rgba(0, 49, 75, 0.82),
    0 0 10px rgba(0, 103, 145, 0.45),
    0 0 18px rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  animation: keyword-held var(--duration) ease-out var(--delay) infinite both;
  will-change: opacity, transform;
  pointer-events: none;
}

.ambient-droplet__splash {
  position: absolute;
  left: 50%;
  top: 72%;
  width: calc(var(--droplet-frame) * 0.08);
  height: calc(var(--droplet-frame) * 0.08);
  border-radius: 50%;
  background: url('/images/water-droplet.png') center / cover no-repeat;
  opacity: 0;
  animation: ambient-splash var(--duration) ease-out var(--delay) infinite both;
}

.ambient-droplet__letter {
  position: absolute;
  left: 50%;
  top: 51%;
  z-index: 2;
  color: rgba(255, 255, 255, 0.98);
  font-family: 'Jalnan2', var(--font-sans);
  font-size: var(--letter-font-size);
  font-weight: 800;
  line-height: 1;
  opacity: 0;
  text-shadow:
    0 1px 3px rgba(0, 49, 75, 0.82),
    0 0 10px rgba(0, 103, 145, 0.4);
  transform: translate(calc(-50% + var(--letter-start-x)), -50%) scale(0.72);
  animation: keyword-scatter var(--duration) ease-out calc(var(--delay) + var(--letter-delay)) infinite both;
  will-change: opacity, transform;
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
  91.69% {
    transform: translate3d(var(--impact-x), var(--fall-distance), 0) rotate(0deg) scale(1);
  }
  100% {
    transform: translate3d(var(--impact-x), var(--fall-distance), 0) scale(1);
  }
}

@keyframes ambient-pop-burst {
  0%,
  91.69% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
  93.02% {
    transform: translate3d(0, -5px, 0) scale(1.08, 0.94);
  }
  94.68% {
    opacity: 1;
    transform: translate3d(0, 3px, 0) scale(0.9, 1.12);
  }
  96.51% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1.04);
  }
  100% {
    opacity: 0;
    transform: translate3d(0, 18px, 0) scale(0.26);
  }
}

@keyframes ambient-click-wobble {
  0%,
  91.69% {
    transform: scale(1, 1);
  }
  93.18% {
    transform: scale(1.1, 0.92);
  }
  94.85% {
    transform: scale(0.9, 1.13);
  }
  96.84% {
    transform: scale(1.04, 0.98);
  }
  100% {
    transform: scale(1, 1);
  }
}

@keyframes keyword-held {
  0%,
  91.69% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  93.5% {
    opacity: 0.78;
    transform: translate(-50%, -50%) scale(1.08);
  }
  95.62%,
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.82);
  }
}

@keyframes keyword-scatter {
  0%,
  91.69% {
    opacity: 0;
    transform: translate(calc(-50% + var(--letter-start-x)), -50%) scale(0.78) rotate(0);
  }
  93.5% {
    opacity: 1;
    transform: translate(calc(-50% + var(--letter-start-x)), -50%) scale(1.04) rotate(0);
  }
  96.51% {
    opacity: 1;
    transform: translate(calc(-50% + var(--letter-start-x)), -50%) scale(0.96) rotate(0);
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% + var(--letter-x)), calc(-50% + var(--letter-y))) scale(0.36) rotate(var(--letter-rotate));
  }
}

@keyframes ambient-splash {
  0%,
  91.69% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.38);
  }
  93.5% {
    opacity: 0.95;
    transform: translate(calc(-50% + var(--splash-x) * 0.28), calc(-50% + var(--splash-y) * 0.28)) scale(1);
  }
  96.51% {
    opacity: 0.72;
    transform: translate(calc(-50% + var(--splash-x) * 0.64), calc(-50% + var(--splash-y) * 0.64)) scale(0.72);
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% + var(--splash-x)), calc(-50% + var(--splash-y))) scale(0.25);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ambient-droplet,
  .ambient-droplet__body,
  .ambient-droplet__surface,
  .ambient-droplet__keyword,
  .ambient-droplet__splash,
  .ambient-droplet__letter {
    animation: none;
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import type { BurstOrigin } from '../../types/growth'

const props = defineProps<{
  origin: BurstOrigin | null
  absorbKey: number
}>()

const burstParticles = computed(() => {
  if (!props.origin) return []

  return Array.from({ length: 32 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 32 + Math.random() * 0.36
    const distance = 38 + Math.random() * 96

    return {
      id: `${props.origin?.id}-${index}`,
      size: 5 + Math.random() * 12,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance + 84 + Math.random() * 210,
      delay: Math.random() * 130,
      duration: 900 + Math.random() * 700,
      opacity: 0.48 + Math.random() * 0.36,
    }
  })
})
</script>

<template>
  <div class="water-effects" aria-hidden="true">
    <template v-if="origin">
      <span
        v-for="particle in burstParticles"
        :key="particle.id"
        class="burst-particle"
        :style="{
          '--x': `${origin.x}px`,
          '--y': `${origin.y}px`,
          '--tx': `${particle.tx}px`,
          '--ty': `${particle.ty}px`,
          '--size': `${particle.size}px`,
          '--delay': `${particle.delay}ms`,
          '--duration': `${particle.duration}ms`,
          '--opacity': particle.opacity,
        }"
      ></span>
    </template>

    <span :key="absorbKey" class="absorption-ring"></span>
    <span :key="`dark-${absorbKey}`" class="absorption-shadow"></span>
  </div>
</template>

<style scoped>
.water-effects {
  position: fixed;
  inset: 0;
  z-index: 7;
  pointer-events: none;
}

.burst-particle {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--size);
  height: var(--size);
  border-radius: 999px;
  opacity: 0;
  background:
    radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.94) 0 18%, transparent 32%),
    rgba(147, 230, 244, 0.72);
  box-shadow:
    inset -2px -3px 4px rgba(18, 91, 109, 0.22),
    0 8px 18px rgba(15, 68, 78, 0.2);
  animation: burst-fall var(--duration) cubic-bezier(0.12, 0.64, 0.24, 1) var(--delay) forwards;
}

.absorption-ring,
.absorption-shadow {
  position: absolute;
  left: 50%;
  bottom: 18%;
  width: 180px;
  height: 42px;
  border-radius: 999px;
  transform: translate(-50%, 50%) scale(0.28);
  opacity: 0;
}

.absorption-ring {
  border: 1px solid rgba(138, 219, 225, 0.34);
  background: radial-gradient(ellipse, rgba(85, 151, 139, 0.22), transparent 64%);
  animation: absorb-ring 920ms ease-out forwards;
}

.absorption-shadow {
  background: radial-gradient(ellipse, rgba(24, 47, 33, 0.26), transparent 68%);
  filter: blur(7px);
  animation: wet-soil 1500ms ease-out forwards;
}

@keyframes burst-fall {
  0% {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0) scale(0.35);
  }
  14% {
    opacity: var(--opacity);
    transform: translate3d(calc(var(--tx) * 0.32 - 50%), calc(var(--ty) * -0.1 - 50%), 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate3d(calc(var(--tx) - 50%), calc(var(--ty) - 50%), 0) scale(0.42);
  }
}

@keyframes absorb-ring {
  0% {
    opacity: 0;
    transform: translate(-50%, 50%) scale(0.22);
  }
  35% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, 50%) scale(1.35);
  }
}

@keyframes wet-soil {
  0%,
  10% {
    opacity: 0;
    transform: translate(-50%, 50%) scale(0.34);
  }
  38% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.18;
    transform: translate(-50%, 50%) scale(1.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .burst-particle,
  .absorption-ring,
  .absorption-shadow {
    animation-duration: 1ms;
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import type { GrowthValue, ValueState } from '../../types/growth'

interface Props {
  value: GrowthValue
  state: ValueState
  disabled: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [value: GrowthValue, event: MouseEvent | KeyboardEvent]
}>()

function select(event: MouseEvent | KeyboardEvent) {
  if (props.disabled || props.state !== 'idle') return
  emit('select', props.value, event)
}

const filterId = computed(() => `water-droplet-wobble-${props.value.id}`)
const filterUrl = computed(() => `url(#${filterId.value})`)
const labelSize = computed(() => {
  if (props.value.title === 'Professionalism') return 'clamp(0.82rem, 1.25vw, 1.08rem)'
  if (props.value.title === 'Integrity') return 'clamp(1rem, 1.45vw, 1.28rem)'
  return 'clamp(1.18rem, 1.65vw, 1.52rem)'
})
</script>

<template>
  <button
    class="value-sphere"
    :class="[`value-sphere--${state}`]"
    type="button"
    :disabled="disabled || state !== 'idle'"
    :aria-label="`${value.archiveLabel} 열기`"
    :style="{
      '--offset-x': `${value.sphereOffset.x}px`,
      '--offset-y': `${value.sphereOffset.y}px`,
      '--wobble-filter': filterUrl,
      '--label-size': labelSize,
    }"
    @click="select"
    @keydown.enter.prevent="select"
    @keydown.space.prevent="select"
  >
    <svg class="value-sphere__filter" aria-hidden="true" focusable="false">
      <filter :id="filterId" x="-8%" y="-8%" width="116%" height="116%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="8">
          <animate
            attributeName="baseFrequency"
            dur="7s"
            values="0.012 0.018; 0.018 0.012; 0.01 0.02; 0.012 0.018"
            repeatCount="indefinite"
          />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G">
          <animate attributeName="scale" dur="5.8s" values="2; 4; 2.6; 3" repeatCount="indefinite" />
        </feDisplacementMap>
      </filter>
    </svg>
    <img class="value-sphere__surface" src="/images/water-droplet.png" alt="" aria-hidden="true" />
    <span class="value-sphere__label">{{ value.title }}</span>
  </button>
</template>

<style scoped>
.value-sphere {
  --sphere-size: clamp(112px, 13vw, 176px);
  --float-duration: 7.6s;
  --orbit-x-a: 12px;
  --orbit-y-a: -9px;
  --orbit-x-b: -14px;
  --orbit-y-b: 10px;
  --orbit-rotate-a: 1.4deg;
  --orbit-rotate-b: -1.1deg;
  --orbit-scale-a: 1.018;
  --orbit-scale-b: 0.988;
  --orbit-x-c: 6px;
  --orbit-y-c: 6px;
  --orbit-rotate-c: -0.9deg;
  position: relative;
  width: var(--sphere-size);
  height: var(--sphere-size);
  border: 0;
  border-radius: 999px;
  padding: 0;
  color: rgba(232, 249, 255, 0.96);
  background: transparent;
  cursor: pointer;
  transform: translate(var(--offset-x), var(--offset-y));
  transform-origin: center;
  transition:
    opacity 420ms ease,
    filter 420ms ease;
  -webkit-tap-highlight-color: transparent;
}

.value-sphere:focus-visible {
  outline: 2px solid rgba(228, 249, 255, 0.86);
  outline-offset: 8px;
}

.value-sphere:disabled {
  cursor: default;
}

.value-sphere--idle {
  animation: droplet-float var(--float-duration) ease-in-out infinite;
}

.value-sphere:nth-child(1) {
  --float-duration: 8.8s;
  --orbit-x-a: 15px;
  --orbit-y-a: -12px;
  --orbit-x-b: -10px;
  --orbit-y-b: 13px;
  --orbit-rotate-a: 1.7deg;
  --orbit-rotate-b: -1.3deg;
  --orbit-scale-a: 1.02;
  --orbit-scale-b: 0.982;
  --orbit-x-c: 5px;
  --orbit-y-c: 7px;
  --orbit-rotate-c: -1deg;
}

.value-sphere:nth-child(2) {
  --float-duration: 7.1s;
  --orbit-x-a: -13px;
  --orbit-y-a: -8px;
  --orbit-x-b: 17px;
  --orbit-y-b: 11px;
  --orbit-rotate-a: -1.5deg;
  --orbit-rotate-b: 1.9deg;
  --orbit-scale-a: 1.026;
  --orbit-scale-b: 0.986;
  --orbit-x-c: -8px;
  --orbit-y-c: 6px;
  --orbit-rotate-c: 0.9deg;
}

.value-sphere:nth-child(3) {
  --float-duration: 9.7s;
  --orbit-x-a: 18px;
  --orbit-y-a: 9px;
  --orbit-x-b: -15px;
  --orbit-y-b: -11px;
  --orbit-rotate-a: 1.2deg;
  --orbit-rotate-b: -1.8deg;
  --orbit-scale-a: 1.014;
  --orbit-scale-b: 0.978;
  --orbit-x-c: 7px;
  --orbit-y-c: -6px;
  --orbit-rotate-c: -0.8deg;
}

.value-sphere:nth-child(4) {
  --float-duration: 6.6s;
  --orbit-x-a: -16px;
  --orbit-y-a: 12px;
  --orbit-x-b: 12px;
  --orbit-y-b: -10px;
  --orbit-rotate-a: -1.9deg;
  --orbit-rotate-b: 1.1deg;
  --orbit-scale-a: 1.022;
  --orbit-scale-b: 0.984;
  --orbit-x-c: -5px;
  --orbit-y-c: -7px;
  --orbit-rotate-c: 0.7deg;
}

.value-sphere__filter {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.value-sphere__surface {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: var(--wobble-filter) drop-shadow(0 20px 34px rgba(9, 72, 92, 0.24));
  transform-origin: center;
  animation: droplet-slosh 4.9s ease-in-out infinite;
}

.value-sphere__label {
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
  font-size: var(--label-size);
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
  transition:
    opacity 180ms ease,
    transform 180ms ease,
    filter 180ms ease;
  pointer-events: none;
}

.value-sphere--idle:hover {
  filter: brightness(1.05);
}

.value-sphere--idle:hover .value-sphere__surface {
  animation-duration: 3.2s;
}

.value-sphere--bursting {
  pointer-events: none;
  animation: droplet-pop-burst 760ms cubic-bezier(0.22, 0.78, 0.28, 1) forwards;
}

.value-sphere--bursting .value-sphere__surface {
  animation: droplet-click-wobble 760ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.value-sphere--bursting .value-sphere__label {
  animation: label-pop-away 360ms ease forwards;
}

.value-sphere--memory,
.value-sphere--absorbing {
  opacity: 0;
  pointer-events: none;
  transform: translate(var(--offset-x), calc(var(--offset-y) + 24px)) scale(0.7);
}

.value-sphere--completed {
  pointer-events: none;
  opacity: 0.22;
  filter: grayscale(0.1);
}

.value-sphere--completed .value-sphere__surface,
.value-sphere--completed .value-sphere__label {
  opacity: 0;
}

@keyframes droplet-float {
  0%,
  100% {
    transform: translate(var(--offset-x), var(--offset-y)) translate3d(0, 0, 0) rotate(-0.7deg) scale(1);
  }
  28% {
    transform: translate(var(--offset-x), var(--offset-y)) translate3d(var(--orbit-x-a), var(--orbit-y-a), 0)
      rotate(var(--orbit-rotate-a)) scale(var(--orbit-scale-a));
  }
  58% {
    transform: translate(var(--offset-x), var(--offset-y)) translate3d(var(--orbit-x-b), var(--orbit-y-b), 0)
      rotate(var(--orbit-rotate-b)) scale(var(--orbit-scale-b));
  }
  82% {
    transform: translate(var(--offset-x), var(--offset-y)) translate3d(var(--orbit-x-c), var(--orbit-y-c), 0)
      rotate(var(--orbit-rotate-c)) scale(1.006);
  }
}

@keyframes droplet-slosh {
  0%,
  100% {
    transform: scale(1, 1) rotate(0deg);
  }
  45% {
    transform: scale(1.024, 0.982) rotate(0.8deg);
  }
  70% {
    transform: scale(0.988, 1.018) rotate(-0.9deg);
  }
}

@keyframes droplet-click-wobble {
  0% {
    transform: scale(1, 1);
  }
  18% {
    transform: scale(1.1, 0.92);
  }
  38% {
    transform: scale(0.9, 1.13);
  }
  62% {
    transform: scale(1.04, 0.98);
  }
  100% {
    transform: scale(1, 1);
  }
}

@keyframes droplet-pop-burst {
  0% {
    opacity: 1;
    transform: translate(var(--offset-x), var(--offset-y)) scale(1);
  }
  16% {
    transform: translate(var(--offset-x), calc(var(--offset-y) - 5px)) scale(1.08, 0.94);
  }
  36% {
    opacity: 1;
    transform: translate(var(--offset-x), calc(var(--offset-y) + 3px)) scale(0.9, 1.12);
  }
  58% {
    opacity: 1;
    transform: translate(var(--offset-x), var(--offset-y)) scale(1.04);
  }
  100% {
    opacity: 0;
    transform: translate(var(--offset-x), calc(var(--offset-y) + 18px)) scale(0.26);
    filter: blur(8px);
  }
}

@keyframes label-pop-away {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  55% {
    opacity: 0.78;
    transform: translate(-50%, -50%) scale(1.08);
    filter: blur(0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.82);
    filter: blur(5px);
  }
}

@media (max-width: 760px) {
  .value-sphere {
    --sphere-size: clamp(94px, 32vw, 132px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .value-sphere,
  .value-sphere__surface {
    animation: none;
    transition-duration: 1ms;
  }
}
</style>

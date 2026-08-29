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

const labelSize = computed(() => {
  if (props.value.id === 'professionalism') return 'clamp(0.48rem, 2.35vw, 1rem)'
  if (props.value.id === 'integrity') return 'clamp(0.76rem, 2.7vw, 1.22rem)'
  if (props.value.id === 'value') return 'clamp(0.92rem, 3.2vw, 1.36rem)'
  return 'clamp(1.06rem, 3.4vw, 1.48rem)'
})
</script>

<template>
  <button
    class="value-sphere"
    :class="[`value-sphere--${state}`]"
    type="button"
    :disabled="disabled || state !== 'idle'"
    :aria-label="`${value.title} memory archive open`"
    :style="{
      '--offset-x': `${value.sphereOffset.x}px`,
      '--offset-y': `${value.sphereOffset.y}px`,
      '--label-size': labelSize,
    }"
    @click="select"
    @keydown.enter.prevent="select"
    @keydown.space.prevent="select"
  >
    <span class="value-sphere__surface"></span>
    <span class="value-sphere__label">{{ value.title }}</span>
  </button>
</template>

<style scoped>
.value-sphere {
  --sphere-size: clamp(112px, 13vw, 176px);
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
  transition:
    opacity 420ms ease,
    transform 520ms cubic-bezier(0.2, 0.8, 0.2, 1),
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

.value-sphere__surface {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  background:
    radial-gradient(circle at 29% 24%, rgba(255, 255, 255, 0.95) 0 7%, rgba(255, 255, 255, 0.34) 8% 16%, transparent 28%),
    radial-gradient(circle at 68% 76%, rgba(63, 189, 216, 0.4), transparent 32%),
    radial-gradient(circle at 40% 62%, rgba(174, 239, 255, 0.4), transparent 38%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(99, 204, 231, 0.2) 42%, rgba(16, 82, 100, 0.16));
  box-shadow:
    inset 14px 18px 24px rgba(255, 255, 255, 0.42),
    inset -22px -18px 28px rgba(14, 76, 94, 0.2),
    inset 0 0 38px rgba(255, 255, 255, 0.26),
    0 20px 44px rgba(9, 36, 39, 0.28);
  backdrop-filter: blur(4px) saturate(1.2);
  animation: sphere-breathe 5.6s ease-in-out infinite;
}

.value-sphere__surface::before,
.value-sphere__surface::after {
  position: absolute;
  content: '';
  border-radius: 999px;
  pointer-events: none;
}

.value-sphere__surface::before {
  inset: 10%;
  background:
    radial-gradient(circle at 42% 30%, rgba(255, 255, 255, 0.24), transparent 24%),
    linear-gradient(110deg, transparent 0 38%, rgba(255, 255, 255, 0.24) 46%, transparent 56% 100%);
  filter: blur(1px);
  opacity: 0.75;
  transform: rotate(-10deg);
  animation: refraction-slide 8s ease-in-out infinite alternate;
}

.value-sphere__surface::after {
  inset: 5%;
  border: 1px solid rgba(255, 255, 255, 0.46);
  box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.34);
  opacity: 0.72;
}

.value-sphere__label {
  position: relative;
  z-index: 1;
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  padding: 14%;
  font-size: clamp(1.02rem, 1.55vw, 1.45rem);
  font-size: var(--label-size);
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  text-shadow:
    0 1px 2px rgba(3, 29, 36, 0.45),
    0 0 14px rgba(255, 255, 255, 0.38);
}

.value-sphere--idle:hover {
  transform: translate(var(--offset-x), var(--offset-y)) scale(1.045);
  filter: brightness(1.05);
}

.value-sphere--idle:hover .value-sphere__surface {
  animation-duration: 2.9s;
}

.value-sphere--bursting {
  pointer-events: none;
  animation: sphere-collapse 720ms cubic-bezier(0.22, 0.78, 0.28, 1) forwards;
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

@keyframes sphere-breathe {
  0%,
  100% {
    transform: scale(1);
    border-radius: 50%;
  }
  45% {
    transform: scale(1.012, 0.992);
    border-radius: 49% 51% 50% 50%;
  }
  70% {
    transform: scale(0.993, 1.01);
  }
}

@keyframes refraction-slide {
  from {
    transform: translate(-3%, 2%) rotate(-10deg);
  }
  to {
    transform: translate(4%, -3%) rotate(8deg);
  }
}

@keyframes sphere-collapse {
  0% {
    opacity: 1;
    transform: translate(var(--offset-x), var(--offset-y)) scale(1);
  }
  23% {
    transform: translate(var(--offset-x), var(--offset-y)) scale(0.9, 1.08);
  }
  45% {
    opacity: 1;
    transform: translate(var(--offset-x), var(--offset-y)) scale(1.12, 0.96);
  }
  100% {
    opacity: 0;
    transform: translate(var(--offset-x), calc(var(--offset-y) + 18px)) scale(0.26);
    filter: blur(8px);
  }
}

@media (max-width: 760px) {
  .value-sphere {
    --sphere-size: clamp(94px, 32vw, 132px);
  }

  .value-sphere__label {
    font-size: var(--label-size);
  }
}

@media (prefers-reduced-motion: reduce) {
  .value-sphere,
  .value-sphere__surface,
  .value-sphere__surface::before {
    animation: none;
    transition-duration: 1ms;
  }
}
</style>

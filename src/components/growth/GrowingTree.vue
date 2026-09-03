<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    stage: number
    growthKey: number
    canEnterForest?: boolean
    isEnteringForest?: boolean
  }>(),
  {
    canEnterForest: false,
    isEnteringForest: false,
  },
)

const emit = defineEmits<{
  enterForest: [event: MouseEvent | KeyboardEvent]
}>()

const visibleStage = computed(() => Math.min(Math.max(props.stage, 0), 4))
const treeSrc = computed(() => (visibleStage.value > 0 ? `/images/tree/나무_${visibleStage.value}단계.png` : ''))

function enterForest(event: MouseEvent | KeyboardEvent) {
  if (!props.canEnterForest || props.isEnteringForest) return
  emit('enterForest', event)
}
</script>

<template>
  <div
    v-if="visibleStage > 0"
    :key="growthKey"
    class="growing-tree"
    :class="[
      `growing-tree--stage-${visibleStage}`,
      {
        'growing-tree--can-enter': canEnterForest,
        'growing-tree--entering': isEnteringForest,
      },
    ]"
    :role="canEnterForest ? 'button' : undefined"
    :tabindex="canEnterForest && !isEnteringForest ? 0 : undefined"
    :aria-label="canEnterForest ? '숲 안으로 들어가기' : 'Growing tree'"
    :aria-disabled="canEnterForest ? isEnteringForest : undefined"
    @click="enterForest"
    @keydown.enter.prevent="enterForest"
    @keydown.space.prevent="enterForest"
  >
    <div class="growing-tree__shadow"></div>
    <img
      class="growing-tree__image"
      :src="treeSrc"
      alt=""
      draggable="false"
    />
  </div>
</template>

<style scoped>
.growing-tree {
  --tree-width: clamp(130px, 14.3vw, 211px);
  --tree-height: clamp(207px, 24.2vh, 350px);
  position: absolute;
  left: 50%;
  bottom: clamp(92px, 15vh, 162px);
  z-index: 4;
  width: calc(var(--tree-width) * 1.3);
  height: calc(var(--tree-height) * 1.3);
  transform: translateX(-50%);
  transform-origin: 50% 100%;
  animation: tree-arrival 1500ms cubic-bezier(0.18, 0.78, 0.22, 1) both;
}

.growing-tree--can-enter {
  cursor: pointer;
}

.growing-tree--stage-4.growing-tree--can-enter::before {
  position: absolute;
  inset: -10% -18% -6%;
  z-index: 1;
  content: '';
}

.growing-tree--can-enter:focus-visible {
  outline: 2px solid rgba(229, 255, 231, 0.92);
  outline-offset: 22px;
  border-radius: 42% 42% 10% 10%;
}

.growing-tree--can-enter:hover .growing-tree__image {
  filter:
    drop-shadow(0 22px 28px rgba(7, 19, 11, 0.28))
    drop-shadow(0 0 22px rgba(189, 239, 141, 0.18));
}

.growing-tree--entering {
  z-index: 9;
  pointer-events: none;
  transform-origin: 50% 72%;
  animation: tree-enter-forest 1350ms cubic-bezier(0.16, 0.82, 0.2, 1) forwards;
}

.growing-tree--stage-1 {
  --tree-width: clamp(141px, 16.5vw, 231px);
  --tree-height: clamp(176px, 24.2vh, 315px);
}

.growing-tree--stage-2 {
  --tree-width: clamp(200px, 24.2vw, 352px);
  --tree-height: clamp(242px, 34.1vh, 451px);
}

.growing-tree--stage-3 {
  --tree-width: clamp(286px, 34.1vw, 506px);
  --tree-height: clamp(341px, 47.3vh, 638px);
}

.growing-tree--stage-4 {
  --tree-width: clamp(385px, 44vw, 704px);
  --tree-height: clamp(451px, 62.7vh, 836px);
}

.growing-tree__shadow {
  position: absolute;
  left: 50%;
  bottom: -1%;
  z-index: -1;
  width: 52%;
  height: 9%;
  border-radius: 999px;
  background: radial-gradient(ellipse, rgba(6, 14, 9, 0.42), transparent 68%);
  filter: blur(9px);
  transform: translateX(-50%);
}

.growing-tree__image {
  position: relative;
  z-index: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
  filter:
    drop-shadow(0 18px 22px rgba(7, 19, 11, 0.22))
    drop-shadow(0 2px 1px rgba(255, 245, 205, 0.08));
  transform-origin: 50% 100%;
  animation:
    tree-grow-mask 1320ms cubic-bezier(0.2, 0.78, 0.24, 1) both,
    tree-real-sway 6.8s ease-in-out 1.45s infinite alternate;
}

.growing-tree--entering .growing-tree__image {
  animation: tree-pull-through 1350ms cubic-bezier(0.16, 0.82, 0.2, 1) forwards;
}

@keyframes tree-arrival {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(30px) scale(0.92);
    filter: blur(8px);
  }
  42% {
    opacity: 0.68;
    transform: translateX(-50%) translateY(13px) scale(0.97);
    filter: blur(3px);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes tree-grow-mask {
  0% {
    clip-path: inset(100% 0 0 0);
    opacity: 0.22;
    transform: scale(0.96, 0.9);
  }
  38% {
    opacity: 0.72;
  }
  100% {
    clip-path: inset(0 0 0 0);
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes tree-real-sway {
  from {
    transform: rotate(-0.25deg) translateY(0);
  }
  to {
    transform: rotate(0.25deg) translateY(-1px);
  }
}

@keyframes tree-enter-forest {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
    filter: blur(0);
  }
  38% {
    opacity: 1;
    transform: translateX(-50%) translateY(10vh) scale(2.15);
    filter: blur(1px);
  }
  76% {
    opacity: 0.92;
    transform: translateX(-50%) translateY(23vh) scale(5.8);
    filter: blur(4px) brightness(0.55);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(30vh) scale(8.2);
    filter: blur(10px) brightness(0.18);
  }
}

@keyframes tree-pull-through {
  0% {
    transform: scale(1) rotate(0deg);
  }
  45% {
    transform: scale(1.08, 1.02) rotate(-0.15deg);
  }
  100% {
    transform: scale(1.2, 1.06) rotate(0.2deg);
  }
}

@media (max-width: 760px) {
  .growing-tree {
    bottom: clamp(94px, 16vh, 136px);
  }

  .growing-tree--stage-4 {
    --tree-width: clamp(275px, 94.6vw, 396px);
    --tree-height: clamp(363px, 55vh, 539px);
  }

  .growing-tree--stage-3 {
    --tree-width: clamp(211px, 74.8vw, 319px);
    --tree-height: clamp(315px, 46.2vh, 451px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .growing-tree,
  .growing-tree__image {
    animation: none;
  }
}
</style>

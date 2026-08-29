<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  stage: number
  growthKey: number
}>()

const visibleStage = computed(() => Math.min(Math.max(props.stage, 0), 4))
const treeSrc = computed(() => (visibleStage.value > 0 ? `/images/tree/나무_${visibleStage.value}단계.png` : ''))
</script>

<template>
  <div
    v-if="visibleStage > 0"
    :key="growthKey"
    class="growing-tree"
    :class="[`growing-tree--stage-${visibleStage}`]"
    aria-label="Growing tree"
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
  width: var(--tree-width);
  height: var(--tree-height);
  transform: translateX(-50%);
  transform-origin: 50% 100%;
  animation: tree-arrival 960ms cubic-bezier(0.16, 0.84, 0.24, 1) both;
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
    tree-grow-mask 960ms cubic-bezier(0.18, 0.82, 0.22, 1) both,
    tree-real-sway 6.8s ease-in-out 1.1s infinite alternate;
}

@keyframes tree-arrival {
  from {
    opacity: 0.72;
    transform: translateX(-50%) translateY(34px) scale(0.86);
    filter: blur(3px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes tree-grow-mask {
  from {
    clip-path: inset(100% 0 0 0);
    transform: scale(0.94, 0.88);
  }
  to {
    clip-path: inset(0 0 0 0);
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

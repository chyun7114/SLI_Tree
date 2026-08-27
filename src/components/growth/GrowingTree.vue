<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  stage: number
  growthKey: number
}>()

const treeSrc = computed(() => `/images/tree/stages/stage-${Math.min(props.stage, 4)}.png`)
</script>

<template>
  <div :key="growthKey" class="growing-tree" :class="[`growing-tree--stage-${stage}`]" aria-label="Growing tree">
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
  --tree-width: clamp(118px, 13vw, 192px);
  --tree-height: clamp(188px, 22vh, 318px);
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

.growing-tree--stage-0 {
  --tree-width: clamp(72px, 8vw, 110px);
  --tree-height: clamp(112px, 14vh, 174px);
}

.growing-tree--stage-1 {
  --tree-width: clamp(104px, 11vw, 158px);
  --tree-height: clamp(166px, 19vh, 250px);
}

.growing-tree--stage-2 {
  --tree-width: clamp(150px, 16vw, 230px);
  --tree-height: clamp(240px, 28vh, 386px);
}

.growing-tree--stage-3 {
  --tree-width: clamp(228px, 24vw, 360px);
  --tree-height: clamp(320px, 40vh, 520px);
}

.growing-tree--stage-4 {
  --tree-width: clamp(340px, 36vw, 560px);
  --tree-height: clamp(390px, 52vh, 700px);
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
    --tree-width: clamp(250px, 86vw, 360px);
    --tree-height: clamp(330px, 50vh, 490px);
  }

  .growing-tree--stage-3 {
    --tree-width: clamp(192px, 68vw, 290px);
    --tree-height: clamp(286px, 42vh, 410px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .growing-tree,
  .growing-tree__image {
    animation: none;
  }
}
</style>

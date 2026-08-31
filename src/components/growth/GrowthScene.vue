<script setup lang="ts">
import { ref } from 'vue'
import AmbientDroplets from './AmbientDroplets.vue'
import GrowingTree from './GrowingTree.vue'
import MemoryModal from './MemoryModal.vue'
import ValueSphere from './ValueSphere.vue'
import WaterBurst from './WaterBurst.vue'
import { useGrowthSequence } from '../../composables/useGrowthSequence'
import { growthValues } from '../../data/values'

const {
  activeMemory,
  absorbKey,
  burstOrigin,
  growthKey,
  isAnimating,
  isComplete,
  isModalOpen,
  selectValue,
  closeMemory,
  treeStage,
  valueStates,
} = useGrowthSequence(growthValues)

const isEnteringForest = ref(false)
const isForestView = ref(false)
const isAscendingSky = ref(false)
const isSkyView = ref(false)

function enterForest() {
  if (!isComplete.value || isAnimating.value || isEnteringForest.value || isForestView.value) return

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }

  isEnteringForest.value = true
  window.setTimeout(() => {
    isForestView.value = true
    isEnteringForest.value = false
  }, 760)
}

function ascendToSky() {
  if (!isForestView.value || isAscendingSky.value || isSkyView.value) return

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }

  isAscendingSky.value = true
  window.setTimeout(() => {
    isSkyView.value = true
    isAscendingSky.value = false
  }, 980)
}
</script>

<template>
  <main
    class="growth-scene"
    :class="{
      'growth-scene--complete': isComplete,
      'growth-scene--entering-forest': isEnteringForest,
      'growth-scene--forest-view': isForestView,
      'growth-scene--ascending-sky': isAscendingSky,
      'growth-scene--sky-view': isSkyView,
    }"
  >
    <div class="growth-scene__atmosphere"></div>
    <AmbientDroplets v-if="!isEnteringForest && !isForestView" />

    <button
      class="growth-scene__forest"
      type="button"
      :disabled="!isForestView || isAscendingSky || isSkyView"
      aria-label="하늘 위로 올라가기"
      @click="ascendToSky"
      @keydown.enter.prevent="ascendToSky"
      @keydown.space.prevent="ascendToSky"
    >
      <div class="growth-scene__forest-sun"></div>
      <div class="growth-scene__forest-depth"></div>
    </button>

    <div class="growth-scene__sky" aria-hidden="true"></div>

    <Transition name="sky-message">
      <section v-if="isSkyView" class="growth-scene__sky-message" aria-label="마무리 메시지">
        <p class="growth-scene__sky-kicker">Growth completed</p>
        <h1>우리는 더 넓은 하늘로 자라났습니다.</h1>
        <p>네 개의 가치가 하나의 나무가 되었고, 그 나무는 다시 숲 너머의 빛으로 이어집니다.</p>
      </section>
    </Transition>

    <section class="growth-scene__values" aria-label="Core values" :aria-hidden="isEnteringForest || isForestView || isSkyView">
      <ValueSphere
        v-for="value in growthValues"
        :key="value.id"
        :value="value"
        :state="valueStates[value.id]"
        :disabled="isAnimating"
        @select="selectValue"
      />
    </section>

    <GrowingTree
      v-if="!isForestView"
      :stage="treeStage"
      :growth-key="growthKey"
      :can-enter-forest="isComplete && !isAnimating"
      :is-entering-forest="isEnteringForest"
      @enter-forest="enterForest"
    />
    <WaterBurst :origin="burstOrigin" :absorb-key="absorbKey" />

    <Transition name="memory-modal">
      <MemoryModal v-if="isModalOpen && activeMemory" :memory="activeMemory" @close="closeMemory" />
    </Transition>
  </main>
</template>

<style scoped>
.growth-scene {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  color: #17313b;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 248, 220, 0.06)),
    url('/images/배경.png') center bottom / cover no-repeat;
  isolation: isolate;
  transition:
    filter 1200ms ease,
    background 1200ms ease;
}

.growth-scene--complete {
  filter: saturate(1.08) brightness(1.07);
}

.growth-scene__atmosphere {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), transparent 38%),
    radial-gradient(ellipse at 50% 100%, rgba(104, 79, 44, 0.1), transparent 42%),
    linear-gradient(90deg, rgba(38, 115, 168, 0.08), transparent 28% 72%, rgba(38, 115, 168, 0.08));
  pointer-events: none;
  transition:
    opacity 820ms ease,
    transform 1180ms cubic-bezier(0.16, 0.82, 0.2, 1),
    filter 1180ms ease;
}

.growth-scene__atmosphere::before {
  position: absolute;
  inset: 0;
  content: '';
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: radial-gradient(circle at 50% 24%, black, transparent 68%);
  opacity: 0.16;
}

.growth-scene--complete .growth-scene__atmosphere::after {
  position: absolute;
  inset: 0;
  content: '';
  background:
    radial-gradient(circle at 50% 20%, rgba(255, 238, 176, 0.16), transparent 24%),
    linear-gradient(180deg, rgba(255, 236, 186, 0.11), transparent 54%);
  animation: warm-arrival 1200ms ease both;
}

.growth-scene__forest {
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: hidden;
  display: block;
  width: 100%;
  border: 0;
  padding: 0;
  background:
    linear-gradient(180deg, rgba(6, 20, 9, 0.04), rgba(0, 28, 24, 0.24)),
    url('/images/Forest.jpg') center center / cover no-repeat;
  opacity: 0;
  transform: scale(1.24) translateY(4vh);
  filter: blur(8px) brightness(0.88) saturate(1.18);
  pointer-events: none;
  transition:
    opacity 820ms ease,
    transform 1600ms cubic-bezier(0.16, 0.82, 0.2, 1),
    filter 1500ms ease;
}

.growth-scene__forest:disabled {
  cursor: default;
}

.growth-scene__forest:focus-visible {
  outline: 2px solid rgba(224, 247, 255, 0.9);
  outline-offset: -14px;
}

.growth-scene__forest::before {
  position: absolute;
  inset: -12%;
  content: '';
  background:
    radial-gradient(circle at 48% 43%, rgba(255, 255, 225, 0.34), transparent 13%),
    radial-gradient(circle at 50% 46%, rgba(137, 219, 91, 0.16), transparent 31%),
    linear-gradient(180deg, rgba(11, 44, 26, 0), rgba(2, 21, 16, 0.18));
  mix-blend-mode: screen;
  opacity: 0;
  transform: scale(0.9);
  transition:
    opacity 1000ms ease 280ms,
    transform 1700ms cubic-bezier(0.16, 0.82, 0.2, 1);
}

.growth-scene__forest-sun,
.growth-scene__forest-depth {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.growth-scene__forest-sun {
  background:
    radial-gradient(circle at 49% 42%, rgba(255, 255, 240, 0.42), transparent 8%),
    radial-gradient(circle at 50% 44%, rgba(185, 255, 117, 0.18), transparent 26%);
  opacity: 0;
  transform: scale(0.72);
  transition:
    opacity 900ms ease 360ms,
    transform 1600ms cubic-bezier(0.16, 0.82, 0.2, 1);
}

.growth-scene__forest-depth {
  background:
    radial-gradient(ellipse at 50% 50%, transparent 42%, rgba(0, 13, 12, 0.36) 100%),
    linear-gradient(180deg, rgba(0, 18, 15, 0.22), transparent 30% 72%, rgba(0, 11, 8, 0.28));
  opacity: 0;
  transition: opacity 1100ms ease 220ms;
}

.growth-scene__sky {
  position: absolute;
  inset: 0;
  z-index: 3;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.02)),
    url('/images/마무리_배경.png') center center / cover no-repeat;
  opacity: 0;
  transform: translateY(18vh) scale(1.06);
  filter: blur(9px) brightness(1.08);
  pointer-events: none;
  transition:
    opacity 1100ms ease,
    transform 1500ms cubic-bezier(0.16, 0.82, 0.2, 1),
    filter 1300ms ease;
}

.growth-scene__sky::before {
  position: absolute;
  inset: 0;
  content: '';
  background:
    radial-gradient(circle at 50% 62%, rgba(255, 255, 255, 0.48), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(240, 252, 255, 0.42));
  opacity: 0;
  transition: opacity 1200ms ease 260ms;
}

.growth-scene__sky-message {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 5;
  width: min(720px, calc(100vw - 40px));
  color: #16455d;
  text-align: center;
  text-shadow: 0 2px 20px rgba(255, 255, 255, 0.72);
  transform: translate(-50%, -50%);
}

.growth-scene__sky-kicker {
  margin: 0 0 16px;
  color: rgba(16, 93, 122, 0.72);
  font-size: clamp(0.72rem, 1vw, 0.86rem);
  font-weight: 800;
  letter-spacing: 0.18em;
  line-height: 1.2;
  text-transform: uppercase;
}

.growth-scene__sky-message h1 {
  margin: 0;
  color: #123f57;
  font-size: clamp(2.4rem, 5.4vw, 5.8rem);
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.08;
}

.growth-scene__sky-message p:last-child {
  width: min(620px, 100%);
  margin: clamp(20px, 3vh, 32px) auto 0;
  color: rgba(24, 72, 91, 0.78);
  font-size: clamp(1rem, 1.45vw, 1.28rem);
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1.7;
}

.growth-scene--entering-forest .growth-scene__atmosphere,
.growth-scene--forest-view .growth-scene__atmosphere {
  opacity: 0;
  transform: scale(1.18);
  filter: blur(8px);
}

.growth-scene--entering-forest .growth-scene__forest,
.growth-scene--forest-view .growth-scene__forest {
  opacity: 1;
  transform: scale(1) translateY(0);
  filter: blur(0) brightness(1.03) saturate(1.18);
}

.growth-scene--forest-view:not(.growth-scene--ascending-sky):not(.growth-scene--sky-view) .growth-scene__forest {
  cursor: pointer;
  pointer-events: auto;
}

.growth-scene--entering-forest .growth-scene__forest::before,
.growth-scene--forest-view .growth-scene__forest::before,
.growth-scene--entering-forest .growth-scene__forest-sun,
.growth-scene--forest-view .growth-scene__forest-sun {
  opacity: 1;
  transform: scale(1);
}

.growth-scene--entering-forest .growth-scene__forest-depth,
.growth-scene--forest-view .growth-scene__forest-depth {
  opacity: 1;
}

.growth-scene--ascending-sky .growth-scene__forest,
.growth-scene--sky-view .growth-scene__forest {
  opacity: 0;
  transform: translateY(34vh) scale(1.18);
  filter: blur(12px) brightness(1.35) saturate(0.9);
  pointer-events: none;
}

.growth-scene--ascending-sky .growth-scene__sky,
.growth-scene--sky-view .growth-scene__sky {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0) brightness(1);
}

.growth-scene--ascending-sky .growth-scene__sky::before,
.growth-scene--sky-view .growth-scene__sky::before {
  opacity: 1;
}

.growth-scene__values {
  position: relative;
  z-index: 5;
  width: min(760px, calc(100vw - 36px));
  height: clamp(330px, 46vh, 460px);
  margin: clamp(125px, 23.75vh, 205px) auto 0;
  transform-origin: 50% 48%;
  animation: value-group-drift 18s ease-in-out infinite;
  transition:
    opacity 540ms ease,
    transform 900ms cubic-bezier(0.16, 0.82, 0.2, 1),
    filter 900ms ease;
}

.growth-scene--entering-forest .growth-scene__values,
.growth-scene--forest-view .growth-scene__values {
  opacity: 0;
  transform: scale(1.22) translateY(8vh);
  filter: blur(8px);
  pointer-events: none;
}

.growth-scene__values :deep(.value-sphere) {
  position: absolute;
}

.growth-scene__values :deep(.value-sphere:nth-child(1)) {
  left: 19%;
  top: 2%;
}

.growth-scene__values :deep(.value-sphere:nth-child(2)) {
  right: 16%;
  top: 10%;
}

.growth-scene__values :deep(.value-sphere:nth-child(3)) {
  left: 9%;
  bottom: 4%;
}

.growth-scene__values :deep(.value-sphere:nth-child(4)) {
  right: 6%;
  bottom: 16%;
}

.memory-modal-enter-active,
.memory-modal-leave-active {
  transition: opacity 260ms ease;
}

.memory-modal-enter-from,
.memory-modal-leave-to {
  opacity: 0;
}

.sky-message-enter-active,
.sky-message-leave-active {
  transition:
    opacity 900ms ease,
    transform 900ms cubic-bezier(0.16, 0.82, 0.2, 1),
    filter 900ms ease;
}

.sky-message-enter-from,
.sky-message-leave-to {
  opacity: 0;
  filter: blur(10px);
  transform: translate(-50%, calc(-50% + 26px));
}

@keyframes warm-arrival {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes value-group-drift {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(-1.8deg) scale(1);
  }
  36% {
    transform: translate3d(10px, -6px, 0) rotate(2.4deg) scale(1.006);
  }
  70% {
    transform: translate3d(-8px, 7px, 0) rotate(-2.2deg) scale(0.998);
  }
}

@media (max-width: 760px) {
  .growth-scene__values {
    width: min(430px, calc(100vw - 24px));
    height: clamp(300px, 44vh, 390px);
    margin-top: clamp(104px, 19.5vh, 154px);
  }

  .growth-scene__sky-message {
    width: min(520px, calc(100vw - 32px));
  }

  .growth-scene__sky-kicker {
    margin-bottom: 12px;
  }

  .growth-scene__sky-message h1 {
    font-size: clamp(2.05rem, 11vw, 3.6rem);
  }

  .growth-scene__sky-message p:last-child {
    font-size: clamp(0.96rem, 4vw, 1.12rem);
  }

  .growth-scene__values :deep(.value-sphere:nth-child(1)) {
    left: 15%;
    top: 1%;
  }

  .growth-scene__values :deep(.value-sphere:nth-child(2)) {
    right: 9%;
    top: 12%;
  }

  .growth-scene__values :deep(.value-sphere:nth-child(3)) {
    left: 4%;
    bottom: 5%;
  }

  .growth-scene__values :deep(.value-sphere:nth-child(4)) {
    right: 2%;
    bottom: 15%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .growth-scene__values {
    animation: none;
  }

  .growth-scene__atmosphere,
  .growth-scene__forest,
  .growth-scene__forest::before,
  .growth-scene__forest-sun,
  .growth-scene__forest-depth,
  .growth-scene__sky,
  .growth-scene__sky::before,
  .growth-scene__sky-message,
  .growth-scene__values {
    transition-duration: 1ms;
  }
}
</style>

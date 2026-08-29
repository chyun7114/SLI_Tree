<script setup lang="ts">
import AmbientDroplets from './AmbientDroplets.vue'
import CompletionMessage from './CompletionMessage.vue'
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
</script>

<template>
  <main class="growth-scene" :class="{ 'growth-scene--complete': isComplete }">
    <div class="growth-scene__atmosphere"></div>
    <AmbientDroplets />

    <section class="growth-scene__values" aria-label="Core values">
      <ValueSphere
        v-for="value in growthValues"
        :key="value.id"
        :value="value"
        :state="valueStates[value.id]"
        :disabled="isAnimating"
        @select="selectValue"
      />
    </section>

    <GrowingTree :stage="treeStage" :growth-key="growthKey" />
    <WaterBurst :origin="burstOrigin" :absorb-key="absorbKey" />
    <CompletionMessage v-if="isComplete" />

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

.growth-scene__values {
  position: relative;
  z-index: 5;
  display: grid;
  grid-template-columns: repeat(2, minmax(112px, 176px));
  justify-content: center;
  gap: clamp(22px, 5vw, 58px) clamp(48px, 12vw, 150px);
  width: min(760px, calc(100vw - 36px));
  margin: 0 auto;
  padding-top: clamp(54px, 8vh, 86px);
}

.memory-modal-enter-active,
.memory-modal-leave-active {
  transition: opacity 260ms ease;
}

.memory-modal-enter-from,
.memory-modal-leave-to {
  opacity: 0;
}

@keyframes warm-arrival {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 760px) {
  .growth-scene__values {
    grid-template-columns: repeat(2, minmax(92px, 132px));
    gap: clamp(12px, 4vw, 24px) clamp(22px, 8vw, 48px);
    padding-top: clamp(38px, 7vh, 66px);
  }
}
</style>

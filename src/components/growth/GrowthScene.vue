<script setup lang="ts">
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
  width: min(760px, calc(100vw - 36px));
  height: clamp(330px, 46vh, 460px);
  margin: clamp(125px, 23.75vh, 205px) auto 0;
  transform-origin: 50% 48%;
  animation: value-group-drift 18s ease-in-out infinite;
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
}
</style>

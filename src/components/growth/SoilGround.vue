<script setup lang="ts">
defineProps<{
  moistureLevel: number
}>()
</script>

<template>
  <div class="soil-ground" :style="{ '--moisture': moistureLevel }" aria-hidden="true">
    <div class="soil-ground__ridge"></div>
    <div class="soil-ground__texture"></div>
    <div class="soil-ground__wetness"></div>
  </div>
</template>

<style scoped>
.soil-ground {
  position: absolute;
  inset: auto 0 0;
  z-index: 3;
  height: clamp(132px, 21vh, 228px);
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 35%, rgba(76, 58, 39, 0.48) 0 2px, transparent 3px),
    radial-gradient(circle at 46% 46%, rgba(35, 29, 20, 0.42) 0 1px, transparent 2px),
    radial-gradient(circle at 68% 28%, rgba(119, 85, 52, 0.42) 0 2px, transparent 3px),
    linear-gradient(180deg, #6d4e35 0%, #46311f 44%, #251a12 100%);
  background-size:
    82px 48px,
    54px 36px,
    96px 64px,
    100% 100%;
  box-shadow: inset 0 34px 48px rgba(22, 15, 10, 0.35);
}

.soil-ground__ridge {
  position: absolute;
  inset: -30px -4% auto;
  height: 78px;
  background:
    radial-gradient(ellipse at 17% 78%, #8a6848 0 19%, transparent 20%),
    radial-gradient(ellipse at 38% 84%, #7b5638 0 20%, transparent 21%),
    radial-gradient(ellipse at 57% 77%, #9a744f 0 18%, transparent 19%),
    radial-gradient(ellipse at 78% 83%, #775436 0 20%, transparent 21%),
    linear-gradient(180deg, rgba(104, 76, 50, 0), #735138 58%, #5f432d 100%);
  filter: blur(0.2px);
}

.soil-ground__texture {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(105deg, transparent 0 44%, rgba(255, 255, 255, 0.05) 48%, transparent 53% 100%),
    repeating-radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.06) 0 1px, transparent 2px 13px);
  mix-blend-mode: soft-light;
  opacity: 0.72;
}

.soil-ground__wetness {
  position: absolute;
  left: 50%;
  top: 22%;
  width: min(42vw, 460px);
  height: 82px;
  border-radius: 999px;
  background: radial-gradient(ellipse, rgba(24, 42, 31, 0.66), rgba(30, 50, 37, 0.24) 44%, transparent 72%);
  filter: blur(8px);
  opacity: calc(var(--moisture) * 0.15);
  transform: translateX(-50%) scale(calc(0.55 + var(--moisture) * 0.13));
  transition:
    opacity 900ms ease,
    transform 900ms ease;
}
</style>

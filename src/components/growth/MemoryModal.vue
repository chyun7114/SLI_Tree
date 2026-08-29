<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import type { GrowthValue } from '../../types/growth'

interface HeatmapTile {
  index: number
  photo: GrowthValue['photos'][number]
  style: CSSProperties
}

interface HeatmapSource {
  index: number
  photo: GrowthValue['photos'][number]
}

interface HeatmapRect {
  x: number
  y: number
  width: number
  height: number
}

const props = defineProps<{
  memory: GrowthValue
}>()

const emit = defineEmits<{
  close: []
}>()

const modalRef = ref<HTMLElement | null>(null)
const erroredPhotos = ref<Set<string>>(new Set())

const sliderPhotos = computed(() => [...props.memory.photos, ...props.memory.photos])
const sliderTrackStyle = computed<CSSProperties>(() => ({
  '--scroll-duration': `${Math.max(56, props.memory.photos.length * 2.9)}s`,
}))
const heatmapSources = computed(() => {
  const availablePhotos = props.memory.photos
    .map((photo, index) => ({ index, photo }))
    .filter((item) => !erroredPhotos.value.has(item.photo.id))

  return availablePhotos.length > 0 ? availablePhotos : props.memory.photos.map((photo, index) => ({ index, photo }))
})
const heatmapTiles = computed(() => createHeatmapTiles(heatmapSources.value))

function close() {
  emit('close')
}

function markPhotoError(id: string) {
  erroredPhotos.value = new Set([...erroredPhotos.value, id])
}

function isPhotoErrored(id: string) {
  return erroredPhotos.value.has(id)
}

function heatmapWeight(index: number) {
  const weights = [1.45, 0.92, 1.18, 1.72, 0.86, 1.32, 1.05, 1.56, 0.98, 1.24]
  return weights[index % weights.length]
}

function createHeatmapTiles(sources: HeatmapSource[]) {
  const weightedPhotos = sources.map((source, index) => ({
    index: source.index,
    photo: source.photo,
    weight: heatmapWeight(index),
  }))
  const tiles: HeatmapTile[] = []

  function split(items: typeof weightedPhotos, rect: HeatmapRect) {
    if (items.length === 0) return

    if (items.length === 1) {
      const item = items[0]
      tiles.push({
        index: item.index,
        photo: item.photo,
        style: {
          left: `${rect.x}%`,
          top: `${rect.y}%`,
          width: `${rect.width}%`,
          height: `${rect.height}%`,
        },
      })
      return
    }

    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
    const targetWeight = totalWeight / 2
    let splitIndex = 1
    let runningWeight = 0
    let closestDistance = Number.POSITIVE_INFINITY

    for (let index = 0; index < items.length - 1; index += 1) {
      runningWeight += items[index].weight
      const distance = Math.abs(targetWeight - runningWeight)
      if (distance < closestDistance) {
        closestDistance = distance
        splitIndex = index + 1
      }
    }

    const firstGroup = items.slice(0, splitIndex)
    const secondGroup = items.slice(splitIndex)
    const firstWeight = firstGroup.reduce((sum, item) => sum + item.weight, 0)
    const ratio = firstWeight / totalWeight

    if (rect.width >= rect.height) {
      const firstWidth = rect.width * ratio
      split(firstGroup, { ...rect, width: firstWidth })
      split(secondGroup, {
        x: rect.x + firstWidth,
        y: rect.y,
        width: rect.width - firstWidth,
        height: rect.height,
      })
      return
    }

    const firstHeight = rect.height * ratio
    split(firstGroup, { ...rect, height: firstHeight })
    split(secondGroup, {
      x: rect.x,
      y: rect.y + firstHeight,
      width: rect.width,
      height: rect.height - firstHeight,
    })
  }

  split(weightedPhotos, { x: 0, y: 0, width: 100, height: 100 })
  return tiles
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
    return
  }

  if (event.key !== 'Tab' || !modalRef.value) return

  const focusable = modalRef.value.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(
  () => props.memory.id,
  () => {
    erroredPhotos.value = new Set()
    nextTick(() => modalRef.value?.focus())
  },
)

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  modalRef.value?.focus()
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="memory-overlay" role="presentation" @mousedown.self="close">
    <section
      ref="modalRef"
      class="memory-modal"
      :class="`memory-modal--${memory.modalVariant}`"
      role="dialog"
      aria-modal="true"
      :aria-label="memory.archiveLabel"
      tabindex="-1"
    >
      <button class="memory-modal__close" type="button" aria-label="사진 아카이브 닫기" @click="close">
        <span class="material-symbols-rounded" aria-hidden="true">close</span>
      </button>

      <div v-if="memory.modalVariant === 'heatmap'" class="memory-modal__heatmap" aria-label="사진 타일 아카이브">
        <button
          v-for="tile in heatmapTiles"
          :key="tile.photo.id"
          class="memory-modal__heat-tile"
          :style="tile.style"
          type="button"
          :aria-label="`${tile.index + 1}번째 사진 보기`"
        >
          <img
            v-if="!isPhotoErrored(tile.photo.id)"
            :src="tile.photo.src"
            :alt="tile.photo.alt"
            @error="markPhotoError(tile.photo.id)"
          />
          <span v-else aria-hidden="true"></span>
        </button>
      </div>

      <div v-else class="memory-modal__slider" aria-label="자동 슬라이드 사진 아카이브">
        <div class="memory-modal__track" :style="sliderTrackStyle">
          <figure
            v-for="(photo, index) in sliderPhotos"
            :key="`${photo.id}-${index}`"
            class="memory-modal__slide"
            :aria-hidden="index >= memory.photos.length"
          >
            <img v-if="!isPhotoErrored(photo.id)" :src="photo.src" :alt="photo.alt" @error="markPhotoError(photo.id)" />
            <div v-else class="memory-modal__fallback">
              <span aria-hidden="true"></span>
            </div>
          </figure>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.memory-overlay {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  padding: clamp(10px, 2vw, 24px);
  background:
    linear-gradient(180deg, rgba(233, 249, 255, 0.78), rgba(223, 247, 238, 0.7)),
    rgba(216, 244, 248, 0.62);
  backdrop-filter: blur(16px) saturate(1.15);
}

.memory-modal {
  position: relative;
  box-sizing: border-box;
  display: block;
  width: min(1480px, 97vw);
  max-height: 88svh;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.74);
  border-radius: 8px;
  padding: clamp(14px, 1.8vw, 24px);
  color: #1d5361;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(229, 248, 251, 0.84)),
    radial-gradient(circle at 76% 12%, rgba(141, 223, 232, 0.28), transparent 34%),
    radial-gradient(circle at 16% 86%, rgba(199, 238, 204, 0.3), transparent 36%);
  box-shadow: 0 30px 90px rgba(64, 128, 139, 0.22);
  outline: none;
}

.memory-modal--heatmap {
  height: min(88svh, 760px);
}

.memory-modal__close {
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 2;
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid rgba(117, 193, 207, 0.32);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.66);
  box-shadow: 0 10px 24px rgba(94, 157, 169, 0.14);
  cursor: pointer;
}

.memory-modal__close span {
  color: rgba(28, 91, 105, 0.82);
  font-size: 24px;
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
  line-height: 1;
}

.memory-modal__heatmap {
  position: relative;
  height: 100%;
  overflow: hidden;
  padding-right: 52px;
}

.memory-modal__heat-tile {
  position: absolute;
  overflow: hidden;
  min-height: 0;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  padding: 0;
  background: rgba(255, 255, 255, 0.46);
  box-shadow: 0 12px 26px rgba(75, 151, 164, 0.12);
  cursor: pointer;
  transition:
    filter 180ms ease,
    transform 180ms ease;
}

.memory-modal__heat-tile:hover {
  z-index: 1;
  filter: brightness(1.04) saturate(1.03);
  transform: scale(1.006);
}

.memory-modal__heat-tile img,
.memory-modal__heat-tile span,
.memory-modal__slide img,
.memory-modal__fallback {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #d7f2f4;
}

.memory-modal__heat-tile span,
.memory-modal__fallback {
  display: grid;
  place-items: center;
  overflow: hidden;
  color: rgba(50, 118, 132, 0.38);
  background:
    linear-gradient(115deg, rgba(255, 255, 255, 0.5), rgba(176, 232, 242, 0.36), rgba(255, 255, 255, 0.46)),
    radial-gradient(circle at 24% 26%, rgba(226, 246, 214, 0.78), transparent 23%),
    radial-gradient(circle at 76% 28%, rgba(135, 215, 229, 0.5), transparent 30%),
    linear-gradient(145deg, #f8fffb, #dff6f8 48%, #c9ece8);
}

.memory-modal__heat-tile span,
.memory-modal__fallback span {
  font-size: clamp(1.2rem, 3vw, 3.6rem);
  font-weight: 500;
  opacity: 0.74;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.42);
}

.memory-modal__slider {
  overflow: hidden;
  padding: 42px 0 6px;
}

.memory-modal__track {
  --slide-width: min(54vw, 620px);
  --slide-gap: clamp(12px, 1.6vw, 22px);
  display: flex;
  gap: var(--slide-gap);
  width: max-content;
  animation: continuous-slide var(--scroll-duration) linear infinite;
  will-change: transform;
}

.memory-modal__slide {
  flex: 0 0 var(--slide-width);
  height: min(62svh, 620px);
  margin: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 24px 52px rgba(67, 139, 153, 0.18);
}

@keyframes continuous-slide {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-50% - (var(--slide-gap) / 2)));
  }
}

@media (max-width: 860px) {
  .memory-overlay {
    padding: 0;
  }

  .memory-modal {
    width: 100vw;
    min-height: 100svh;
    max-height: none;
    border: 0;
    border-radius: 0;
    overflow: hidden;
    padding: 68px 12px 16px;
  }

  .memory-modal--heatmap {
    height: 100svh;
  }

  .memory-modal__heatmap {
    height: 100%;
    padding-right: 0;
  }

  .memory-modal__slider {
    padding: 0;
  }

  .memory-modal__track {
    --slide-width: min(78vw, 420px);
  }

  .memory-modal__slide {
    height: min(62svh, 560px);
  }
}
</style>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import type { GrowthValue } from '../../types/growth'
import { createHeatmapLayout } from '../../utils/heatmapLayout'

const props = defineProps<{
  memory: GrowthValue
}>()

const emit = defineEmits<{
  close: []
}>()

const modalRef = ref<HTMLElement | null>(null)
const heatmapWidth = ref(1000)
const heatmapHeight = ref(700)
const photoRatios = ref<Record<string, number>>({})
const photoSizes = ref<Record<string, { width: number; height: number }>>({})
let resizeObserver: ResizeObserver | undefined
let previewStartTimer: number | undefined
let previewCycleTimer: number | undefined
let photoLoadVersion = 0
const erroredPhotos = ref<Set<string>>(new Set())
const selectedPhoto = ref<GrowthValue['photos'][number] | null>(null)
const photoPreviewStyle = ref<CSSProperties>({})

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
const heatmapTiles = computed(() => {
  const sources = heatmapSources.value
  const ratios = sources.map(({ photo }) => photoRatios.value[photo.id] ?? 1)
  return createHeatmapLayout(ratios, heatmapWidth.value, heatmapHeight.value).map((rectangle) => ({
    ...sources[rectangle.index]!,
    style: {
      left: `${rectangle.x}%`,
      top: `${rectangle.y}%`,
      width: `${rectangle.width}%`,
      height: `${rectangle.height}%`,
    } satisfies CSSProperties,
  }))
})

function close() {
  emit('close')
}

function closePhotoPreview() {
  selectedPhoto.value = null
}

function markPhotoError(id: string) {
  erroredPhotos.value = new Set([...erroredPhotos.value, id])
}

function isPhotoErrored(id: string) {
  return erroredPhotos.value.has(id)
}

function clearPreviewTimers() {
  if (previewStartTimer !== undefined) {
    window.clearTimeout(previewStartTimer)
    previewStartTimer = undefined
  }

  if (previewCycleTimer !== undefined) {
    window.clearInterval(previewCycleTimer)
    previewCycleTimer = undefined
  }
}

function getPhotoPreviewSize(photo: GrowthValue['photos'][number]) {
  const naturalSize = photoSizes.value[photo.id] ?? { width: 720, height: 480 }
  const modalRect = modalRef.value?.getBoundingClientRect()
  const maxPreviewWidth = Math.max(120, Math.min((modalRect?.width ?? window.innerWidth) - 48, window.innerWidth - 48))
  const maxPreviewHeight = Math.max(120, Math.min((modalRect?.height ?? window.innerHeight) - 48, window.innerHeight - 48))
  const previewScale = Math.min(1, maxPreviewWidth / naturalSize.width, maxPreviewHeight / naturalSize.height)

  return {
    width: Math.round(naturalSize.width * previewScale),
    height: Math.round(naturalSize.height * previewScale),
  }
}

function showRandomPhotoPreview() {
  const photos = heatmapSources.value.map(({ photo }) => photo).filter((photo) => !isPhotoErrored(photo.id))
  if (photos.length === 0) return

  const currentId = selectedPhoto.value?.id
  const candidates = photos.length > 1 ? photos.filter((photo) => photo.id !== currentId) : photos
  const nextPhoto = candidates[Math.floor(Math.random() * candidates.length)] ?? photos[0]
  if (!nextPhoto) return

  const previewSize = getPhotoPreviewSize(nextPhoto)
  selectedPhoto.value = nextPhoto
  photoPreviewStyle.value = {
    width: `${previewSize.width}px`,
    height: `${previewSize.height}px`,
  }
}

function startPhotoPreviewCycle() {
  clearPreviewTimers()
  selectedPhoto.value = null
  if (props.memory.modalVariant !== 'heatmap') return

  previewStartTimer = window.setTimeout(() => {
    showRandomPhotoPreview()
    previewCycleTimer = window.setInterval(showRandomPhotoPreview, 7000)
  }, 3000)
}

const tileRatios = [1, 4 / 3, 16 / 9] as const

function nearestTileRatio(width: number, height: number) {
  const originalRatio = width / Math.max(height, 1)
  return tileRatios.reduce((closest, ratio) =>
    Math.abs(Math.log(originalRatio / ratio)) < Math.abs(Math.log(originalRatio / closest)) ? ratio : closest,
  )
}

watch(
  () => props.memory.photos,
  async (photos) => {
    const version = ++photoLoadVersion
    const dimensions = await Promise.all(photos.map((photo) => new Promise<[string, number]>((resolve) => {
      const image = new Image()
      image.onload = () => {
        photoSizes.value = {
          ...photoSizes.value,
          [photo.id]: {
            width: image.naturalWidth || 1,
            height: image.naturalHeight || 1,
          },
        }
        resolve([photo.id, nearestTileRatio(image.naturalWidth, image.naturalHeight)])
      }
      image.onerror = () => resolve([photo.id, 1])
      image.src = photo.src
    })))
    if (version === photoLoadVersion) photoRatios.value = Object.fromEntries(dimensions)
  },
  { immediate: true },
)

function handleKeydown(event: KeyboardEvent) {
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
    photoSizes.value = {}
    startPhotoPreviewCycle()
    nextTick(() => modalRef.value?.focus())
  },
)

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  if (modalRef.value) {
    heatmapWidth.value = modalRef.value.clientWidth
    heatmapHeight.value = modalRef.value.clientHeight
    resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) return
      heatmapWidth.value = Math.max(1, entry.contentRect.width)
      heatmapHeight.value = Math.max(1, entry.contentRect.height)
    })
    resizeObserver.observe(modalRef.value)
  }
  modalRef.value?.focus()
  startPhotoPreviewCycle()
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  resizeObserver?.disconnect()
  clearPreviewTimers()
  photoLoadVersion++
})
</script>

<template>
  <div class="memory-overlay" role="presentation">
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
        <div
          v-for="tile in heatmapTiles"
          :key="tile.photo.id"
          class="memory-modal__heat-tile"
          :style="tile.style"
        >
          <img
            v-if="!isPhotoErrored(tile.photo.id)"
            :src="tile.photo.src"
            :alt="tile.photo.alt"
            decoding="async"
            fetchpriority="low"
            @error="markPhotoError(tile.photo.id)"
          />
          <span v-else aria-hidden="true"></span>
        </div>
      </div>

      <div v-else class="memory-modal__slider" aria-label="자동 슬라이드 사진 아카이브">
        <div class="memory-modal__track" :style="sliderTrackStyle">
          <figure
            v-for="(photo, index) in sliderPhotos"
            :key="`${photo.id}-${index}`"
            class="memory-modal__slide"
            :aria-hidden="index >= memory.photos.length"
          >
            <img
              v-if="!isPhotoErrored(photo.id)"
              :src="photo.src"
              :alt="photo.alt"
              loading="lazy"
              decoding="async"
              @error="markPhotoError(photo.id)"
            />
            <div v-else class="memory-modal__fallback">
              <span aria-hidden="true"></span>
            </div>
          </figure>
        </div>
      </div>

      <Transition name="auto-photo-preview" mode="out-in">
        <aside
          v-if="selectedPhoto"
          :key="selectedPhoto.id"
          class="memory-modal__photo-preview"
          :style="photoPreviewStyle"
          aria-label="자동 선택 사진 크게 보기"
        >
          <button class="memory-modal__photo-close" type="button" aria-label="확대 사진 닫기" @click="closePhotoPreview">
            <span class="material-symbols-rounded" aria-hidden="true">close</span>
          </button>
          <img
            v-if="!isPhotoErrored(selectedPhoto.id)"
            :src="selectedPhoto.src"
            :alt="selectedPhoto.alt"
            decoding="async"
            @error="markPhotoError(selectedPhoto.id)"
          />
          <div v-else class="memory-modal__fallback">
            <span aria-hidden="true"></span>
          </div>
        </aside>
      </Transition>
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
  width: min(1600px, 97vw);
  height: min(900px, 88svh);
  border: 0;
  padding: 0;
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

.memory-modal__photo-preview {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 3;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  background: rgba(244, 253, 255, 0.94);
  box-shadow: 0 26px 70px rgba(22, 67, 78, 0.28);
  pointer-events: auto;
  transform: translate(-50%, -50%);
}

.memory-modal__photo-preview img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: rgba(226, 246, 250, 0.78);
}

.memory-modal__photo-close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid rgba(95, 171, 188, 0.28);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.76);
  box-shadow: 0 10px 22px rgba(39, 98, 110, 0.18);
  cursor: pointer;
}

.memory-modal__photo-close span {
  color: rgba(28, 91, 105, 0.82);
  font-size: 22px;
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
  line-height: 1;
}

.memory-modal__heatmap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: clip;
}

.memory-modal__heat-tile {
  position: absolute;
  box-sizing: border-box;
  min-width: 0;
  overflow: hidden;
  min-height: 0;
  border: 1px solid #fff;
  border-radius: 0;
  padding: 0;
  background: rgba(255, 255, 255, 0.46);
  contain: paint;
  pointer-events: none;
}

.memory-modal__heat-tile img,
.memory-modal__heat-tile span {
  position: absolute;
  inset: 0;
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

.auto-photo-preview-enter-active,
.auto-photo-preview-leave-active {
  transition:
    opacity 520ms ease,
    transform 520ms cubic-bezier(0.2, 0.82, 0.2, 1);
}

.auto-photo-preview-enter-from,
.auto-photo-preview-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.92);
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
    min-height: 0;
    max-height: 100svh;
    padding: 0;
  }

  .memory-modal__heatmap {
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

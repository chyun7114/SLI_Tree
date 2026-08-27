<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { GrowthValue } from '../../types/growth'

const props = defineProps<{
  memory: GrowthValue
}>()

const emit = defineEmits<{
  close: []
}>()

const modalRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const erroredPhotos = ref<Set<string>>(new Set())

const activePhoto = computed(() => props.memory.photos[activeIndex.value])

function close() {
  emit('close')
}

function goToPhoto(index: number) {
  const total = props.memory.photos.length
  activeIndex.value = (index + total) % total
}

function markPhotoError(id: string) {
  erroredPhotos.value = new Set([...erroredPhotos.value, id])
}

function isPhotoErrored(id: string) {
  return erroredPhotos.value.has(id)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
    return
  }

  if (event.key === 'ArrowRight') {
    goToPhoto(activeIndex.value + 1)
    return
  }

  if (event.key === 'ArrowLeft') {
    goToPhoto(activeIndex.value - 1)
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
    activeIndex.value = 0
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
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`memory-title-${memory.id}`"
      tabindex="-1"
    >
      <button class="memory-modal__close" type="button" aria-label="Close memory archive" @click="close">
        <span></span>
      </button>

      <div class="memory-modal__copy">
        <p class="memory-modal__subtitle">{{ memory.subtitle }}</p>
        <h2 :id="`memory-title-${memory.id}`">{{ memory.title }}</h2>
        <p>{{ memory.description }}</p>
      </div>

      <div class="memory-modal__gallery">
        <figure class="memory-modal__hero">
          <img
            v-if="activePhoto && !isPhotoErrored(activePhoto.id)"
            :src="activePhoto.src"
            :alt="activePhoto.alt"
            @error="markPhotoError(activePhoto.id)"
          />
          <div v-else class="memory-modal__fallback" :data-value="memory.title">
            <span>{{ memory.title }}</span>
          </div>
          <figcaption>{{ activePhoto?.caption }}</figcaption>
        </figure>

        <div class="memory-modal__controls" aria-label="Photo controls">
          <button type="button" aria-label="Previous photo" @click="goToPhoto(activeIndex - 1)">‹</button>
          <span>{{ activeIndex + 1 }} / {{ memory.photos.length }}</span>
          <button type="button" aria-label="Next photo" @click="goToPhoto(activeIndex + 1)">›</button>
        </div>

        <div class="memory-modal__strip" aria-label="Photo thumbnails">
          <button
            v-for="(photo, index) in memory.photos"
            :key="photo.id"
            type="button"
            :class="{ 'memory-modal__thumb--active': index === activeIndex }"
            :aria-label="`Show photo ${index + 1}`"
            @click="goToPhoto(index)"
          >
            <img v-if="!isPhotoErrored(photo.id)" :src="photo.src" :alt="photo.alt" @error="markPhotoError(photo.id)" />
            <span v-else>{{ index + 1 }}</span>
          </button>
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
  padding: clamp(16px, 4vw, 44px);
  background: rgba(5, 13, 15, 0.72);
  backdrop-filter: blur(14px);
}

.memory-modal {
  position: relative;
  display: grid;
  grid-template-columns: minmax(220px, 0.62fr) minmax(360px, 1.38fr);
  gap: clamp(22px, 4vw, 54px);
  width: min(1180px, 92vw);
  max-height: 88svh;
  overflow: hidden;
  border: 1px solid rgba(235, 250, 245, 0.16);
  border-radius: 8px;
  padding: clamp(22px, 4vw, 48px);
  color: #eef7f3;
  background:
    linear-gradient(135deg, rgba(23, 42, 42, 0.92), rgba(9, 17, 19, 0.94)),
    radial-gradient(circle at 76% 14%, rgba(120, 196, 176, 0.16), transparent 34%);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.46);
  outline: none;
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
  border: 1px solid rgba(235, 250, 245, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
}

.memory-modal__close span,
.memory-modal__close span::after {
  width: 17px;
  height: 1px;
  background: rgba(238, 247, 243, 0.9);
  content: '';
}

.memory-modal__close span {
  display: block;
  transform: rotate(45deg);
}

.memory-modal__close span::after {
  position: absolute;
  transform: rotate(90deg);
}

.memory-modal__copy {
  align-self: end;
  padding-bottom: clamp(12px, 4vh, 42px);
}

.memory-modal__subtitle {
  margin: 0 0 14px;
  color: rgba(180, 224, 213, 0.76);
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.memory-modal h2 {
  margin: 0;
  font-size: clamp(2.4rem, 6vw, 5.8rem);
  font-weight: 500;
  letter-spacing: 0;
  line-height: 0.95;
}

.memory-modal__copy p:last-child {
  max-width: 30rem;
  margin: 24px 0 0;
  color: rgba(238, 247, 243, 0.76);
  font-size: clamp(0.95rem, 1.4vw, 1.08rem);
  line-height: 1.8;
}

.memory-modal__gallery {
  min-width: 0;
}

.memory-modal__hero {
  position: relative;
  margin: 0;
}

.memory-modal__hero img,
.memory-modal__fallback {
  display: block;
  width: 100%;
  max-height: min(58svh, 620px);
  aspect-ratio: 16 / 10;
  border-radius: 6px;
  object-fit: cover;
  background: #1b2927;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28);
}

.memory-modal__fallback {
  display: grid;
  place-items: center;
  overflow: hidden;
  color: rgba(241, 249, 246, 0.88);
  background:
    linear-gradient(115deg, rgba(18, 38, 39, 0.08), rgba(255, 255, 255, 0.16), rgba(18, 38, 39, 0.08)),
    radial-gradient(circle at 24% 26%, rgba(205, 228, 198, 0.48), transparent 23%),
    radial-gradient(circle at 76% 28%, rgba(106, 158, 151, 0.62), transparent 30%),
    linear-gradient(145deg, #425c4e, #152624 48%, #091314);
}

.memory-modal__fallback span {
  font-size: clamp(1.8rem, 5vw, 4.8rem);
  font-weight: 500;
  opacity: 0.74;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.42);
}

.memory-modal figcaption {
  margin-top: 14px;
  color: rgba(238, 247, 243, 0.66);
  font-size: 0.92rem;
  line-height: 1.6;
}

.memory-modal__controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin: 18px 0 14px;
}

.memory-modal__controls button {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid rgba(238, 247, 243, 0.18);
  border-radius: 999px;
  color: rgba(238, 247, 243, 0.9);
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
  font-size: 1.45rem;
  line-height: 1;
}

.memory-modal__controls span {
  color: rgba(238, 247, 243, 0.62);
  font-size: 0.86rem;
}

.memory-modal__strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.memory-modal__strip button {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  border: 1px solid rgba(238, 247, 243, 0.14);
  border-radius: 5px;
  padding: 0;
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
}

.memory-modal__strip img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.8) brightness(0.75);
}

.memory-modal__strip span {
  display: grid;
  height: 100%;
  place-items: center;
  color: rgba(238, 247, 243, 0.72);
}

.memory-modal__thumb--active {
  border-color: rgba(183, 232, 219, 0.7) !important;
}

.memory-modal__thumb--active img {
  filter: saturate(1) brightness(1);
}

@media (max-width: 860px) {
  .memory-overlay {
    padding: 0;
  }

  .memory-modal {
    grid-template-columns: 1fr;
    align-content: start;
    width: 100vw;
    min-height: 100svh;
    max-height: none;
    border: 0;
    border-radius: 0;
    overflow-y: auto;
    padding: 72px 18px 26px;
  }

  .memory-modal__copy {
    padding-bottom: 0;
  }

  .memory-modal__hero img,
  .memory-modal__fallback {
    max-height: none;
    aspect-ratio: 4 / 3;
  }
}
</style>

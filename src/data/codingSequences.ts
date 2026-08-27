import type { CodingSequence } from '../types/intro'

export const promptText =
  '입문과정을 무사히 마친 34명의 프로들이 함께한 시간을 기록하는 웹페이지를 만들어줘.\n\n입문과정에서 경험한 4가지 핵심 가치를 중심으로 구성하고, 각 가치를 통해 프로들이 무엇을 배우고 느꼈는지 확인할 수 있도록 해줘.\n\n각자의 이야기와 함께 입문과정에서 촬영한 사진들도 자연스럽게 볼 수 있었으면 좋겠어.\n\n34명의 서로 다른 경험이 하나의 과정으로 연결되어 보이고, 우리가 함께했던 순간을 다시 돌아볼 수 있는 세련된 디지털 아카이브 형태의 웹사이트로 만들어줘.'

export const statusMessages = [
  '프로젝트 구조를 구성하고 있습니다...',
  '34명의 이야기를 정리하고 있습니다...',
  '4가지 가치를 연결하고 있습니다...',
  '사진 아카이브를 준비하고 있습니다...',
  '레이아웃을 다듬고 있습니다...',
  '마지막 작업을 진행하고 있습니다...',
]

export const codingSequences: CodingSequence[] = [
  {
    file: 'App.vue',
    code: `<script setup lang="ts">
import ArchiveHero from './components/ArchiveHero.vue'
import ValueSection from './components/ValueSection.vue'
import StorySection from './components/StorySection.vue'
import PhotoGallery from './components/PhotoGallery.vue'
</script>

<template>
  <main class="archive">
    <ArchiveHero />
    <ValueSection />
    <StorySection />
    <PhotoGallery />
  </main>
</template>`,
  },
  {
    file: 'archiveData.ts',
    code: `export const values = [
  '함께 이해하기',
  '스스로 질문하기',
  '경험으로 배우기',
  '다음 여정 준비하기',
]

export const professionals = Array.from({ length: 34 }, (_, index) => ({
  id: index + 1,
  name: \`Pro \${String(index + 1).padStart(2, '0')}\`,
  story: '입문과정에서 발견한 나만의 장면',
  value: values[index % values.length],
  image: \`/photos/archive-\${index + 1}.jpg\`,
}))`,
  },
  {
    file: 'ValueSection.vue',
    code: `<script setup lang="ts">
defineProps<{
  values: string[]
}>()
</script>

<template>
  <section class="values">
    <article v-for="value in values" :key="value" class="value-card">
      <span class="value-mark"></span>
      <h2>{{ value }}</h2>
      <p>서로 다른 경험이 하나의 과정으로 연결됩니다.</p>
    </article>
  </section>
</template>`,
  },
  {
    file: 'StorySection.vue',
    code: `<script setup lang="ts">
import type { Professional } from '../types'

defineProps<{
  professionals: Professional[]
}>()
</script>

<template>
  <section class="stories">
    <StoryCard
      v-for="person in professionals"
      :key="person.id"
      :person="person"
    />
  </section>
</template>`,
  },
  {
    file: 'PhotoGallery.vue',
    code: `<template>
  <section class="photo-gallery" aria-label="입문과정 사진 아카이브">
    <figure v-for="photo in featuredPhotos" :key="photo.src">
      <img :src="photo.src" :alt="photo.alt" loading="lazy" />
      <figcaption>{{ photo.caption }}</figcaption>
    </figure>
  </section>
</template>

<script setup lang="ts">
const featuredPhotos = [
  { src: '/photos/day-1.jpg', alt: '첫 만남', caption: '시작의 장면' },
  { src: '/photos/team.jpg', alt: '팀 활동', caption: '함께 만든 시간' },
  { src: '/photos/final.jpg', alt: '마무리', caption: '다음으로 이어지는 기록' },
]
</script>`,
  },
]

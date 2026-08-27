<script setup lang="ts">
import viteLogo from '../assets/vite.svg'
import vueLogo from '../assets/vue.svg'
import ResourceCard, { type ResourceLink } from './ResourceCard.vue'

interface ResourceSection {
  title: string
  description: string
  iconId: string
  links: ResourceLink[]
}

const sections: ResourceSection[] = [
  {
    title: 'Documentation',
    description: 'Your questions, answered',
    iconId: 'documentation-icon',
    links: [
      {
        label: 'Explore Vite',
        href: 'https://vite.dev/',
        imageSrc: viteLogo,
        imageClass: 'h-[18px] w-auto',
      },
      {
        label: 'Learn more',
        href: 'https://vuejs.org/',
        imageSrc: vueLogo,
      },
    ],
  },
  {
    title: 'Connect with us',
    description: 'Join the Vite community',
    iconId: 'social-icon',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/vitejs/vite',
        iconId: 'github-icon',
      },
      {
        label: 'Discord',
        href: 'https://chat.vite.dev/',
        iconId: 'discord-icon',
      },
      {
        label: 'X.com',
        href: 'https://x.com/vite_js',
        iconId: 'x-icon',
      },
      {
        label: 'Bluesky',
        href: 'https://bsky.app/profile/vite.dev',
        iconId: 'bluesky-icon',
      },
    ],
  },
]
</script>

<template>
  <section class="flex flex-col border-t border-slate-200 dark:border-slate-700 md:flex-row">
    <ResourceCard
      v-for="(section, index) in sections"
      :key="section.title"
      v-bind="section"
      :class="{ 'border-b border-slate-200 dark:border-slate-700 md:border-r md:border-b-0': index === 0 }"
    />
  </section>
</template>

<script setup lang="ts">
export interface ResourceLink {
  label: string
  href: string
  imageSrc?: string
  iconId?: string
  imageClass?: string
}

interface Props {
  title: string
  description: string
  iconId: string
  links: ResourceLink[]
}

defineProps<Props>()
</script>

<template>
  <article class="flex-1 px-5 py-6 text-center md:px-8 md:py-8 md:text-left">
    <svg class="mx-auto mb-4 size-6 text-slate-900 md:mx-0 dark:text-slate-100" role="presentation" aria-hidden="true">
      <use :href="`/icons.svg#${iconId}`"></use>
    </svg>

    <h2 class="text-xl font-semibold text-slate-950 md:text-2xl dark:text-slate-50">
      {{ title }}
    </h2>
    <p class="mt-2 text-base text-slate-600 dark:text-slate-300">
      {{ description }}
    </p>

    <ul class="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
      <li v-for="link in links" :key="link.href" class="min-w-0">
        <a
          :href="link.href"
          target="_blank"
          rel="noreferrer"
          class="flex min-h-9 items-center justify-center gap-2 rounded-md bg-stone-100/80 px-3 py-1.5 text-sm font-medium text-slate-950 transition hover:shadow-lg md:text-base dark:bg-slate-800/70 dark:text-slate-50"
        >
          <img v-if="link.imageSrc" :class="link.imageClass ?? 'size-[18px]'" :src="link.imageSrc" alt="" />
          <svg v-else-if="link.iconId" class="size-[18px]" role="presentation" aria-hidden="true">
            <use :href="`/icons.svg#${link.iconId}`"></use>
          </svg>
          <span>{{ link.label }}</span>
        </a>
      </li>
    </ul>
  </article>
</template>

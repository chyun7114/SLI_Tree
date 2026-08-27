<script setup lang="ts">
import AppHero from './components/AppHero.vue'
import NextSteps from './components/NextSteps.vue'
</script>

<template>
  <main class="mx-auto flex min-h-svh w-full max-w-[1126px] flex-col border-x border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
    <AppHero />
    <div class="ticks"></div>
    <NextSteps />
    <div class="ticks"></div>
    <section class="h-12 border-t border-slate-200 dark:border-slate-700 md:h-22" aria-hidden="true"></section>
  </main>
</template>

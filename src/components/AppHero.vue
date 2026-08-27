<script setup lang="ts">
import { ref } from 'vue'
import heroImg from '../assets/hero.png'
import viteLogo from '../assets/vite.svg'
import vueLogo from '../assets/vue.svg'

const count = ref(0)
</script>

<template>
  <section class="flex flex-1 flex-col items-center justify-center gap-6 px-5 py-12 text-center md:gap-8">
    <div class="relative w-[170px]" aria-hidden="true">
      <img :src="heroImg" class="relative z-0 h-[179px] w-[170px]" width="170" height="179" alt="" />
      <img
        :src="vueLogo"
        class="absolute inset-x-0 top-[34px] z-10 mx-auto h-7 origin-center [transform:perspective(2000px)_rotateZ(300deg)_rotateX(44deg)_rotateY(39deg)_scale(1.4)]"
        alt=""
      />
      <img
        :src="viteLogo"
        class="absolute inset-x-0 top-[107px] z-0 mx-auto h-[26px] w-auto origin-center [transform:perspective(2000px)_rotateZ(300deg)_rotateX(40deg)_rotateY(39deg)_scale(0.8)]"
        alt=""
      />
    </div>

    <div class="space-y-4">
      <h1 class="text-4xl font-semibold tracking-normal text-slate-950 md:text-6xl dark:text-slate-50">
        Get started
      </h1>
      <p class="text-base text-slate-600 md:text-lg dark:text-slate-300">
        Edit <code class="rounded bg-stone-100 px-2 py-1 font-mono text-sm text-slate-950 dark:bg-slate-800 dark:text-slate-50">src/App.vue</code>
        and save to test
        <code class="rounded bg-stone-100 px-2 py-1 font-mono text-sm text-slate-950 dark:bg-slate-800 dark:text-slate-50">HMR</code>
      </p>
    </div>

    <button
      type="button"
      class="rounded-md border-2 border-transparent bg-violet-100 px-3 py-1.5 font-mono text-sm font-medium text-violet-700 transition hover:border-violet-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 dark:bg-violet-400/15 dark:text-violet-200 dark:hover:border-violet-300/50"
      @click="count++"
    >
      Count is {{ count }}
    </button>
  </section>
</template>

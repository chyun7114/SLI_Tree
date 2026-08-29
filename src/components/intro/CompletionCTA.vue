<script setup lang="ts">
interface Props {
  transitioning: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  enterMain: []
}>()
</script>

<template>
  <section class="mx-auto w-full max-w-5xl text-center">
    <p class="text-sm uppercase tracking-[0.28em] text-teal-600">Build completed</p>
    <h2 class="mt-4 whitespace-nowrap text-[2rem] font-semibold tracking-normal text-slate-950 sm:text-4xl md:text-5xl">
      34명의 이야기를 모두 담았습니다.
    </h2>
    <p class="mt-4 text-base leading-7 text-slate-600 md:text-lg">
      우리의 입문과정, 직접 확인해보시겠습니까?
    </p>

    <button
      class="group mt-8 inline-flex items-center gap-3 rounded-full bg-teal-500 px-6 py-3 text-base font-semibold text-white shadow-2xl shadow-teal-200/70 transition duration-300 hover:scale-[1.03] hover:bg-teal-600 hover:shadow-sky-200/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-400 disabled:cursor-wait disabled:opacity-70"
      type="button"
      :disabled="transitioning"
      @click="emit('enterMain')"
    >
      <span>웹사이트 보러가기</span>
      <span class="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </button>
  </section>
</template>

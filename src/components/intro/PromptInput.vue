<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { IntroStage } from '../../types/intro'

interface Props {
  modelValue: string
  stage: IntroStage
}

const props = defineProps<Props>()
const promptArea = ref<HTMLTextAreaElement | null>(null)
const promptRows = computed(() => Math.max(1, props.modelValue.split('\n').length))

const emit = defineEmits<{
  startTyping: []
  submit: []
}>()

function handleFocus() {
  if (props.stage === 'idle') {
    emit('startTyping')
  }
}

function handleSubmit() {
  if (props.stage === 'ready') {
    emit('submit')
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSubmit()
  }
}

function fitPromptHeight() {
  if (!promptArea.value) return

  promptArea.value.style.height = 'auto'
  promptArea.value.style.height = `${promptArea.value.scrollHeight}px`
}

watch(
  () => props.modelValue,
  async () => {
    await nextTick()
    fitPromptHeight()
  },
)
</script>

<template>
  <form
    class="mx-auto w-full max-w-3xl transition-all duration-700 ease-out"
    :class="stage === 'coding' || stage === 'completed' ? 'max-w-4xl translate-y-0 opacity-90' : ''"
    @submit.prevent="handleSubmit"
  >
    <label class="sr-only" for="intro-prompt">AI에게 요청할 웹사이트 설명</label>
    <div
      class="group flex min-h-18 items-end gap-3 rounded-[28px] border border-teal-200/80 bg-white/80 p-3 shadow-2xl shadow-sky-200/40 backdrop-blur-xl transition duration-500 focus-within:border-teal-300 focus-within:bg-white/95 md:min-h-20 md:p-4"
    >
      <button
        class="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-teal-700"
        type="button"
        aria-label="요청 추가"
        tabindex="-1"
      >
        <span class="material-symbols-rounded prompt-symbol" aria-hidden="true">attach_file</span>
      </button>

      <div class="relative min-h-11 flex-1 py-2 text-left">
        <textarea
          id="intro-prompt"
          ref="promptArea"
          :value="modelValue"
          class="block min-h-8 w-full resize-none overflow-hidden bg-transparent text-base font-semibold leading-8 text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
          :class="stage === 'idle' ? 'cursor-pointer' : 'cursor-default'"
          placeholder="무엇을 만들어볼까요?"
          :rows="promptRows"
          readonly
          @focus="handleFocus"
          @click="handleFocus"
          @keydown="handleKeydown"
        />
        <span
          v-if="stage === 'ready'"
          class="pointer-events-none ml-0.5 inline-block h-5 w-px animate-pulse bg-teal-500 align-middle"
          aria-hidden="true"
        ></span>
      </div>

      <button
        class="flex size-11 shrink-0 items-center justify-center rounded-2xl transition duration-300"
        :class="
          stage === 'ready'
            ? 'bg-teal-500 text-white shadow-lg shadow-teal-200/70 hover:scale-[1.03] hover:bg-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400'
            : 'cursor-not-allowed bg-slate-100 text-slate-400'
        "
        type="submit"
        :disabled="stage !== 'ready'"
        aria-label="요청 보내기"
      >
        <span class="material-symbols-rounded prompt-symbol" aria-hidden="true">arrow_upward</span>
      </button>
    </div>
  </form>
</template>

<style scoped>
.prompt-symbol {
  display: block;
  font-size: 22px;
  font-variation-settings:
    'FILL' 0,
    'wght' 500,
    'GRAD' 0,
    'opsz' 24;
  line-height: 1;
}
</style>

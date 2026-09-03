<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { CodingSequence } from '../../types/intro'
import { tokenizeCodeLine } from '../../utils/codeHighlighter'
import CodingStatus from './CodingStatus.vue'

interface Props {
  sequences: CodingSequence[]
  activeIndex: number
  code: string
  statusMessage: string
  progress: number
  completed: boolean
}

const props = defineProps<Props>()
const codeScroller = ref<HTMLElement | null>(null)

const activeFile = computed(() => props.sequences[props.activeIndex]?.file ?? props.sequences.at(-1)?.file ?? 'App.vue')
const highlightedLines = computed(() => props.code.split('\n').map(tokenizeCodeLine))

watch(
  () => props.code,
  async () => {
    await nextTick()
    if (codeScroller.value) {
      codeScroller.value.scrollTop = codeScroller.value.scrollHeight
    }
  },
)
</script>

<template>
  <section class="mx-auto flex w-full max-w-5xl flex-col gap-4">
    <div class="overflow-hidden rounded-2xl border border-slate-800/90 bg-[#101827] shadow-2xl shadow-sky-300/30">
      <div class="flex items-center justify-between border-b border-white/10 bg-[#172033] px-4 py-3">
        <div class="flex min-w-0 items-center gap-2">
          <span class="size-2.5 rounded-full bg-rose-300/80"></span>
          <span class="size-2.5 rounded-full bg-amber-200/80"></span>
          <span class="size-2.5 rounded-full bg-emerald-300/80"></span>
          <span class="ml-3 truncate text-xs font-medium text-sky-100">{{ activeFile }}</span>
        </div>
        <span
          class="rounded-full border border-sky-300/15 bg-sky-300/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.22em] text-sky-100/70"
        >
          Vibe build
        </span>
      </div>

      <pre
        ref="codeScroller"
        class="intro-scroll h-[46vh] min-h-80 overflow-y-auto px-4 py-5 text-left font-sans text-[12px] leading-6 text-slate-200 md:h-[430px] md:px-6 md:text-[13px]"
      ><code><template v-for="(line, lineIndex) in highlightedLines" :key="lineIndex"><span v-for="(token, tokenIndex) in line" :key="`${lineIndex}-${tokenIndex}`" :class="token.className">{{ token.text }}</span><br v-if="lineIndex < highlightedLines.length - 1" /></template></code><span v-if="!completed" class="ml-1 inline-block h-4 w-1 animate-pulse bg-teal-200 align-middle"></span></pre>
    </div>

    <CodingStatus :message="statusMessage" :progress="progress" :completed="completed" />
  </section>
</template>

<style scoped>
.intro-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(125, 211, 252, 0.42) transparent;
}

.intro-scroll::-webkit-scrollbar {
  width: 6px;
}

.intro-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.intro-scroll::-webkit-scrollbar-thumb {
  background: rgba(125, 211, 252, 0.35);
  border-radius: 999px;
}

:deep(.syntax-comment) {
  color: #6b7d90;
  font-style: italic;
}

:deep(.syntax-string) {
  color: #a7f3d0;
}

:deep(.syntax-tag) {
  color: #7dd3fc;
}

:deep(.syntax-keyword) {
  color: #c4b5fd;
}

:deep(.syntax-component) {
  color: #fcd34d;
}

:deep(.syntax-number) {
  color: #f9a8d4;
}

:deep(.syntax-success) {
  color: #86efac;
}
</style>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import CompletionCTA from '../components/intro/CompletionCTA.vue'
import CodingTerminal from '../components/intro/CodingTerminal.vue'
import IntroBackground from '../components/intro/IntroBackground.vue'
import IntroHeader from '../components/intro/IntroHeader.vue'
import PromptInput from '../components/intro/PromptInput.vue'
import { codingSequences, promptText, statusMessages } from '../data/codingSequences'
import type { IntroStage } from '../types/intro'

const emit = defineEmits<{
  enterMain: []
}>()

const stage = ref<IntroStage>('idle')
const typedPrompt = ref('')
const generatedCode = ref('')
const activeSequenceIndex = ref(0)
const activeStatusIndex = ref(0)
const progress = ref(0)

const timers: number[] = []

const isPromptCompact = computed(() => stage.value === 'coding' || stage.value === 'completed' || stage.value === 'transition')
const isTerminalVisible = computed(() => stage.value === 'coding' || stage.value === 'completed' || stage.value === 'transition')
const isCompleted = computed(() => stage.value === 'completed' || stage.value === 'transition')

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    const timer = window.setTimeout(resolve, ms)
    timers.push(timer)
  })
}

function clearTimers() {
  for (const timer of timers) {
    window.clearTimeout(timer)
  }
  timers.length = 0
}

async function startPromptTyping() {
  if (stage.value !== 'idle') return

  stage.value = 'typing'

  for (const char of Array.from(promptText)) {
    if (stage.value !== 'typing') return

    typedPrompt.value += char
    const pause = char === '\n' ? 120 : ['.', ',', '。', '，'].includes(char) ? 90 : 24 + Math.random() * 18
    await wait(pause)
  }

  stage.value = 'ready'
}

async function startCoding() {
  if (stage.value !== 'ready') return

  stage.value = 'coding'
  generatedCode.value = ''
  activeSequenceIndex.value = 0
  activeStatusIndex.value = 0
  progress.value = 2

  const totalCharacters = codingSequences.reduce((sum, sequence) => sum + sequence.code.length, 0)
  let writtenCharacters = 0

  for (let sequenceIndex = 0; sequenceIndex < codingSequences.length; sequenceIndex++) {
    const sequence = codingSequences[sequenceIndex]
    activeSequenceIndex.value = sequenceIndex
    generatedCode.value += `${sequence.file}\n${'='.repeat(sequence.file.length)}\n`
    await wait(120)

    const codeLines = sequence.code.split('\n')
    for (const line of codeLines) {
      if (stage.value !== 'coding') return

      const lineWithBreak = `${line}\n`
      generatedCode.value += lineWithBreak
      writtenCharacters += lineWithBreak.length
      activeStatusIndex.value = Math.min(
        statusMessages.length - 1,
        Math.floor((writtenCharacters / totalCharacters) * statusMessages.length),
      )
      progress.value = Math.min(96, 4 + (writtenCharacters / totalCharacters) * 92)
      await wait(line.trim().length === 0 ? 36 : 58 + Math.random() * 48)
    }

    generatedCode.value += '\n'
    await wait(180)
  }

  progress.value = 100
  generatedCode.value += '✓ Experience created successfully\n'
  await wait(650)
  stage.value = 'completed'
}

async function enterMain() {
  if (stage.value !== 'completed') return

  stage.value = 'transition'
  await wait(850)
  window.history.pushState({}, '', '/main')
  emit('enterMain')
}

onBeforeUnmount(clearTimers)
</script>

<template>
  <main class="relative min-h-svh overflow-hidden bg-[#f3f8ff] text-slate-800">
    <IntroBackground />

    <div
      class="relative z-10 flex min-h-svh flex-col px-5 py-8 transition duration-700 md:px-8"
      :class="isPromptCompact ? 'justify-start gap-6' : 'justify-center gap-10'"
    >
      <section
        class="mx-auto w-full max-w-4xl text-center transition-all duration-700 ease-out"
        :class="isPromptCompact ? 'pt-2 md:pt-5' : '-translate-y-4'"
      >
        <Transition name="fade-soft">
          <IntroHeader v-if="!isPromptCompact" />
        </Transition>

        <PromptInput :model-value="typedPrompt" :stage="stage" @start-typing="startPromptTyping" @submit="startCoding" />
      </section>

      <Transition name="terminal-rise">
        <CodingTerminal
          v-if="isTerminalVisible"
          :sequences="codingSequences"
          :active-index="activeSequenceIndex"
          :code="generatedCode"
          :status-message="statusMessages[activeStatusIndex]"
          :progress="progress"
          :completed="isCompleted"
        />
      </Transition>

      <Transition name="completion-fade">
        <CompletionCTA v-if="stage === 'completed' || stage === 'transition'" :transitioning="stage === 'transition'" @enter-main="enterMain" />
      </Transition>
    </div>

    <div
      class="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-0 bg-gradient-to-t from-teal-50 to-sky-50 transition-all duration-700 ease-in-out"
      :class="stage === 'transition' ? 'h-full' : ''"
    ></div>
  </main>
</template>

<style scoped>
.fade-soft-enter-active,
.fade-soft-leave-active,
.completion-fade-enter-active,
.completion-fade-leave-active,
.terminal-rise-enter-active,
.terminal-rise-leave-active {
  transition:
    opacity 520ms ease,
    transform 640ms ease;
}

.fade-soft-enter-from,
.fade-soft-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.terminal-rise-enter-from,
.terminal-rise-leave-to {
  opacity: 0;
  transform: translateY(28px);
}

.completion-fade-enter-from,
.completion-fade-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>

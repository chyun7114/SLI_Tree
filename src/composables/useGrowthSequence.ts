import { computed, nextTick, reactive, ref } from 'vue'
import type { BurstOrigin, GrowthValue, ValueId, ValueState } from '../types/growth'

const animationDelays = {
  burstToModal: 720,
  modalFade: 420,
  absorbToGrowth: 920,
  growth: 960,
}

function wait(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms))
}

export function useGrowthSequence(values: GrowthValue[]) {
  const completedValues = ref<ValueId[]>([])
  const activeMemory = ref<GrowthValue | null>(null)
  const isModalOpen = ref(false)
  const isAnimating = ref(false)
  const burstOrigin = ref<BurstOrigin | null>(null)
  const absorbKey = ref(0)
  const growthKey = ref(0)
  const lastTrigger = ref<HTMLElement | null>(null)

  const valueStates = reactive<Record<ValueId, ValueState>>(
    values.reduce(
      (states, value) => {
        states[value.id] = 'idle'
        return states
      },
      {} as Record<ValueId, ValueState>,
    ),
  )

  const treeStage = computed(() => completedValues.value.length)
  const isComplete = computed(() => completedValues.value.length === values.length)

  async function selectValue(value: GrowthValue, event?: MouseEvent | KeyboardEvent) {
    if (isAnimating.value || completedValues.value.includes(value.id)) return

    const target = event?.currentTarget instanceof HTMLElement ? event.currentTarget : null
    const rect = target?.getBoundingClientRect()

    lastTrigger.value = target
    isAnimating.value = true
    valueStates[value.id] = 'bursting'
    burstOrigin.value = {
      id: value.id,
      x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
      y: rect ? rect.top + rect.height / 2 : window.innerHeight * 0.32,
    }

    await wait(animationDelays.burstToModal)
    activeMemory.value = value
    valueStates[value.id] = 'memory'
    isModalOpen.value = true
  }

  async function closeMemory() {
    if (!activeMemory.value) return

    const value = activeMemory.value
    isModalOpen.value = false

    await wait(animationDelays.modalFade)
    valueStates[value.id] = 'absorbing'
    absorbKey.value += 1

    await wait(animationDelays.absorbToGrowth)
    completedValues.value = [...completedValues.value, value.id]
    valueStates[value.id] = 'completed'
    growthKey.value += 1

    await wait(animationDelays.growth)
    activeMemory.value = null
    burstOrigin.value = null
    isAnimating.value = false

    await nextTick()
    lastTrigger.value?.focus()
  }

  return {
    completedValues,
    activeMemory,
    isModalOpen,
    isAnimating,
    burstOrigin,
    absorbKey,
    growthKey,
    valueStates,
    treeStage,
    isComplete,
    selectValue,
    closeMemory,
  }
}

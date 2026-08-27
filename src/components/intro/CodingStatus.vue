<script setup lang="ts">
interface Props {
  message: string
  progress: number
  completed: boolean
}

defineProps<Props>()
</script>

<template>
  <aside class="flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/65 p-4 text-sm text-slate-700 shadow-xl shadow-sky-200/30 backdrop-blur-xl md:min-w-64">
    <Transition name="status-slide" mode="out-in">
      <div :key="message" class="flex items-center gap-3">
        <span
          class="size-2 rounded-full"
          :class="completed ? 'bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.42)]' : 'animate-pulse bg-sky-500 shadow-[0_0_18px_rgba(14,165,233,0.36)]'"
          aria-hidden="true"
        ></span>
        <span>{{ completed ? 'Experience created successfully' : message }}</span>
      </div>
    </Transition>

    <div class="h-1 w-full overflow-hidden rounded-full bg-slate-200/80">
      <div
        class="h-full rounded-full bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 transition-all duration-300"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>

    <div class="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-slate-500">
      <span>Building experience</span>
      <span>{{ Math.round(progress) }}%</span>
    </div>
  </aside>
</template>

<style scoped>
.status-slide-enter-active,
.status-slide-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.status-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.status-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

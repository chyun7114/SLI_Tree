<template>
  <Transition name="completion-message">
    <p class="completion-message">네 개의 가치가 우리의 성장으로 이어졌습니다.</p>
  </Transition>
</template>

<style scoped>
.completion-message {
  position: absolute;
  left: 50%;
  bottom: clamp(92px, 13vh, 144px);
  z-index: 6;
  width: min(82vw, 520px);
  margin: 0;
  color: rgba(236, 246, 232, 0.9);
  font-size: clamp(0.9rem, 1.3vw, 1.06rem);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.6;
  text-align: center;
  text-shadow: 0 2px 18px rgba(9, 22, 15, 0.66);
  transform: translateX(-50%);
}

.completion-message-enter-active,
.completion-message-leave-active {
  transition:
    opacity 800ms ease,
    transform 800ms ease;
}

.completion-message-enter-from,
.completion-message-leave-to {
  opacity: 0;
  transform: translate(-50%, 12px);
}
</style>

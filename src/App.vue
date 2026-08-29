<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import IntroPage from './pages/IntroPage.vue'
import MainPage from './pages/MainPage.vue'

const path = ref(window.location.pathname)
const isMainPage = computed(() => path.value === '/main')

function syncPath() {
  path.value = window.location.pathname
}

function enterMain() {
  path.value = '/main'
}

onMounted(() => {
  window.addEventListener('popstate', syncPath)
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', syncPath)
})
</script>

<template>
  <MainPage v-if="isMainPage" />
  <IntroPage v-else @enter-main="enterMain" />
</template>

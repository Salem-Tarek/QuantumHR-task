
<template>
  <Toast />
  <div class="fixed bottom-8 left-8 z-[999999]">
    <a href="https://github.com/Salem-Tarek/QuantumHR-task" target="_blank">
      <i class="pi pi-github text-3xl web:text-6xl"></i>
    </a>
  </div>
  <div v-if="showLayout" class="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
    <Header />
    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
        <div class="container mx-auto web:px-6 py-8">
          <router-view :key="$route.fullPath" />
        </div>
      </main>
    </div>
  </div>
  <router-view :key="$route.fullPath" v-else />
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/Header.vue';

const route = useRoute();
const showLayout = computed(() => route.meta.layout !== false);
</script>

<style scoped>
/* No specific styles needed here yet, Tailwind classes handle most of it */
</style>

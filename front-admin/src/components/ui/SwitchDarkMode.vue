<script setup>
import { ref, watchEffect } from 'vue';
import Moon from '@/components/icons/Moon.vue';
import Sun from '@/components/icons/Sun.vue';

const isChecked = ref(false);

const darkModeActive = ref(window.matchMedia('(prefers-color-scheme: dark)').matches);

watchEffect(() => {
  darkModeActive.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
});

watchEffect(darkModeActive, () => {
  isChecked.value = darkModeActive.value;
});
const toggleDarkMode = () => {
  const darkMode = !document.documentElement.classList.contains('dark');
  localStorage.setItem('dark', JSON.stringify(darkMode));
  if (darkMode) {
    document.documentElement.classList.add('dark');
    document.documentElement.dataset.mode = 'dark';
    return;
  }
  document.documentElement.classList.remove('dark');
  document.documentElement.dataset.mode = '';
};
</script>

<template>
  <section class="flex items-center justify-center gap-2">
    <span class="dark:text-palette-primary-500 text-soft-black"> </span>
    <label class="relative inline-flex items-center space-x-2 cursor-pointer">
      <input type="checkbox" @click="toggleDarkMode" v-model="isChecked" class="hidden" />
      <div
        class="relative w-12 h-6 border-2 bg-transparent border-palette-primary-500 rounded-full transition-colors"
      >
        <Sun class="absolute top-1/2 origin-center right-0" size="12" color="#ff3600" />
        <Moon class="absolute top-1/2 origin-center left-3" size="12" color="#ff3600" />
      </div>
      <div
        :class="{
          // 'bg-soft-black': isChecked,
          // 'bg-soft-white': !isChecked,
          'translate-x-6': isChecked,
          'translate-x-0': !isChecked
        }"
        class="absolute bg-palette-primary-500 top-1 left-1 w-4 h-4 rounded-full shadow-md transform transition-transform"
      ></div>
    </label>
  </section>
</template>

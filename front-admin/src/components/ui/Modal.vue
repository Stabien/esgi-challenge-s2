<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
const props = defineProps(['toggle']);

const modal = ref(null);

const handleRefClick = (event) => {
  if (modal.value && !modal.value.contains(event.target)) props.toggle(false);
};

onMounted(() =>
  setTimeout(() => {
    window.addEventListener('click', handleRefClick);
  }, 50)
);

onUnmounted(() => window.removeEventListener('click', handleRefClick));
</script>

<template>
  <div
    ref="modal"
    class="animate-slideDownAndFade absolute shadow-default inline-block p-4 bg-white rounded"
  >
    <slot></slot>
  </div>
</template>

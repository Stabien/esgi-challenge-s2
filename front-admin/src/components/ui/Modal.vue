<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
const props = defineProps(['toggle', 'fullHeight']);

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
    :class="
      props.fullHeight
        ? ' w-full h-full top-0 left-0 bg-soft-black flex justify-center items-center bg-opacity-70'
        : ''
    "
    class="animate-slideDownAndFade z-[999] absolute shadow-default p-4 rounded flex flex-col gap-4"
    @click="
      (e) => {
        if (!props.fullHeight || e.target !== modal) return;
        props.toggle();
      }
    "
  >
    <div
      class="animate-slideDownAndFade z-[999] absolute shadow-default inline-block p-4 rounded bg-white"
      v-if="props.fullHeight"
    >
      <slot></slot>
    </div>

    <slot v-else></slot>
  </div>
</template>

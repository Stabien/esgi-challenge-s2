<script setup>
const props = defineProps(['icon', 'label']);
</script>

<template>
  <RouterLink
    :style="{
      'grid-template-columns': 'auto 1fr'
    }"
    class="grid gap-2 px-2 py-1 text-sm"
  >
    <component :is="props.icon" height="24" width="24" />

    {{ props.label }}
  </RouterLink>
</template>

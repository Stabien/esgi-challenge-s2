<script setup>
import Button from '@/components/ui/Button.vue';

const props = defineProps(['variant', 'class']);
</script>

<template>
  <RouterLink>
    <Button :class="props.class" :variant="variant" v-track:LINK.click>
      <slot></slot>
    </Button>
  </RouterLink>
</template>

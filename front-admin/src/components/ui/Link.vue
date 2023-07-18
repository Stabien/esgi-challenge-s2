<script setup>
import Button from '@/components/ui/Button.vue'
</script>

<template>
  <RouterLink>
    <Button variant="link">
      <slot></slot>
    </Button>
  </RouterLink>
</template>

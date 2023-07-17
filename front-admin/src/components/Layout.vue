<script setup>
import { RouterLink } from 'vue-router'
import IconCommunity from './icons/IconCommunity.vue'
import VueLink from '@/src/components/ui/VueLink'
</script>

<template>
  <header class="bg-green-100 flex items-center justify-between px-4">
    <div class="h-8 w-8 bg-red-400 flex items-center justify-center">
      <IconCommunity />
    </div>
    <nav class="flex gap-4">
      <VueLink to="/">sdfsdfsdf</VueLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/test">Test</RouterLink>
    </nav>
  </header>
</template>

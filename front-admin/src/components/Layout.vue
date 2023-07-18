<script setup>
// import { RouterLink } from 'vue-router'
import IconCommunity from './icons/IconCommunity.vue'
import Link from '@/components/ui/Link.vue'
</script>

<template>
  <header class="flex items-center justify-between px-4">
    <div class="h-8 w-8 bg-red-400 flex items-center justify-center">
      <IconCommunity />
    </div>
    <nav class="flex gap-4">
      <Link class="dark:text-gray-200" to="/">Home</Link>
      <Link class="dark:text-gray-200" to="/about">About</Link>
      <Link class="dark:text-gray-200" to="/login">Login</Link>
    </nav>
  </header>
</template>

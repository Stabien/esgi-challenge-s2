<script setup>
// import { RouterLink } from 'vue-router'
import Link from '@/components/ui/Link.vue'
import { getLogo } from '@/utils'

getLogo()
</script>

<template>
  <header class="flex items-center justify-between px-4">
    <div class="flex items-center justify-center">
      <img class="h-24 w-24" :src="getLogo()" alt="" srcset="" />
    </div>
    <nav class="flex gap-4">
      <Link class="dark:text-gray-200" to="/">Home</Link>
      <Link class="dark:text-gray-200" to="/about">About</Link>
      <Link class="dark:text-gray-200" to="/login">Login</Link>
    </nav>
  </header>
</template>

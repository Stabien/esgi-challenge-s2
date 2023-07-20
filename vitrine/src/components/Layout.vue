<script setup>
// import { RouterLink } from 'vue-router'
import Link from '@/components/ui/Link.vue'
import { getLogo } from '@/utils'

getLogo()
</script>

<template>
  <header class="w-full fixed top-0 flex items-center justify-between p-4">
    <div class="flex items-center justify-center">
      <Link class="dark:text-gray-200" to="/">
        <img class="h-10" :src="getLogo()" alt="" srcset="" />
      </Link>
    </div>
    <nav class="flex gap-4">
      <Link class="dark:text-gray-200" to="/blog">Blog</Link>
      <Link class="dark:text-gray-200" to="/about">About</Link>
      <Link class="dark:text-gray-200" to="/login">Login</Link>
    </nav>
  </header>
</template>

<script setup>
// import { RouterLink } from 'vue-router'
import Link from '@/components/ui/Link.vue'
import { getLogo } from '@/utils'
import SwitchDarkMode from '@/components/ui/SwitchDarkMode.vue'

getLogo()
</script>

<template>
  <SwitchDarkMode :style="{ zIndex: 100 }" class="absolute bottom-5 right-5 z-50" />
  <header
    class="w-full fixed top-0 flex items-center justify-between p-4 z-50 mix-blend-difference invert text-soft-black"
  >
    <div class="flex text-black items-center justify-center">
      <Link to="/">
        <img class="h-10" :src="getLogo()" alt="" srcset="" />
      </Link>
    </div>
    <nav class="flex gap-4">
      <Link to="/blog">Blog</Link>
      <Link to="/about">About</Link>
      <Link to="/login">Login</Link>
    </nav>
  </header>
</template>

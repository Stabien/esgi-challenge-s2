<script setup>
// import { RouterLink } from 'vue-router'
import Link from '@/components/ui/Link.vue';
import { getLogo } from '@/utils';
import SwitchDarkMode from '@/components/ui/SwitchDarkMode.vue';

getLogo();
</script>

<template>
  <SwitchDarkMode :style="{ zIndex: 100 }" class="fixed bottom-5 right-5 z-50" />
  <header
    class="mix-blend-difference invert w-full fixed top-0 flex items-center justify-between p-4 z-100 text-soft-black"
  >
    <div class="flex items-center justify-center">
      <Link variant="link" to="/">
        <img class="h-10" :src="getLogo()" alt="" srcset="" />
      </Link>
    </div>
    <nav class="flex gap-4">
      <Link variant="link" to="/blog">Blog</Link>
      <Link variant="link" to="/about">About</Link>
      <Link variant="outline" class="dark:invert" to="/login">Login</Link>
      <Link variant="default" class="dark:invert" to="/join">Join</Link>
    </nav>
  </header>
</template>

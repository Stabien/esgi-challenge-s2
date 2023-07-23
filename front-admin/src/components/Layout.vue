<script setup>
// import { RouterLink } from 'vue-router'
import Link from '@/components/ui/Link.vue';
import { inject } from 'vue';
import { getLogo } from '@/utils';
import SwitchDarkMode from '@/components/ui/SwitchDarkMode.vue';

getLogo();
const { user, setIsLogged } = inject('user');
</script>

<template>
  <SwitchDarkMode :style="{ zIndex: 100 }" class="fixed bottom-5 right-5 z-50" />
  <header
    class="mix-blend-difference invert w-full fixed top-0 flex items-center justify-between p-4 z-50 text-soft-black"
  >
    <div class="flex items-center justify-center">
      <Link variant="link" to="/">
        <img class="h-10" :src="getLogo()" alt="" srcset="" />
      </Link>
    </div>
    <nav class="flex gap-4">
      <Link v-if="!user.isLogged" variant="outline" class="dark:invert" to="/login">Login</Link>
      <Link v-if="!user.isLogged" variant="default" class="dark:invert" to="/join">Join</Link>
      <Link v-if="user.isLogged" variant="default" class="dark:invert" to="/join"
        >Make a demand</Link
      >
    </nav>
  </header>
</template>

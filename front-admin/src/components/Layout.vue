<script setup>
// import { RouterLink } from 'vue-router'
import Link from '@/components/ui/Link.vue';
import Button from '@/components/ui/Button.vue';
import { inject } from 'vue';
import { getLogo } from '@/utils';
import SwitchDarkMode from '@/components/ui/SwitchDarkMode.vue';

getLogo();
const { user, setIsLogged } = inject('user');
</script>

<template>
  <SwitchDarkMode :style="{ zIndex: 100 }" class="fixed bottom-5 right-5 z-50" />
  <header class="w-full fixed top-0 flex items-center justify-between p-4 z-50">
    <div class="flex items-center justify-center">
      <Link variant="link" to="/">
        <img class="h-10 invert mix-blend-difference" :src="getLogo()" alt="" srcset="" />
      </Link>
    </div>
    <nav class="flex gap-4">
      <Link v-if="!user.isLogged" variant="outline" to="/login">Login</Link>
      <Link v-if="!user.isLogged" variant="default" to="/join">Join</Link>
      <Button v-if="!user.isLogged" variant="outline" @click="setIsLogged(true)">QuickLogin</Button>
      <Link v-if="user.isLogged" variant="default" to="/graph">Graphs</Link>
      <Button v-if="user.isLogged" variant="default" @click="setIsLogged(false)">Logout</Button>
    </nav>
  </header>
</template>

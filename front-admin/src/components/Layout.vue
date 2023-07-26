<script setup>
import { userStatusWebmaster, userStatusAdmin } from '@/utils/userConstant';
import Link from '@/components/ui/Link.vue';
import Button from '@/components/ui/Button.vue';
import { inject } from 'vue';
import { getLogo } from '@/utils';
import SwitchDarkMode from '@/components/ui/SwitchDarkMode.vue';
import { removeLocalStorageItem } from '@/utils';

getLogo();
const { user } = inject('user');
const logout = () => {
  removeLocalStorageItem('token');
};
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
      <!-- is logged :{{ user.isLogged }} status:{{ user.status }} -->
      <Link v-if="!user.isLogged" variant="outline" to="/login">Login</Link>
      <Link v-if="!user.isLogged" variant="default" to="/join">Join</Link>

      <Link
        v-if="user.isLogged && user.status === userStatusWebmaster"
        variant="default"
        to="/graph"
        >Graphs</Link
      >
      <Link v-if="user.isLogged && user.status === userStatusAdmin" variant="default" to="/admin"
        >Admin</Link
      >
      <Button v-if="user.isLogged" variant="default" @click="logout">Logout</Button>
    </nav>
  </header>
</template>

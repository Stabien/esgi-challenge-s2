<script setup>
import { userStatusWebmaster, userStatusAdmin, userStatusValidated } from '@/utils/userConstant';
import Link from '@/components/ui/Link.vue';
import Button from '@/components/ui/Button.vue';
import { inject } from 'vue';
import { getLogo } from '@/utils';
import SwitchDarkMode from '@/components/ui/SwitchDarkMode.vue';
import { removeLocalStorageItem, getConnectionProviderValue } from '@/utils';

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
        <img class="h-10 dark:invert dark:mix-blend-difference" :src="getLogo()" alt="" srcset="" />
      </Link>
    </div>
    <nav class="flex gap-4">
      <Link v-if="!user.isLogged" variant="outline" to="/login">Login</Link>
      <Link v-if="!user.isLogged" variant="default" to="/join">Join</Link>
      <Link
        v-if="user.isLogged && user.isActive === userStatusValidated"
        variant="default"
        to="/graph"
        >Graphs</Link
      >
      <Link v-if="user.isLogged && user.status === userStatusAdmin" variant="default" to="/admin"
        >Admin</Link
      >
      <Button v-if="user.isLogged" variant="default" @click="logout">Logout</Button>
      <div v-if="user.isLogged && user.isActive === userStatusValidated">APP_ID : {{ user.decodedToken.appId }}</div>
    </nav>
  </header>
</template>

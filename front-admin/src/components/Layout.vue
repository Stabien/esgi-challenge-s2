<script setup>
import { userStatusWebmaster, userStatusAdmin, userStatusValidated } from '@/utils/userConstant';
import Link from '@/components/ui/Link.vue';
import Button from '@/components/ui/Button.vue';
import { inject } from 'vue';
import { getLogo } from '@/utils';
import SwitchDarkMode from '@/components/ui/SwitchDarkMode.vue';
import { removeLocalStorageItem } from '@/utils';
import { useRouter } from 'vue-router';

getLogo();
const router = useRouter();

const { user } = inject('user');
const logout = () => {
  removeLocalStorageItem('token');
  router.push('/');
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
    <nav class="flex gap-4 items-center">
      <Link variant="outline" to="/tuto">Installation tutorial</Link>
      <Link v-if="!user.isLogged" variant="outline" to="/login">Login</Link>
      <Link v-if="!user.isLogged" variant="default" to="/join">Join</Link>
      <Link
        v-if="
          user.isLogged &&
          user.isActive === userStatusValidated &&
          user.status === userStatusWebmaster
        "
        variant="default"
        to="/graph"
        >Graphs</Link
      >
      <Link v-if="user.isLogged && user.status === userStatusAdmin" variant="default" to="/admin"
        >Admin</Link
      >
      <Button v-if="user.isLogged" variant="default" @click="logout" data-cy="logout"
        >Logout</Button
      >
    </nav>
  </header>
  <div
    v-if="user.isLogged"
    class="bg-palette-primary-500 px-6 font-bold text-soft-white py-2 rounded-full fixed z-50 bottom-4 left-4"
  >
    <div>
      connected with :
      <span class="font-bold">
        {{ user.decodedToken.email }}
      </span>
    </div>
    <div class="" v-if="user.status === userStatusWebmaster">
      <span v-if="user.isActive !== userStatusValidated">Pending</span>
      <span v-else> APP_ID : {{ user.decodedToken.appId }} </span>
    </div>
  </div>
</template>

<script setup>
import Avatar from 'vue-boring-avatars';
import { userStatusWebmaster, userStatusAdmin, userStatusValidated } from '@/utils/userConstant';
import Link from '@/components/ui/Link.vue';
import GraphBarIcon from '@/components/icons/GraphBarIcon.vue';
import AdminIcon from '@/components/icons/AdminIcon.vue';
import ArrowBracketIcon from '@/components/icons/ArrowBracketIcon.vue';
import AccountSettingsIcon from '@/components/icons/AccountSettingsIcon.vue';
import { inject, onMounted, ref } from 'vue';
import { getLogo, getRandomColorsAvatar } from '@/utils';
import SwitchDarkMode from '@/components/ui/SwitchDarkMode.vue';

const { user } = inject('user');

const isMenuOpened = ref(false);

const openMenu = () => (isMenuOpened.value = !isMenuOpened.value);

onMounted(() => {
  getLogo();
});
</script>

<template>
  <RouterLink
    to="/tuto"
    title="Installation tutorial"
    class="fixed bottom-5 right-20 z-50 rounded-full border-2 font-bold border-soft-black text-soft-black dark:border-soft-white dark:text-soft-white h-6 w-6 flex justify-center items-center"
    >?
  </RouterLink>
  <SwitchDarkMode :style="{ zIndex: 100 }" class="fixed bottom-5 right-5 z-50" />
  <header class="w-full fixed top-0 flex items-center justify-between p-4 z-50">
    <div class="flex items-center justify-center">
      <Link variant="link" to="/">
        <img class="h-10 dark:invert dark:mix-blend-difference" :src="getLogo()" alt="" srcset="" />
      </Link>
    </div>
    <nav class="flex gap-4 items-center">
      <!-- <Button @click="() => console.log(user)">log User</Button> -->
      <Link v-if="!user.isLogged" variant="outline" to="/login">Login</Link>
      <Link v-if="!user.isLogged" variant="default" to="/join">Join</Link>
      <div v-if="user.isLogged" @click="openMenu" class="relative flex items-center cursor-pointer">
        <div class="relative w-10 h-10">
          <Avatar :colors="getRandomColorsAvatar()" class="absolute absolute-center" />
          <span
            class="text-xl select-none uppercase mix-blend-difference font-bold text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >{{ user.decodedToken.email.charAt(0) || '' }}</span
          >
        </div>
        <ChevronDown class="transition-all" :transform="`rotate(${isMenuOpened ? '180' : '0'})`" />
        <div
          v-if="isMenuOpened"
          class="absolute top-12 right-0 flex flex-col gap-2 p-4 rounded w-max bg-palette-gray-800 text-palette-gray-200"
        >
          <div
            :style="{
              'grid-template-columns': 'auto 1fr'
            }"
            class="grid gap-2 px-2 py-1 text-sm"
          >
            <UserIcon height="24" width="24" />

            {{ user.decodedToken.email }}
          </div>
          <div
            v-if="!user.decodedToken.isAdmin"
            :style="{
              'grid-template-columns': 'auto 1fr'
            }"
            class="grid gap-2 px-2 py-1 text-sm"
          >
            <AdminIcon height="24" width="24" />

            {{ user.decodedToken.appId }}
          </div>
          <hr class="border-palette-gray-500" />
          <LinkMenu
            to="/graph"
            v-if="
              user.isLogged &&
              user.isActive === userStatusValidated &&
              user.status === userStatusWebmaster
            "
            :icon="GraphBarIcon"
            label="Graphs"
          />
          <LinkMenu
            v-if="user.isLogged && user.status === userStatusWebmaster"
            to="/account-settings"
            :icon="AccountSettingsIcon"
            label="Account Settings"
          />
          <LinkMenu
            v-if="user.isLogged && user.status === userStatusAdmin"
            to="/admin"
            :icon="AdminIcon"
            label="Admin"
          />
          <LinkMenu v-if="user.isLogged" to="/logout" :icon="ArrowBracketIcon" label="Logout" />
        </div>
      </div>
    </nav>
  </header>
</template>

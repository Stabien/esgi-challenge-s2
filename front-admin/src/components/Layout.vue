<script setup>
import Avatar from 'vue-boring-avatars';
import { userStatusWebmaster, userStatusAdmin, userStatusValidated } from '@/utils/userConstant';
import Link from '@/components/ui/Link.vue';
import GraphBarIcon from '@/components/icons/GraphBarIcon.vue';
import AdminIcon from '@/components/icons/AdminIcon.vue';
import ArrowBracketIcon from '@/components/icons/ArrowBracketIcon.vue';
import UserIcon from '@/components/icons/UserIcon.vue';
import { inject, ref } from 'vue';
import { getLogo, getRandomColorsAvatar } from '@/utils';
import SwitchDarkMode from '@/components/ui/SwitchDarkMode.vue';
import SpeakerIcon from './icons/SpeakerIcon.vue';
import HeatmapIcon from './icons/HeatmapIcon.vue';

const { user } = inject('user');

const isMenuOpened = ref(false);

const openMenu = (isOpen) => (isMenuOpened.value = isOpen);
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
      <div
        v-if="user.isLogged"
        @click="openMenu(!isMenuOpened)"
        class="relative flex items-center cursor-pointer"
      >
        <div class="relative w-10 h-10">
          <Avatar :colors="getRandomColorsAvatar()" class="absolute absolute-center" />
          <span
            class="text-xl select-none uppercase mix-blend-difference font-bold text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >{{ user.decodedToken.email.charAt(0) || '' }}</span
          >
        </div>
        <ChevronDown class="transition-all" :transform="`rotate(${isMenuOpened ? '180' : '0'})`" />
        <Modal
          :toggle="openMenu"
          v-if="isMenuOpened"
          class="top-12 right-0 flex flex-col gap-2 p-4 rounded bg-palette-gray-800 dark:text-palette-gray-200"
        >
          <div
            v-if="!user.decodedToken.isAdmin"
            :style="{
              'grid-template-columns': 'auto 1fr'
            }"
            :title="`Your appId: ${user.decodedToken.appId}`"
            class="grid gap-2 px-2 py-1 text-sm cursor-default"
          >
            <AdminIcon height="24" width="24" />

            {{ user.decodedToken.appId }}
          </div>
          <hr v-if="!user.decodedToken.isAdmin" class="border-palette-gray-500" />
          <LinkMenu
            v-if="user.isLogged && user.status === userStatusWebmaster"
            to="/account-settings"
            :icon="UserIcon"
            :label="user.decodedToken.email"
          />
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
            to="/heatmap"
            v-if="
              user.isLogged &&
              user.isActive === userStatusValidated &&
              user.status === userStatusWebmaster
            "
            :icon="HeatmapIcon"
            label="Heatmap"
          />
          <LinkMenu
            to="/alerts"
            v-if="
              user.isLogged &&
              user.isActive === userStatusValidated &&
              user.status === userStatusWebmaster
            "
            :icon="SpeakerIcon"
            label="Alerts"
          />
          <LinkMenu
            v-if="user.isLogged && user.status === userStatusAdmin"
            to="/admin"
            :icon="AdminIcon"
            label="Admin"
          />
          <LinkMenu v-if="user.isLogged" to="/logout" :icon="ArrowBracketIcon" label="Logout" />
        </Modal>
      </div>
    </nav>
  </header>
</template>

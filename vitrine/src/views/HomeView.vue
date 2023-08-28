<script setup>
import SquareImg from '@/components/SquareImg.vue';
import { urlImg } from '@/utils/constant';
import { getRandomItem } from '@/utils';
// import { Tracker } from 'tracker-vite';
import {onMounted} from "vue";
import {exportData} from "../utils/trackerUtils/handleEvents";
import {getURL} from "../utils/trackerUtils/handleUrl";

onMounted(() => {
exportData({
    appId: import.meta.env.VITE_TRACKER_APPID,
    event: 'print',
    url: getURL(),
    sessionId: window.localStorage.getItem("Session_ID"),
    timestamp: Date.now()
  })
});
</script>

<template>
  <main>
    <SquareImg class="h-96 w-96 left-3/4 origin-center top-1/2" :src="getRandomItem(urlImg)" />
    <section class="flex gap-8 flex-col w-min mx-auto">
      <span class="uppercase w-min font-bold text-[8rem]">Virtual</span>
      <span class="uppercase w-min font-bold text-[8rem] ml-56 font-gridular">world</span>
<!--      <Tracker />-->
    </section>
  </main>
</template>

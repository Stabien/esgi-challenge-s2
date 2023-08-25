<script setup>
import { blogArray } from '@/utils/constant'
import ArrowLeft from '@/components/icons/ArrowLeft.vue'
import Link from '@/components/ui/Link.vue'

import { useRoute } from 'vue-router'
import {onMounted} from "vue";
import {exportData} from "../utils/trackerUtils/handleEvents";
import {getURL} from "../utils/trackerUtils/handleUrl";
const route = useRoute()
const articleItem = blogArray.find((blog) => blog.image === route.params.name)

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
  <main
    :style="{
      'grid-template-columns': '1fr 1fr',
      'background-image': `url(/${articleItem.image}.png)`
    }"
    class="h-screen bg-cover px-8"
  >
    <Link
      variant="empty"
      to="/blog"
      class="uppercase bg-white text-soft-black hover:underline flex items-center gap-3"
    >
      <ArrowLeft size="16" color="black" /> Back to blog</Link
    >
    <h1 class="font-bold text-palette-primary-500 text-[5rem]">{{ articleItem.title }}</h1>
    <h2 class="absolute bottom-3 font-bold text-white">{{ articleItem.date }}</h2>
  </main>
</template>

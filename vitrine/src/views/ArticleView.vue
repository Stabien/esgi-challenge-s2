<script setup>
import { blogArray } from '@/utils/constant'
import ArrowLeft from '@/components/icons/ArrowLeft.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const articleItem = blogArray.find((blog) => blog.image === route.params.name)
console.log(articleItem)
</script>

<template>
  <main
    :style="{
      'grid-template-columns': '1fr 1fr',
      'background-image': `url(/${articleItem.image}.png)`
    }"
    class="h-screen bg-cover px-8"
  >
    <RouterLink to="/blog" class="uppercase text-white hover:underline flex items-center gap-3">
      <ArrowLeft size="16" color="white" /> Back to blog</RouterLink
    >
    <h1 class="font-bold text-palette-primary-500 text-[5rem]">{{ articleItem.title }}</h1>
    <h2 class="absolute bottom-3 font-bold text-white">{{ articleItem.date }}</h2>
  </main>
</template>

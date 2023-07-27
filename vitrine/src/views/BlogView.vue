<script setup>
import { blogArray } from '@/utils/constant';
</script>

<template>
  <main class="grid grid-cols-1 md:grid-cols-2 h-screen z-10">
    <section class="relative hidden md:block text-[4rem] xl:text-[7rem] uppercase font-bold">
      <span class="absolute origin-center left-1/3 top-1/4"> blog </span>
      <span class="font-gridular absolute origin-center left-2/4 top-1/2 transition-all">
        articles
      </span>
    </section>
    <section
      class="overflow-y-auto px-8 md:px-0 flex flex-col gap-4 h-full hide-scrollbar relative"
    >
      <div v-for="(item, index) in blogArray" :key="index" class="flex items-start gap-4">
        <img
          :src="`/${item.image}.png`"
          :alt="item.alt"
          class="rounded aspect-square h-40 xl:h-96 object-cover"
        />
        <div class="">
          <span class="text-palette-primary-500 text-sm">{{ item.date }}</span>
          <p class="mt-4 text-3xl font-normal">
            {{ item.title }}
          </p>
          <p class="my-4 w-3/4">{{ item.resume }}</p>
          <RouterLink
            :to="`/article/${item.image}`"
            v-track.click
            class="font-semibold bg-soft-black text-xs text-soft-white dark:bg-soft-white dark:text-soft-black rounded-full px-2 py-1"
          >
            Read the article
          </RouterLink>
        </div>
      </div>
      <div
        class="fixed bottom-0 w-full h-24 bg-gradient-to-b from-transparent to-soft-black dark:to-palette-gray-800"
      ></div>
    </section>
  </main>
</template>

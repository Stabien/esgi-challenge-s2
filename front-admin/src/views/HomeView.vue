<script setup>
import { getRandomItem } from '@/utils'

getRandomItem
</script>

<template>
  <main>
    <!-- <SquareImg class="h-96 w-96 left-3/4 origin-center top-1/2" :src="getRandomItem(urlImg)" /> -->
    <section class="flex gap-8 flex-col w-min mx-auto">
      <span class="uppercase w-min font-bold text-[8rem] text-soft-black">Tracking</span>
      <span class="uppercase w-min font-bold text-[8rem] ml-56 font-gridular">world</span>
    </section>
  </main>
  <!-- <h1
    class="h-screen font-sans font-black uppercase text-palette-primary-500 text-[4rem] text-center w-4/6 mx-auto"
  >
    The search engine for creative people
  </h1> -->
</template>

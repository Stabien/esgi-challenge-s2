<script setup>
import SquareImg from '@/components/SquareImg.vue';
import { urlImg } from '@/utils/constant';
import { getRandomItem } from '@/utils';
// import { Tracker } from 'tracker-vite';
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

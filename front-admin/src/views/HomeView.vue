<script setup>
import { inject } from 'vue';
import Button from '@/components/ui/Button.vue';
const { user, setIsLogged } = inject('user');
</script>

<template>
  <main>
    <section class="flex gap-8 flex-col w-min mx-auto">
      <span class="uppercase w-min font-bold text-[8rem] text-soft-black">Tracking</span>
      <span class="uppercase w-min font-bold text-[8rem] ml-56 font-gridular">world</span>
    </section>
    <Button @click="() => console.log(user)">log</Button>
    <Button @click="setIsLogged(!user.isLogged)">Test</Button>
  </main>
  <!-- <h1
    class="h-screen font-sans font-black uppercase text-palette-primary-500 text-[4rem] text-center w-4/6 mx-auto"
  >
    The search engine for creative people
  </h1> -->
</template>

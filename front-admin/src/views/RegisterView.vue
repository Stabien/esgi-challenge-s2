<script setup>
import RegisterWithPassword from '@/components/RegisterWithPassword.vue';
import { randomInt } from '@/utils';
</script>

<template>
  <main
    :style="{ paddingTop: '0' }"
    class="grid md:grid-cols-1/3 grid-cols-1 mx-auto w-full h-screen"
  >
    <img
      :src="`/join/join${randomInt(1, 6)}.jpg`"
      alt="join Image"
      class="h-full md:block hidden pt-0 object-cover"
    />
    <section class="pt-24 mx-auto h-full md:w-4/6 w-[28rem] place-items-center">
      <RegisterWithPassword />
    </section>
  </main>
</template>

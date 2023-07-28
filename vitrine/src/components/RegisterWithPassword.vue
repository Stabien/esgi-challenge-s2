<script setup>
import { ref } from 'vue';
import Button from '@/components/ui/Button.vue';

const email = ref('');
const pwd = ref('');

</script>

<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-4 w-full">
    <h1
      class="xl:text-[4rem] text-palette-primary-500 dark:text-soft-white gap-4 text-[2rem] font-bold"
    >
      Join Virtual world
    </h1>
    <label for="email">Email</label>
    <input type="email" v-model="email" />
    <label for="password">Password</label>
    <input type="password" v-model="pwd" />
    <Button type="submit">Join</Button>
  </form>
</template>

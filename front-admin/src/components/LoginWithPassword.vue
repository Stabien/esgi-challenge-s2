<script setup>
import { ref, defineProps } from 'vue';

import Button from '@/components/ui/Button.vue';

const props = defineProps(['isAdmin']);
const email = ref('');
const pwd = ref('');

const sub = () => {
  if (props.isAdmin) {
    console.log('je suis admin');
  } else {
    console.log('je suis pas admin');
  }
  console.log(email.value);
  console.log(pwd.value);
};
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-4 w-full">
    <h1 class="inline-flex items-center gap-4 text-2xl font-bold dark:text-soft-black">Login</h1>
    <label for="email">Email</label>
    <input type="email" v-model="email" />
    <label for="password">Password</label>
    <input type="password" v-model="pwd" />
    <Button type="submit" @click="sub">Login</Button>
  </form>
</template>

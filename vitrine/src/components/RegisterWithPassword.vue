<script setup>
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'

const email = ref('')
const pwd = ref('')

const sub = () => {
  console.log(email.value)
  console.log(pwd.value)
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-4 w-full">
    <h1 class="xl:text-[4rem] dark:text-soft-white gap-4 text-[2rem] font-bold">
      Join Virtual world
    </h1>
    <h2 class="underline text-palette-primary-500 xl:text-xl text-base mb-8">
      Join now and enjoy a free access to the blog
    </h2>
    <label for="email">Email</label>
    <input type="email" v-model="email" />
    <label for="password">Password</label>
    <input type="password" v-model="pwd" />
    <Button type="submit" @click="sub">Join</Button>
  </form>
</template>

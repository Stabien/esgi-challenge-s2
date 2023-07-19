<script setup>
import Button from '@/components/ui/Button.vue'
import { ref } from 'vue'

const email = ref('')
const pwd = ref('')

const sub = () => {
  console.log(email)
  console.log(pwd)
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-4 px-8">
    <h1 class="inline-flex items-center gap-4 text-2xl font-bold dark:text-soft-black">Login</h1>
    <label for="email">Email</label>
    <input type="email" v-model="email" />
    <label for="password">Password</label>
    <input type="password" v-model="pwd" />
    <Button type="submit" @click="sub"> Test</Button>
  </form>
</template>

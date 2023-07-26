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
  <form @submit.prevent="onSubmit" class="flex flex-col gap-4 w-full" v-mouse:FORM-LOGIN>
    <h1 class="inline-flex items-center gap-4 text-2xl font-bold dark:text-soft-black">Login</h1>
    <label for="email">Email</label>
    <input type="email" v-track:FORM-EMAIL.click.change v-model="email" />
    <label for="password">Password</label>
    <input type="password" v-model="pwd" v-track:LOGIN-PWD.click.change/>
    <Button type="submit" @click="sub" v-track:FORM-SUB.click>Login</Button>
  </form>
</template>

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
    <input type="email" v-model="email" />
    <input type="password" v-model="pwd" />
    <Button type="submit" @click="sub"> Test</Button>
  </form>
</template>

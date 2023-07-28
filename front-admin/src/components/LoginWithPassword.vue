<script setup>
import Button from '@/components/ui/Button.vue';
import { updateLocalStorage } from '@/utils';
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const props = defineProps(['isAdmin']);
const toast = useToast();

const email = ref('');
const pwd = ref('');
const router = useRouter();

const login = async () => {
  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        email: email.value,
        password: pwd.value
      }),
      headers
    };
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/${props.isAdmin ? 'admin' : 'user'}/authentication`,
      requestOptions
    );
    if (!response.ok) throw new Error('Something went wrong');

    const data = await response.json();
    updateLocalStorage('token', data.token);
    toast('Your are now logged');
    router.push('/');
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};
</script>

<template>
  <form @submit.prevent="login" class="flex flex-col gap-4 w-full">
    <h1 class="inline-flex items-center gap-4 text-2xl font-bold dark:text-soft-black">Login</h1>
    <label for="email">Email</label>
    <input type="email" v-model="email" />
    <label for="password">Password</label>
    <input type="password" v-model="pwd" />
    <Button type="submit">Login</Button>
  </form>
</template>

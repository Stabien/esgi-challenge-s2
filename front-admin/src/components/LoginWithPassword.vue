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
const isLoading = ref(false);
const router = useRouter();

const login = async () => {
  try {
    isLoading.value = true;

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
  isLoading.value = false;
};
</script>

<template>
  <form @submit.prevent="login" class="flex flex-col gap-4 w-full">
    <h1 class="inline-flex items-center gap-4 text-2xl font-bold dark:text-soft-black">Login</h1>
    <label for="email">Email</label>
    <input data-cy="emailInput" type="email" v-model="email" />
    <label for="password">Password</label>
    <input data-cy="passwordInput" type="password" v-model="pwd" />
    <Button data-cy="submit" type="submit">
      <LoadingIcon v-if="isLoading" />
      {{ isLoading ? 'Loading' : 'Login' }}</Button
    >
  </form>
</template>

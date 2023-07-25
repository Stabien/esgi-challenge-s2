<script setup>
import { ref, defineProps } from 'vue';
import { useToast } from 'vue-toastification';
import { errorHandler } from '@/utils';
import { inject } from 'vue';
import Button from '@/components/ui/Button.vue';
import { userStatusWebmaster } from '@/utils/userConstant';

const props = defineProps(['isAdmin']);
const { setIsLogged, setStatus } = inject('user');
const toast = useToast();

const email = ref('');
const pwd = ref('');

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
      `http://localhost:4000/api/${props.isAdmin ? 'admin' : 'user'}/authentication`,
      requestOptions
    );
    const data = await response.json();
    localStorage.setItem('token', data.user.token);
    setIsLogged(true);
    setStatus(userStatusWebmaster);
  } catch (error) {
    console.log(error);
    toast.error(errorHandler(error));
  }
};
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-4 w-full">
    <h1 class="inline-flex items-center gap-4 text-2xl font-bold dark:text-soft-black">Login</h1>
    <label for="email">Email</label>
    <input type="email" v-model="email" />
    <label for="password">Password</label>
    <input type="password" v-model="pwd" />
    <Button type="submit" @click="login">Login</Button>
  </form>
</template>

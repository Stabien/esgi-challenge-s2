<script setup>
import LoginWithPassword from '@/components/LoginWithPassword.vue';
import { inject, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const { user } = inject('user');
const router = useRouter();
const redirect = () => {
  if (user.value.isLogged) router.push('/');
};
onMounted(() => {
  redirect();
});
watch(user.value, () => {
  redirect();
});
</script>

<template>
  <main class="mx-auto flex h-full w-[28rem] place-items-center overflow-y-hidden">
    <LoginWithPassword :isAdmin="router.currentRoute.value.path === '/login-admin'" />
  </main>
</template>

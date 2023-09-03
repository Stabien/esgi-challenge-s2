<script setup>
import LoginWithPassword from '@/components/LoginWithPassword.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <main class="mx-auto h-full w-[28rem] place-items-center overflow-y-hidden">
    <LoginWithPassword :isAdmin="router.currentRoute.value.path === '/login-admin'" />
    <section class="mt-8">
      <div class="w-full flex gap-2 items-center">
        <span class="border-b-[1px] border-palette-gray-200 w-full" />
        <span>Or</span>
        <span class="border-b-[1px] border-palette-gray-200 w-full" />
      </div>
      <Link
        variant="outline"
        class="w-full mt-4"
        :to="router.currentRoute.value.path === '/login-admin' ? '/login' : '/login-admin'"
        >Login as
        {{ router.currentRoute.value.path === '/login-admin' ? 'Webmaster' : 'Admin' }}</Link
      >
    </section>
  </main>
</template>

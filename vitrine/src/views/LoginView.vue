<script setup>
import LoginWithPassword from '@/components/LoginWithPassword.vue';
import { onMounted } from 'vue';
import { getURL } from '../utils/trackerUtils/handleUrl';

onMounted(() => {
  document.dispatchEvent(
    new CustomEvent('print', {
      detail: {
        appId: import.meta.env.VITE_TRACKER_APPID,
        event: 'print',
        url: getURL(),
        sessionId: window.localStorage.getItem('Session_ID'),
        timestamp: Date.now()
      }
    })
  );
});
</script>

<template>
  <main class="mx-auto flex h-full w-[28rem] place-items-center overflow-y-hidden">
    <LoginWithPassword />
  </main>
</template>

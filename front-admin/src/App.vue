<script setup>
import { RouterView } from 'vue-router';
import Layout from '@/components/Layout.vue';
import { getLogo, getConnectionProviderValue } from '@/utils';
import { provide, ref } from 'vue';
import { io } from 'socket.io-client';
// Change FavIcon
var link = document.querySelector("link[rel~='icon']");
if (!link) {
  link = document.createElement('link');
  link.rel = 'icon';
  document.head.appendChild(link);
}
link.href = getLogo();

//verify if already connected
const providerValue = getConnectionProviderValue();
const user = ref(providerValue);

window.addEventListener('local-storage-updated', () => {
  const newProviderValue = getConnectionProviderValue();
  user.value = newProviderValue;
});
window.addEventListener('storage', () => {
  const newProviderValue = getConnectionProviderValue();
  user.value = newProviderValue;
});

provide('user', {
  user
});

// socket io connection
const socket = io('http://localhost:4000');
socket.on('connect', () => {
  console.log('Connected to Socket.IO server.');
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO server.');
});
</script>

<template>
  <Layout v-if="$route.meta.layout !== 'none'" />
  <RouterView class="pt-24" />
</template>

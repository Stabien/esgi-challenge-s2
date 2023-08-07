<script setup>
import { RouterView } from 'vue-router';
import Layout from '@/components/Layout.vue';
import { updateLocalStorage } from '@/utils';
import { getLogo, getConnectionProviderValue } from '@/utils';
import { provide, ref, watch, onMounted } from 'vue';
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
const socket = io(import.meta.env.VITE_PROD_API_URL);
// socket.on('connect', () => {
//   console.log('Connected to Socket.IO server.');
// });
// socket.on('disconnect', () => {
//   console.log('Disconnected from Socket.IO server.');
// });

socket.on('updateUserDocument', async () => {
  //gonna fetch user to update token
  const response = await fetch(
    `${import.meta.env.VITE_PROD_API_URL}/api/user/getUserToken/${user.value.decodedToken.uuid}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  if (!response.ok) throw new Error('Something went wrong');
  const data = await response.json();
  updateLocalStorage('token', data.token);
});
socket.on('message', (arg) => {
  console.log(arg); // world
});

const hadleSocketRoom = (userValue) => {
  if (userValue.decodedToken.appId) {
    socket.emit('connectedWithAppId', { appId: userValue.decodedToken.appId });
  } else {
    socket.emit('leaveRoom', { appId: user.value.decodedToken.appId });
  }
};
watch(user, (u) => {
  hadleSocketRoom(u);
});
onMounted(() => {
  hadleSocketRoom(user.value);
});

provide('socket', {
  socket
});
</script>

<template>
  <Layout v-if="$route.meta.layout !== 'none'" />
  <RouterView class="pt-24" />
</template>

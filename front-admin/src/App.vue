<script setup>
import { RouterView } from 'vue-router';
import Layout from '@/components/Layout.vue';
import { updateLocalStorage } from '@/utils';
import { getConnectionProviderValue } from '@/utils';
import { provide, ref, watch, onMounted, reactive } from 'vue';
import { io } from 'socket.io-client';

//verify if already connected
const providerValue = getConnectionProviderValue();
const user = ref(providerValue);
provide('user', {
  user
});
['local-storage-updated', 'storage'].forEach((event) => {
  window.addEventListener(event, () => {
    const newProviderValue = getConnectionProviderValue();
    user.value = newProviderValue;
  });
});

// socket io connection
const socket = io(import.meta.env.VITE_PROD_API_URL);
provide('socket', {
  socket
});
socket.onAny((eventName) => {
  console.log(eventName);
});
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

//join of leave socket room if user is connected or not
const handleSocketRoom = (userValue) =>
  socket.emit(userValue.decodedToken.appId ? 'connectedWithAppId' : 'leaveRoom', {
    appId: userValue.decodedToken.appId
      ? userValue.decodedToken.appId
      : user.value.decodedToken.appId
  });

watch(user, (u) => handleSocketRoom(u));
onMounted(() => handleSocketRoom(user.value));

//Graph settings
const graphSettings = reactive(
  JSON.parse(localStorage.getItem('graphSettings')) || {
    appId: user.value.decodedToken.appId,
    data_type: 'quantity', //percentages or quantity
    graph_type: 'BarChart', //list of selected Graphs
    graphSize: 1, //size of graph: 1 to 10
    timeScale: 'D', //D, W, M,Y day, week, month, year
    tagUuid: [],
    event: 'click' //click, newSession, navigation,
  }
  //   appId: user.value.decodedToken.appId,
  //   graphValue: 'quantity', //percentages or quantity
  //   selectedGraph: 'BarChart', //list of selected Graphs
  //   graphSize: 1, //size of graph: 1 to 10
  //   graphPeriod: 'D', //D, W, M,Y day, week, month, year
  //   selectedTags: '',
  //   event: 'click' //click, newSession, navigation,
  // }
);

provide('graphSettings', { graphSettings });
</script>

<template>
  <Layout v-if="$route.meta.layout !== 'none'" />
  <RouterView class="pt-24" />
</template>
